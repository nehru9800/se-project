
import {
  LayoutDashboard,
  BriefcaseBusiness,
  MessageSquare,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Code2,
  Workflow,
  Network,
  FolderOpen,
  ClipboardCheck,
  BookOpen,
  History,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'workspace'
  | 'interview'
  | 'requirements'
  | 'quality'
  | 'compliance'
  | 'risks'
  | 'sdlc'
  | 'workflow'
  | 'traceability'
  | 'documents'
  | 'approvals'
  | 'knowledge'
  | 'audit'
  | 'evaluation';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingApprovalsCount: number;
  openIssuesCount: number;
  complianceGapCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'workspace', label: 'Project Workspace', icon: BriefcaseBusiness },
      { id: 'evaluation', label: 'Evaluation & Benchmarking', icon: BarChart3, badge: 'Step 7' },
    ],
  },
  {
    title: 'REQUIREMENTS',
    items: [
      { id: 'interview', label: 'AI Interviews', icon: MessageSquare },
      { id: 'requirements', label: 'Requirements', icon: FileText },
      { id: 'quality', label: 'Quality Analysis', icon: ShieldCheck },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
      { id: 'risks', label: 'Risk Management', icon: AlertTriangle },
      { id: 'approvals', label: 'Approvals', icon: ClipboardCheck },
      { id: 'audit', label: 'Audit Trail', icon: History },
    ],
  },
  {
    title: 'ENGINEERING',
    items: [
      { id: 'sdlc', label: 'SDLC Planning', icon: Code2 },
      { id: 'workflow', label: 'Workflow', icon: Workflow },
      { id: 'traceability', label: 'Traceability', icon: Network },
      { id: 'documents', label: 'Documents', icon: FolderOpen },
      { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    ],
  },
];

export function Sidebar({
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
  openIssuesCount,
  complianceGapCount,
}: SidebarProps) {
  const getBadgeCount = (id: ActiveTab): number => {
    if (id === 'approvals') return pendingApprovalsCount;
    if (id === 'risks') return openIssuesCount;
    if (id === 'compliance') return complianceGapCount;
    return 0;
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-700 bg-slate-900 text-slate-200">
      <div className="flex h-16 items-center gap-3 border-b border-slate-700 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldCheck size={21} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">FinTech SDLC</h1>
          <p className="text-xs text-slate-400">AI Decision Support</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-400">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const badgeCount = getBadgeCount(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 font-semibold text-blue-300'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>

                    {item.badge && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                        {item.badge}
                      </span>
                    )}

                    {badgeCount > 0 && (
                      <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
                        {badgeCount}
                      </span>
                    )}

                    {isActive && <ChevronRight size={15} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <p className="text-xs font-medium text-slate-200">FinTech SDLC Platform</p>
        <p className="mt-1 text-[11px] text-slate-400">Agentic AI • Governance • SDLC</p>
      </div>
    </aside>
  );
}
