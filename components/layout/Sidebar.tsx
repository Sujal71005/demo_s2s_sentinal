import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Waves,
  ShieldAlert,
  Route,
  BarChart3,
  Settings,
  Activity,
  Satellite,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description: string;
}

const mainNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & live intelligence',
  },
  {
    label: 'Incident Map',
    href: '/incidents',
    icon: Map,
    description: 'Geospatial incident view',
  },
  {
    label: 'Flood Analysis',
    href: '/flood-analysis',
    icon: Waves,
    description: 'Satellite flood detection',
  },
  {
    label: 'Risk Assessment',
    href: '/risk',
    icon: ShieldAlert,
    description: 'Infrastructure risk scoring',
  },
  {
    label: 'Response Planner',
    href: '/response',
    icon: Route,
    description: 'Actions & safer routes',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Trends & impact analysis',
  },
];

const bottomNav: NavItem[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application configuration',
  },
  {
    label: 'System Status',
    href: '/system-status',
    icon: Activity,
    description: 'Platform health',
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          'group flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-primary/15 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0',
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />
        <div className="flex flex-col">
          <span>{item.label}</span>
          <span
            className={cn(
              'text-[11px] leading-tight',
              isActive ? 'text-primary/70' : 'text-muted-foreground/60'
            )}
          >
            {item.description}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Satellite className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-foreground">
            S2S SENTINELS
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Satellite-to-Street Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {mainNav.map(renderNavItem)}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        {bottomNav.map(renderNavItem)}
      </div>
    </div>
  );
}
