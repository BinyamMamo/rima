// Gemini Live API for real-time voice conversations
const MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';
const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`;

export interface GeminiLiveAPIConfig {
  apiKey: string;
  onTranscript?: (text: string) => void;
  onPhaseChange?: (phase: 'connecting' | 'listening' | 'processing' | 'speaking' | 'idle') => void;
  onError?: (error: Error) => void;
  systemInstruction?: string;
}

export class GeminiLiveAPI {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private audioPlaybackQueue: ArrayBuffer[] = [];
  private isPlaying = false;
  private config: GeminiLiveAPIConfig;
  private currentPhase: 'connecting' | 'listening' | 'processing' | 'speaking' | 'idle' = 'connecting';

  constructor(config: GeminiLiveAPIConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Get user's microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        }
      });

      // Set up Web Audio API for microphone input
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create ScriptProcessorNode for audio capture
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (this.currentPhase === 'listening') {
          const audioData = event.inputBuffer.getChannelData(0);
          this.sendAudioChunk(audioData);
        }
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      // Connect to Live API WebSocket
      await this.connectWebSocket();
    } catch (error) {
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${WS_URL}?key=${this.config.apiKey}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('Connected to Gemini Live API');
        this.sendSetupMessage();
        resolve();
      };

      this.ws.onmessage = async (event) => {
        try {
          let data = event.data;

          // Handle Blob data (convert to text)
          if (data instanceof Blob) {
            data = await data.text();
          }

          const message = JSON.parse(data);
          console.log('Received message from server:', message);
          this.handleServerMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error, 'Raw data:', event.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.(new Error('WebSocket connection failed'));
        reject(error);
      };

      this.ws.onclose = (event) => {
        console.log('Disconnected from Gemini Live API', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        this.setPhase('idle');
      };
    });
  }

  private sendSetupMessage(): void {
    const systemInstruction = this.config.systemInstruction ||
      'You are Rima, a helpful and friendly AI assistant. Keep responses concise and natural for voice conversation. Respond warmly and with personality.';

    const setupMessage = {
      setup: {
        model: MODEL,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          }
        },
        systemInstruction: {
          parts: [
            {
              text: 'You are Rima, a helpful and friendly AI assistant. When the conversation starts, introduce yourself briefly and naturally. Keep responses concise and conversational.'
            }
          ]
        }
      }
    };

    console.log('Sending setup message:', setupMessage);
    this.ws?.send(JSON.stringify(setupMessage));
  }

  private sendAudioChunk(audioData: Float32Array): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Convert Float32Array to Int16Array (required for 16-bit PCM)
      const int16Array = this.floatTo16BitPCM(audioData);

      // Encode to base64
      const base64Audio = this.arrayBufferToBase64(int16Array.buffer);

      const realtimeInputMessage = {
        realtimeInput: {
          mediaChunks: [
            {
              data: base64Audio,
              mimeType: 'audio/pcm'
            }
          ]
        }
      };

      this.ws.send(JSON.stringify(realtimeInputMessage));
    }
  }

  private handleServerMessage(message: any): void {
    // Handle setup completion
    if (message.setupComplete) {
      console.log('Setup complete - conversation started');
      this.setPhase('listening');
      return;
    }

    // Handle server content (model responses)
    if (message.serverContent) {
      console.log('Server content details:', JSON.stringify(message.serverContent, null, 2));
      const { modelTurn, turnComplete, interrupted } = message.serverContent;

      if (interrupted) {
        console.log('Model turn interrupted');
        this.audioPlaybackQueue = [];
        this.isPlaying = false;
        this.setPhase('listening');
      }

      if (modelTurn && modelTurn.parts) {
        console.log('Model turn parts:', modelTurn.parts.length, 'parts');
        let hasAudio = false;
        for (const part of modelTurn.parts) {
          console.log('Part type:', Object.keys(part), 'MimeType:', part.inlineData?.mimeType);

          if (part.inlineData && part.inlineData.mimeType === 'audio/pcm') {
            hasAudio = true;
            console.log('Audio data received, length:', part.inlineData.data?.length);
            // Queue audio for playback
            const audioBuffer = this.base64ToArrayBuffer(part.inlineData.data);
            this.audioPlaybackQueue.push(audioBuffer);

            if (!this.isPlaying) {
              this.setPhase('speaking');
              this.playQueuedAudio();
            }
          }

          if (part.text) {
            console.log('Model text:', part.text);
            this.config.onTranscript?.(part.text);
          }
        }

        if (!hasAudio && modelTurn.parts.some((p: any) => p.text)) {
          console.log('Text only response, no audio');
          this.setPhase('processing');
        }
      }

      if (turnComplete) {
        console.log('Model turn completed');
        if (!this.isPlaying) {
          this.setPhase('listening');
        }
      }
    }

    // Handle tool calls (if needed in the future)
    if (message.toolCall) {
      console.log('Tool call received:', message.toolCall);
    }
  }

  private async playQueuedAudio(): Promise<void> {
    console.log('playQueuedAudio called, isPlaying:', this.isPlaying, 'queue length:', this.audioPlaybackQueue.length);

    if (this.isPlaying || this.audioPlaybackQueue.length === 0) {
      return;
    }

    this.isPlaying = true;
    this.setPhase('speaking');

    while (this.audioPlaybackQueue.length > 0) {
      const audioBuffer = this.audioPlaybackQueue.shift();
      if (!audioBuffer) continue;

      console.log('Playing audio chunk, buffer size:', audioBuffer.byteLength);

      // Convert to float32 for Web Audio API
      const int16Array = new Int16Array(audioBuffer);
      const float32Array = this.int16ToFloat(int16Array);

      console.log('Converted to float32, samples:', float32Array.length);

      // Create AudioBuffer
      const audioCtxBuffer = this.audioContext!.createBuffer(
        1, // mono
        float32Array.length,
        24000 // 24kHz output sample rate
      );

      audioCtxBuffer.getChannelData(0).set(float32Array);

      console.log('AudioBuffer created, duration:', audioCtxBuffer.duration, 'seconds');

      // Play the audio
      const source = this.audioContext!.createBufferSource();
      source.buffer = audioCtxBuffer;
      source.connect(this.audioContext!.destination);

      console.log('Starting playback...');

      await new Promise<void>((resolve) => {
        source.onended = () => {
          console.log('Audio chunk finished playing');
          resolve();
        };
        source.start(0);
      });
    }

    console.log('All audio chunks played');
    this.isPlaying = false;
    this.setPhase('listening');
  }

  public async sendTextMessage(text: string): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [
                {
                  text: text
                }
              ]
            }
          ],
          turnComplete: true
        }
      };

      this.ws.send(JSON.stringify(message));
      this.setPhase('processing');
    }
  }

  private setPhase(phase: typeof this.currentPhase): void {
    if (this.currentPhase !== phase) {
      this.currentPhase = phase;
      this.config.onPhaseChange?.(phase);
    }
  }

  // Utility: Convert Float32 to 16-bit PCM
  private floatTo16BitPCM(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }

  // Utility: Convert 16-bit PCM to Float32
  private int16ToFloat(int16Array: Int16Array): Float32Array {
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
    }
    return float32Array;
  }

  // Utility: Convert ArrayBuffer to Base64
  private arrayBufferToBase64(buffer: ArrayBufferLike): string {
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  // Utility: Convert Base64 to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public disconnect(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.processor) {
      this.processor.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}
