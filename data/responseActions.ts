import type { ResponseAction } from '@/types/response';

export const responseActions: ResponseAction[] = [
  {
    id: 'A-001',
    type: 'close_road',
    title: 'Close Road R-102',
    description:
      'Sangli-Kolhapur Highway is critically flooded at 82% exposure. Immediate closure required with traffic diversion via Miraj Bypass.',
    priority: 'critical',
    targetId: 'R-102',
    completed: false,
  },
  {
    id: 'A-002',
    type: 'inspect_bridge',
    title: 'Inspect Bridge B-04',
    description:
      'Krishna River Bridge on R-112 shows 90% flood exposure. Structural inspection required before reopening to heavy vehicles.',
    priority: 'critical',
    targetId: 'R-112',
    completed: false,
  },
  {
    id: 'A-003',
    type: 'prioritize_access',
    title: 'Prioritize District Hospital access',
    description:
      'Ensure clear access route to Sangli District Hospital. Hospital is operational with 420 patients and at critical flood risk.',
    priority: 'high',
    targetId: 'F-001',
    completed: false,
  },
  {
    id: 'A-004',
    type: 'monitor_zone',
    title: 'Monitor Zone C',
    description:
      'Agricultural plain flooding is moderate but expanding. Monitor for escalation and prepare evacuation plans for nearby villages.',
    priority: 'moderate',
    targetId: 'FZ-C',
    completed: false,
  },
  {
    id: 'A-005',
    type: 'relief_camp',
    title: 'Activate Emergency Shelter',
    description:
      'Civil Court Emergency Shelter has 120 available capacity. Activate relief operations for displaced population.',
    priority: 'high',
    targetId: 'F-003',
    completed: false,
  },
];
