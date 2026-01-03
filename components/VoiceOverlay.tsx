import React from 'react';
import VoiceMode from '@/components/VoiceMode';

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onCommandDetected?: (command: string) => void;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isOpen, onClose, onCommandDetected }) => {
    if (!isOpen) return null;
    return <VoiceMode isOpen={isOpen} onClose={onClose} />;
};

export default VoiceOverlay;
