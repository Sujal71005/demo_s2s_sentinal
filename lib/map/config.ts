import type { StyleSpecification } from 'maplibre-gl';

export const DEFAULT_MAP_STYLE =
  'https://api.maptiler.com/maps/basic/style.json';

export const FALLBACK_TILES: StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function getMapStyle(): string | StyleSpecification {
  const envStyle = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
  if (envStyle) return envStyle;
  return FALLBACK_TILES;
}


