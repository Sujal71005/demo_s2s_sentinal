import type { Incident } from '@/types/incident';
import type { Facility } from '@/types/facility';
import type { FloodZone } from '@/types/flood';
import type { Road } from '@/types/road';
import type { RiskAssessment } from '@/types/risk';
import type { ResponseAction, Route } from '@/types/response';

export interface StudyArea {
  id: string;
  name: string;
  region: string;
  state: string;
  description: string;
  startDate: string;
  centerLon: number;
  centerLat: number;
  bufferSizeMeters: number;
  zoom: number;
  floodDate: string;
  dateRange: [string, string]; // [start, end] for robust GEE SAR imagery retrieval
  preEventDateRange: [string, string];  // default pre-event window for change detection
  postEventDateRange: [string, string]; // default post-event window for change detection
  relativeOrbit?: number;
  orbitDirection: 'ASCENDING' | 'DESCENDING';
  polarization: string;
  thresholdDb: number;
  changeThresholdDb: number; // dB change threshold for bi-temporal detection (negative = flood)
  estimatedAreaKm2: number;
  affectedRoadsCount: number;
  populationExposed: number;
  criticalFacilitiesCount: number;
}


export const STUDY_AREAS: Record<string, StudyArea> = {
  sangli: {
    id: 'sangli',
    name: 'Sangli Flood Analysis',
    region: 'Sangli District, Maharashtra, India',
    state: 'Maharashtra',
    description:
      'Sentinel-1 SAR-based potential flood detection for Sangli, Maharashtra (Krishna & Warna Rivers overflow).',
    startDate: '2019-08-14',
    centerLon: 74.58,
    centerLat: 16.85,
    bufferSizeMeters: 30000,
    zoom: 12,
    floodDate: '2019-08-14',
    dateRange: ['2019-08-01', '2019-08-25'],
    preEventDateRange: ['2019-06-01', '2019-07-31'],
    postEventDateRange: ['2019-08-01', '2019-08-31'],

    relativeOrbit: 136,
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -17,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 5.01,
    affectedRoadsCount: 17,
    populationExposed: 5284,
    criticalFacilitiesCount: 4,
  },
  kolhapur: {
    id: 'kolhapur',
    name: 'Kolhapur & Panchganga Basin',
    region: 'Kolhapur District, Maharashtra, India',
    state: 'Maharashtra',
    description:
      'Severe monsoon inundation across the Panchganga river basin causing major arterial highway cutoffs.',
    startDate: '2019-08-10',
    centerLon: 74.24,
    centerLat: 16.70,
    bufferSizeMeters: 30000,
    zoom: 12,
    floodDate: '2019-08-10',
    dateRange: ['2019-08-01', '2019-08-20'],
    preEventDateRange: ['2019-07-01', '2019-08-05'],
    postEventDateRange: ['2019-08-06', '2019-08-22'],
    relativeOrbit: 136,
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -16,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 8.45,
    affectedRoadsCount: 24,
    populationExposed: 12450,
    criticalFacilitiesCount: 6,
  },

  chennai: {
    id: 'chennai',
    name: 'Chennai Urban Inundation',
    region: 'Chennai Metropolitan, Tamil Nadu, India',
    state: 'Tamil Nadu',
    description:
      'Adyar and Cooum river overflow leading to extensive coastal metropolitan flooding.',
    startDate: '2015-12-04',
    centerLon: 80.24,
    centerLat: 13.04,
    bufferSizeMeters: 25000,
    zoom: 11,
    floodDate: '2015-12-04',
    dateRange: ['2015-11-20', '2015-12-15'],
    preEventDateRange: ['2015-10-01', '2015-11-20'],
    postEventDateRange: ['2015-11-21', '2015-12-15'],
    relativeOrbit: 62,
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -16,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 14.8,
    affectedRoadsCount: 42,
    populationExposed: 38500,
    criticalFacilitiesCount: 11,
  },
  kerala: {
    id: 'kerala',
    name: 'Kerala (Aluva / Periyar)',
    region: 'Ernakulam District, Kerala, India',
    state: 'Kerala',
    description:
      'Periyar river overflow following heavy dam discharges during the 2018 mega flood.',
    startDate: '2018-08-18',
    centerLon: 76.35,
    centerLat: 10.11,
    bufferSizeMeters: 25000,
    zoom: 12,
    floodDate: '2018-08-18',
    dateRange: ['2018-08-05', '2018-08-28'],
    preEventDateRange: ['2018-07-01', '2018-08-05'],
    postEventDateRange: ['2018-08-06', '2018-08-28'],
    relativeOrbit: 19,
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -17,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 11.2,
    affectedRoadsCount: 31,
    populationExposed: 24800,
    criticalFacilitiesCount: 8,
  },
  assam: {
    id: 'assam',
    name: 'Assam (Brahmaputra Valley)',
    region: 'Kaziranga & Nagaon, Assam, India',
    state: 'Assam',
    description:
      'Brahmaputra river seasonal inundation submerging vast lowlands and national wildlife corridors.',
    startDate: '2020-07-20',
    centerLon: 93.17,
    centerLat: 26.58,
    bufferSizeMeters: 35000,
    zoom: 11,
    floodDate: '2020-07-20',
    dateRange: ['2020-07-01', '2020-07-31'],
    preEventDateRange: ['2020-05-01', '2020-06-30'],
    postEventDateRange: ['2020-07-01', '2020-07-31'],
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -16,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 26.7,
    affectedRoadsCount: 38,
    populationExposed: 46200,
    criticalFacilitiesCount: 5,
  },
  patna: {
    id: 'patna',
    name: 'Patna (Ganga Inundation)',
    region: 'Patna District, Bihar, India',
    state: 'Bihar',
    description:
      'Ganga and Punpun river basin waterlogging impacting urban sectors and rural agricultural tracts.',
    startDate: '2019-10-02',
    centerLon: 85.14,
    centerLat: 25.61,
    bufferSizeMeters: 25000,
    zoom: 12,
    floodDate: '2019-10-02',
    dateRange: ['2019-09-20', '2019-10-15'],
    preEventDateRange: ['2019-08-01', '2019-09-15'],
    postEventDateRange: ['2019-09-16', '2019-10-15'],
    orbitDirection: 'DESCENDING',
    polarization: 'VV',
    thresholdDb: -16,
    changeThresholdDb: -1.5,
    estimatedAreaKm2: 9.3,
    affectedRoadsCount: 19,
    populationExposed: 19400,
    criticalFacilitiesCount: 7,
  },
};


export const DEFAULT_STUDY_AREA = STUDY_AREAS.sangli;

export function getStudyArea(id?: string): StudyArea {
  if (!id) return DEFAULT_STUDY_AREA;
  const key = id.toLowerCase().replace(/^inc-/, '').replace(/-\d+$/, '');
  return STUDY_AREAS[key] ?? STUDY_AREAS[id.toLowerCase()] ?? DEFAULT_STUDY_AREA;
}

export function getAllStudyAreas(): StudyArea[] {
  return Object.values(STUDY_AREAS);
}

/**
 * Dynamically generates localized GIS features (flood zones, roads, facilities, routes, and risk assessments)
 * anchored around any study area's center coordinates [cx, cy].
 */
export function getAreaGisData(areaId?: string) {
  const area = getStudyArea(areaId);
  const cx = area.centerLon;
  const cy = area.centerLat;

  const incident: Incident = {
    id: `INC-${area.id.toUpperCase()}`,
    name: area.name,
    region: area.region,
    status: 'active',
    startDate: area.startDate,
    description: area.description,
    center: [cx, cy],
    zoom: area.zoom,
    dataSource: 'satellite',
    affectedAreaKm2: area.estimatedAreaKm2,
    affectedRoads: area.affectedRoadsCount,
    populationExposed: area.populationExposed,
    criticalFacilities: area.criticalFacilitiesCount,
  };

  const floodZones: FloodZone[] = [
    {
      id: `FZ-${area.id}-A`,
      name: `${area.name} — Primary Inundation Zone A`,
      riskLevel: 'critical',
      areaKm2: parseFloat((area.estimatedAreaKm2 * 0.45).toFixed(2)),
      confidence: 94,
      dataSource: 'satellite',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [cx - 0.035, cy + 0.02],
            [cx - 0.01, cy + 0.035],
            [cx + 0.02, cy + 0.015],
            [cx + 0.01, cy - 0.02],
            [cx - 0.025, cy - 0.03],
            [cx - 0.045, cy - 0.005],
            [cx - 0.035, cy + 0.02],
          ],
        ],
      },
    },
    {
      id: `FZ-${area.id}-B`,
      name: `${area.name} — Riverfront Overflow Zone B`,
      riskLevel: 'high',
      areaKm2: parseFloat((area.estimatedAreaKm2 * 0.3).toFixed(2)),
      confidence: 89,
      dataSource: 'satellite',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [cx + 0.015, cy - 0.025],
            [cx + 0.045, cy - 0.015],
            [cx + 0.055, cy - 0.045],
            [cx + 0.035, cy - 0.065],
            [cx + 0.008, cy - 0.055],
            [cx + 0.015, cy - 0.025],
          ],
        ],
      },
    },
    {
      id: `FZ-${area.id}-C`,
      name: `${area.name} — Lowland Plains Zone C`,
      riskLevel: 'moderate',
      areaKm2: parseFloat((area.estimatedAreaKm2 * 0.25).toFixed(2)),
      confidence: 82,
      dataSource: 'satellite',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [cx - 0.02, cy - 0.045],
            [cx + 0.01, cy - 0.038],
            [cx + 0.02, cy - 0.065],
            [cx, cy - 0.082],
            [cx - 0.03, cy - 0.075],
            [cx - 0.02, cy - 0.045],
          ],
        ],
      },
    },
  ];

  const facilities: Facility[] = [
    {
      id: `F-${area.id}-01`,
      name: `${area.name.split(' ')[0]} Civil / District Hospital`,
      type: 'hospital',
      riskLevel: 'critical',
      latitude: cy + 0.012,
      longitude: cx - 0.008,
      capacity: 450,
      occupants: 380,
      operational: true,
    },
    {
      id: `F-${area.id}-02`,
      name: `${area.name.split(' ')[0]} Emergency Relief Shelter`,
      type: 'shelter',
      riskLevel: 'moderate',
      latitude: cy + 0.025,
      longitude: cx + 0.015,
      capacity: 350,
      occupants: 190,
      operational: true,
    },
    {
      id: `F-${area.id}-03`,
      name: `${area.name.split(' ')[0]} Fire & Rescue HQ`,
      type: 'fire_station',
      riskLevel: 'moderate',
      latitude: cy - 0.005,
      longitude: cx + 0.035,
      capacity: 40,
      occupants: 32,
      operational: true,
    },
    {
      id: `F-${area.id}-04`,
      name: `${area.name.split(' ')[0]} Sector Police Command`,
      type: 'police',
      riskLevel: 'low',
      latitude: cy - 0.015,
      longitude: cx - 0.022,
      capacity: 60,
      occupants: 45,
      operational: true,
    },
  ];

  const roads: Road[] = [
    {
      id: `R-${area.id}-101`,
      name: `${area.name.split(' ')[0]} Main Arterial Highway`,
      class: 'highway',
      riskLevel: 'critical',
      riskScore: 92,
      floodExposure: 84,
      populationExposure: 'high',
      criticalConnectivity: true,
      geometry: {
        type: 'LineString',
        coordinates: [
          [cx - 0.045, cy + 0.012],
          [cx - 0.018, cy + 0.002],
          [cx + 0.012, cy - 0.008],
          [cx + 0.038, cy - 0.018],
          [cx + 0.065, cy - 0.028],
        ],
      },
    },
    {
      id: `R-${area.id}-102`,
      name: `${area.name.split(' ')[0]} River Bridge Connector`,
      class: 'secondary',
      riskLevel: 'critical',
      riskScore: 89,
      floodExposure: 91,
      populationExposure: 'moderate',
      criticalConnectivity: true,
      geometry: {
        type: 'LineString',
        coordinates: [
          [cx - 0.022, cy + 0.025],
          [cx + 0.002, cy + 0.012],
          [cx + 0.025, cy + 0.002],
        ],
      },
    },
    {
      id: `R-${area.id}-103`,
      name: `${area.name.split(' ')[0]} Central Relief Corridor`,
      class: 'major',
      riskLevel: 'high',
      riskScore: 73,
      floodExposure: 65,
      populationExposure: 'high',
      criticalConnectivity: true,
      geometry: {
        type: 'LineString',
        coordinates: [
          [cx - 0.028, cy + 0.032],
          [cx + 0.002, cy + 0.022],
          [cx + 0.032, cy + 0.012],
        ],
      },
    },
    {
      id: `R-${area.id}-104`,
      name: `${area.name.split(' ')[0]} High-Ground Bypass Route`,
      class: 'highway',
      riskLevel: 'low',
      riskScore: 24,
      floodExposure: 12,
      populationExposure: 'moderate',
      criticalConnectivity: true,
      geometry: {
        type: 'LineString',
        coordinates: [
          [cx - 0.04, cy + 0.04],
          [cx, cy + 0.045],
          [cx + 0.04, cy + 0.035],
          [cx + 0.07, cy + 0.02],
        ],
      },
    },
  ];

  const riskAssessments: RiskAssessment[] = [
    {
      id: `RA-${area.id}-01`,
      roadId: `R-${area.id}-101`,
      roadName: `${area.name.split(' ')[0]} Main Arterial Highway`,
      riskScore: 92,
      riskLevel: 'critical',
      factorBreakdown: {
        floodExposure: 84,
        populationExposure: 78,
        roadImportance: 95,
        criticalFacility: 100,
        elevationRisk: 82,
      },
      priority: 1,
      recommendation: `Immediate closure required. Divert emergency transit via ${area.name.split(' ')[0]} High-Ground Bypass Route.`,
    },
    {
      id: `RA-${area.id}-02`,
      roadId: `R-${area.id}-102`,
      roadName: `${area.name.split(' ')[0]} River Bridge Connector`,
      riskScore: 89,
      riskLevel: 'critical',
      factorBreakdown: {
        floodExposure: 91,
        populationExposure: 52,
        roadImportance: 80,
        criticalFacility: 95,
        elevationRisk: 88,
      },
      priority: 2,
      recommendation: 'Structural inspection mandatory. Restrict heavy traffic and deploy patrol boats.',
    },
  ];

  const responseActions: ResponseAction[] = [
    {
      id: `ACT-${area.id}-01`,
      type: 'close_road',
      title: `Close Road R-${area.id.toUpperCase()}-101`,
      description: `${area.name.split(' ')[0]} Main Highway is critically inundated with 84% flood exposure. Divert traffic to bypass.`,
      priority: 'critical',
      targetId: `R-${area.id}-101`,
      completed: false,
    },
    {
      id: `ACT-${area.id}-02`,
      type: 'prioritize_access',
      title: `Prioritize Hospital Access Route`,
      description: `Ensure high-ground clearance to ${area.name.split(' ')[0]} District Hospital (380 active patients).`,
      priority: 'critical',
      targetId: `F-${area.id}-01`,
      completed: false,
    },
    {
      id: `ACT-${area.id}-03`,
      type: 'relief_camp',
      title: `Activate Relief Shelter`,
      description: `Open emergency shelter facilities for displaced citizens from Zone A.`,
      priority: 'high',
      targetId: `F-${area.id}-02`,
      completed: false,
    },
  ];

  const routes: Route[] = [
    {
      id: `ROUTE-${area.id.toUpperCase()}-SAFE`,
      name: `Safer Route: ${area.name.split(' ')[0]} High-Ground Bypass`,
      fromName: `${area.name.split(' ')[0]} Emergency Control Center`,
      toName: `${area.name.split(' ')[0]} District Hospital`,
      riskLevel: 'low',
      estimatedTimeMin: 28,
      distanceKm: 18.5,
      geometry: {
        type: 'LineString',
        coordinates: [
          [cx - 0.04, cy + 0.04],
          [cx - 0.015, cy + 0.038],
          [cx + 0.01, cy + 0.025],
          [cx - 0.008, cy + 0.012],
        ],
      },
    },
  ];

  return {
    incident,
    floodZones,
    facilities,
    roads,
    riskAssessments,
    responseActions,
    routes,
  };
}
