import React from 'react';
import { NavTab } from '../types';

interface TopHeaderProps {
  activeTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenSettingsModal: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenSettingsModal,
  searchQuery,
  onSearchChange,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Study Dashboard';
      case 'syllabus':
        return 'Syllabus Tracker';
      case 'tasks':
        return 'Actionable Tasks';
      case 'projects':
        return 'Course Projects';
      case 'calendar':
        return 'Academic Calendar';
      case 'ai-lab':
        return 'AI Syllabus Lab';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0f172a]/60 backdrop-blur-2xl border-b border-white/10">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-2xl text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-headline-md tracking-tight text-white flex items-center gap-2">
            <span>{getTabTitle(activeTab)}</span>
          </h1>
          <p className="text-xs text-white/50 hidden sm:block">
            Fall Semester 2024 • Academic Sprint
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-white/40 text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search syllabus units, assignments, notes..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-indigo-400/60 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <button
          onClick={() => {
            alert('Notifications: You have 2 deadlines approaching in 48 hours (CS 301 & MATH 201).');
          }}
          className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-[#0f172a]" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettingsModal}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          title="Academic Settings"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>

        {/* User Pill */}
        <div
          onClick={onOpenSettingsModal}
          className="flex items-center gap-3 pl-2 pr-3.5 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 border border-white/30 flex items-center justify-center font-bold text-xs text-white shadow-md">
            AL
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-bold text-white leading-tight">Alex Lin</div>
            <div className="text-[10px] text-white/50 leading-none mt-0.5">Computer Science '25</div>
          </div>
        </div>
      </div>
    </header>
  );
};
