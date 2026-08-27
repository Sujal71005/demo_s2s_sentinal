'use client';

import { Menu, Bell, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  description: string;
}

const pageTitleMap: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Flood Response Dashboard',
    description: 'Satellite-derived intelligence for faster ground-level disaster response.',
  },
  '/incidents': {
    title: 'Incident Map',
    description: 'Geospatial view of active flood incidents and affected infrastructure.',
  },
  '/map': {
    title: 'Incident Map',
    description: 'Geospatial view of active flood incidents and affected infrastructure.',
  },
  '/flood-analysis': {
    title: 'Flood Analysis',
    description: 'Before/after satellite comparison and flood extent detection.',
  },
  '/risk': {
    title: 'Risk Assessment',
    description: 'Infrastructure risk scoring and prioritized impact analysis.',
  },
  '/response': {
    title: 'Response Planner',
    description: 'Recommended actions, response plan, and safer route planning.',
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Flood impact trends, exposure analysis, and risk distribution.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Application configuration and system information.',
  },
  '/system-status': {
    title: 'System Status',
    description: 'Platform health and service availability.',
  },
};

export function Header({ title, description }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetClose className="absolute right-4 top-4 z-50" />
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div>
          <h2 className="text-base font-semibold text-foreground lg:text-lg">
            {title}
          </h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5 sm:flex">
          <Circle className="h-2.5 w-2.5 fill-risk-low text-risk-low" />
          <span className="text-xs font-medium text-muted-foreground">
            Operational
          </span>
        </div>

        <Badge
          variant="outline"
          className="border-risk-moderate/40 bg-risk-moderate/10 text-risk-moderate"
        >
          Demo Mode
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-high" />
        </Button>

        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export function getPageMeta(pathname: string): { title: string; description: string } {
  return (
    pageTitleMap[pathname] ?? {
      title: 'S2S Sentinels',
      description: 'Satellite-to-Street Intelligence Platform.',
    }
  );
}
