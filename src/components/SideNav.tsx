import React from 'react';
import { NavTab } from '../types';
import { BrandLogo } from './BrandLogo';

interface SideNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenFocusModal: () => void;
  onOpenSupportModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenFocusModal,
  onOpenSupportModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'syllabus', label: 'Syllabus', icon: 'description' },
    { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'ai-lab', label: 'AI Lab', icon: 'psychology' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] bg-[#0f172a]/70 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col py-6 transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={42} className="w-10 h-10 shadow-lg shadow-indigo-500/20" />
            <div>
              <div className="font-headline-md text-[20px] font-bold text-white tracking-tight leading-none">
                SyllabusAI
              </div>
              <div className="font-label-sm text-[12px] text-white/50 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Academic Hub</span>
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Focus Next Primary Action */}
        <div className="px-4 mb-5">
          <button
            onClick={() => {
              onOpenFocusModal();
              onCloseMobile();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 font-label-md text-[14px] font-bold shadow-lg shadow-indigo-600/30 border border-white/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">flare</span>
            <span>Focus Next</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-label-md text-[14px] font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-md backdrop-blur-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.id === 'ai-lab' ? 'text-purple-400' : 'text-white/60'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.id === 'ai-lab' && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status indicator widget */}
        <div className="px-4 mb-3">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[11px] text-white/40 uppercase mb-1.5 font-bold tracking-widest">
              Semester Engine
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></div>
                <span className="text-xs font-medium text-white/90">Sync Online</span>
              </div>
              <span className="text-[11px] text-indigo-300 font-semibold">Fall 2024</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto px-4 pt-3 border-t border-white/10 flex flex-col gap-1">
          <button
            onClick={onOpenSupportModal}
            className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl px-4 py-2.5 text-left text-[14px] font-label-md transition-all border border-transparent hover:border-white/10"
          >
            <span className="material-symbols-outlined text-[20px] text-white/50">help</span>
            <span>Support &amp; Guide</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out of SyllabusAI?')) {
                window.location.reload();
              }
            }}
            className="flex items-center gap-3 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl px-4 py-2.5 text-left text-[14px] font-label-md transition-all border border-transparent hover:border-red-500/20"
          >
            <span className="material-symbols-outlined text-[20px] text-white/40">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
