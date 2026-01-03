'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaretLeft, Briefcase, User, GraduationCap, Folders, Check, Plus, CaretDown, Star, Heart, Rocket, Globe } from '@phosphor-icons/react';
import { useWorkspaceData } from '@/contexts';
import { Workspace, ThemeColor, Room } from '@/types';
import { SYSTEM_USERS, PROFILES } from '@/constants';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';

export default function CreateWorkspacePage() {
    const router = useRouter();
    const { addWorkspace, addProfile, profiles } = useWorkspaceData();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProfileId, setSelectedProfileId] = useState<string>('p_work');
    const [selectedTheme, setSelectedTheme] = useState<ThemeColor>('violet');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Local state for category creation
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('Folders');
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

    const toggleDescription = () => setIsDescriptionOpen(!isDescriptionOpen);

    const ICONS = ['Folders', 'Briefcase', 'User', 'GraduationCap', 'Star', 'Heart', 'Rocket', 'Globe'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            const newWorkspace: Workspace = {
                id: `p_${Date.now()}`,
                title: name.trim(),
                description: description.trim(),
                theme: selectedTheme,
                profileId: selectedProfileId,
                members: [SYSTEM_USERS[0]],
                messages: [],
                rooms: [],
                insights: [],
                tasks: [],
                progress: 0,
                parentRoomId: null,
            };

            addWorkspace(newWorkspace);

            setTimeout(() => {
                router.push(`/workspace/${newWorkspace.id}`);
            }, 500);

        } catch (error) {
            console.error('Failed to create workspace', error);
            setIsSubmitting(false);
        }
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCat = {
            id: `p_${Date.now()}`,
            name: newCategoryName.trim(),
            icon: newCategoryIcon
        };
        addProfile(newCat);
        setNewCategoryName('');
        setNewCategoryIcon('Folders');
        setIsAddingCategory(false);
        setSelectedProfileId(newCat.id);
    };

    const getProfileIcon = (id: string, iconName?: string) => {
        // First try to match by ID for default ones (legacy support)
        if (id === 'p_work') return <Briefcase size={20} weight="bold" />;
        if (id === 'p_life') return <User size={20} weight="bold" />;
        if (id === 'p_edu') return <GraduationCap size={20} weight="bold" />;

        // Then try by icon name
        switch (iconName) {
            case 'Briefcase': return <Briefcase size={20} weight="bold" />;
            case 'User': return <User size={20} weight="bold" />;
            case 'GraduationCap': return <GraduationCap size={20} weight="bold" />;
            case 'Star': return <Star size={20} weight="bold" />;
            case 'Heart': return <Heart size={20} weight="bold" />;
            case 'Rocket': return <Rocket size={20} weight="bold" />;
            case 'Globe': return <Globe size={20} weight="bold" />;
            default: return <Folders size={20} weight="bold" />;
        }
    };

    const themes: { id: ThemeColor; color: string }[] = [
        { id: 'violet', color: '#8b5cf6' },
        { id: 'indigo', color: '#6366f1' },
        { id: 'sky', color: '#0ea5e9' },
        { id: 'teal', color: '#14b8a6' },
        { id: 'emerald', color: '#10b981' },
        { id: 'gold', color: '#f59e0b' },
        { id: 'rose', color: '#f43f5e' },
        { id: 'slate', color: '#64748b' },
    ];

    return (
        <>
            <Background />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="relative z-10 h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 h-16 flex items-center gap-4 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-sm">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                    >
                        <CaretLeft size={24} weight="bold" />
                    </button>
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">Create Workspace</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">

                            {/* Name & Description */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Workspace Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Q4 Marketing Campaign"
                                        className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all font-medium text-lg"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={toggleDescription}
                                        className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
                                    >
                                        <span>Description (Optional)</span>
                                        <CaretDown
                                            size={16}
                                            className={`transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''} group-hover:text-[var(--primary)]`}
                                        />
                                    </button>

                                    {isDescriptionOpen && (
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="What's this workspace about?"
                                            className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all font-medium resize-none h-24 animate-fade-in"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Category</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {profiles.map(profile => (
                                        <button
                                            key={profile.id}
                                            type="button"
                                            onClick={() => setSelectedProfileId(profile.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedProfileId === profile.id
                                                ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md'
                                                : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--primary)]'
                                                }`}
                                        >
                                            {getProfileIcon(profile.id, profile.icon)}
                                            <span className="text-sm font-bold">{profile.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Add Category Button - Outside Grid */}
                                <div className="mt-2">
                                    {!isAddingCategory ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingCategory(true)}
                                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
                                        >
                                            <Plus size={20} />
                                            <span className="text-sm font-bold">Add New</span>
                                        </button>
                                    ) : (
                                        <div className="w-full space-y-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-fade-in">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Category Name"
                                                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--primary)]"
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCategory}
                                                    className="p-2 bg-[var(--primary)] text-white rounded-xl"
                                                >
                                                    <Check size={18} weight="bold" />
                                                </button>
                                            </div>
                                            {/* Icon Selector */}
                                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                                {ICONS.map(icon => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() => setNewCategoryIcon(icon)}
                                                        className={`p-2 rounded-lg transition-all ${newCategoryIcon === icon ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'}`}
                                                    >
                                                        {getProfileIcon('', icon)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Theme Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Theme Accent</label>
                                <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl scrollbar-thin scrollbar-thumb-[var(--border-subtle)] scrollbar-track-transparent">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-card)] ring-[var(--text-primary)] scale-110' : 'hover:scale-110'
                                                }`}
                                            style={{ backgroundColor: theme.color }}
                                        >
                                            {selectedTheme === theme.id && <Check size={16} weight="bold" className="text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!name.trim() || isSubmitting}
                                className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--primary)]/20 mt-8"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Workspace'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
