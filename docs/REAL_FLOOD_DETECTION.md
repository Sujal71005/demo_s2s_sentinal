# Real Sentinel-1 SAR Flood Detection

## Overview

S2S Sentinels uses Google Earth Engine (GEE) and the Sentinel-1 C-band SAR constellation to detect flood extent through bi-temporal change detection. This document describes the complete methodology, data sources, pipeline, and known limitations.

This is a **baseline flood detection system**. Results are not ground truth and have not been formally validated against field observations.

---

## Sentinel-1 Data Source

| Parameter | Value |
|---|---|
| **Collection** | `COPERNICUS/S1_GRD` (Google Earth Engine) |
| **Satellite** | Sentinel-1A / Sentinel-1B (ESA Copernicus) |
| **Sensor** | C-band SAR (5.405 GHz) |
| **Mode** | Interferometric Wide (IW) |
| **Polarization** | VV (default) — vertical transmit, vertical receive |
| **Resolution** | ~10 m (GRD product, processed to 20 m for analysis) |
| **Revisit time** | ~6 days (12 days per satellite, two-satellite constellation) |
| **Coverage** | Global |

### Why SAR?

Synthetic Aperture Radar (SAR) is used for flood detection because:

1. **All-weather capability** — C-band microwaves penetrate clouds, monsoon rain, and haze. Optical sensors fail during flood events due to cloud cover.
2. **Day/night operation** — SAR is an active sensor and does not require sunlight.
3. **Physical sensitivity** — Open water specularly reflects radar pulses away from the antenna, producing very low backscatter values. Flooded areas appear as dark regions in SAR imagery.

---

## Methodology: Pre/Post Change Detection

### Why Change Detection Instead of Single-Image Thresholding

The previous version of this system applied a single absolute backscatter threshold (e.g., VV < −17 dB) to one SAR image. This approach has significant limitations:

- **Terrain effects**: Shadow and foreshortening produce dark areas that are misclassified as water.
- **Smooth urban surfaces**: Flat rooftops can also appear dark.
- **No pre-flood reference**: Impossible to distinguish pre-existing water from flood water.

The Phase 1 pipeline instead uses **bi-temporal change detection**: comparing SAR backscatter before and after the flood event.

### Pipeline Steps

```
PRE-EVENT PERIOD
  Filter COPERNICUS/S1_GRD (IW, VV)
  → Median composite (pre-event baseline)

POST-EVENT PERIOD
  Filter COPERNICUS/S1_GRD (IW, VV)
  → Median composite (flood observation)

CHANGE IMAGE
  postVV - preVV  [dB difference, log domain]
  → Negative values = backscatter decreased = potential flood

THRESHOLD
  changeImage < threshold (default: -1.5 dB)
  → Flood candidates

PERMANENT WATER MASK
  JRC/GSW1_4/GlobalSurfaceWater (occurrence ≥ 80%)
  → Remove pre-existing water bodies

MORPHOLOGICAL CLEANING
  Focal min → focal max (erosion + dilation = opening)
  → Remove isolated noise pixels

FLOOD AREA COMPUTATION
  pixelArea × floodMask → sum → km²
  → floodPercentage = floodAreaKm² / studyAreaKm²

VECTORIZATION
  reduceToVectors() → GeoJSON FeatureCollection
  → simplify(maxError=30) for payload efficiency
```

---

## VV Polarization

VV (vertical transmit, vertical receive) is the preferred polarization for open-water flood detection:

- Water surfaces are specular reflectors for vertically polarized signals
- VV typically shows the largest dynamic range between flooded and non-flooded land
- VH is available as an alternative for vegetated flood detection (double-bounce from flooded vegetation)

---

## Permanent Water Masking

**Dataset:** JRC Global Surface Water v1.4  
**Collection ID:** `JRC/GSW1_4/GlobalSurfaceWater`  
**Band used:** `occurrence` (0–100%)

Pixels where water has been observed in ≥ 80% of Landsat observations since 1984 are classified as permanent water and excluded from the flood mask. This prevents rivers, lakes, and reservoirs from being reported as newly flooded areas.

**Why JRC GSW?** It is the most comprehensive global surface water dataset available in Earth Engine, derived from 3+ million Landsat images over 35+ years.

---

## Detection Threshold

The default change threshold is **−1.5 dB**.

This means: pixels where post-event backscatter is at least 1.5 dB lower than pre-event are classified as flood candidates.

The threshold is configurable via the Flood Analysis UI and the API parameter `threshold`.

**Conservative thresholds** (e.g., −2.0 dB) reduce false positives but may miss shallow floods.  
**Lenient thresholds** (e.g., −1.0 dB) detect more flood area but increase false positives.

---

## Minimum Area Filter

After morphological cleaning, a minimum area filter removes polygons below `minAreaM2` (default: 100,000 m² = 0.1 km²). This eliminates isolated noise patches that pass the threshold but are too small to represent real flooding.

---

## Vectorization

The flood mask raster is converted to GeoJSON polygons using Earth Engine's `reduceToVectors()` function at 40 m scale. Individual geometries are simplified to `maxError = 30 m` to reduce payload size for transmission to the browser.

The returned GeoJSON is a `FeatureCollection` where each feature represents a contiguous flooded area.

---

## Earth Engine Authentication

Authentication uses a GCP service account. The system supports two methods:

**Method A — Inline credentials (environment variables):**
```
EE_SERVICE_ACCOUNT_EMAIL = client_email from service account JSON
EE_SERVICE_ACCOUNT_KEY   = private_key from service account JSON
```

**Method B — Key file (file path):**
```
GOOGLE_APPLICATION_CREDENTIALS = /path/to/service-account-key.json
```

Method B takes priority if both are set.

If credentials are missing or invalid, the API returns a clear error. It **never falls back to fake data**.

---

## API Flow

### POST `/api/earth-engine/flood`

**Request:**
```json
{
  "areaId": "sangli",
  "preStartDate": "2019-07-01",
  "preEndDate": "2019-08-10",
  "postStartDate": "2019-08-11",
  "postEndDate": "2019-08-28",
  "polarization": "VV",
  "threshold": -1.5,
  "minAreaM2": 100000
}
```

**Response:**
```json
{
  "success": true,
  "live": true,
  "sensor": "Sentinel-1",
  "collection": "COPERNICUS/S1_GRD",
  "polarization": "VV",
  "preEventDate": "2019-07-15",
  "postEventDate": "2019-08-12",
  "preEventCount": 3,
  "postEventCount": 2,
  "floodAreaKm2": 4.82,
  "floodPercentage": 1.79,
  "studyAreaKm2": 269.3,
  "threshold": -1.5,
  "changeDetectionMethod": "log-ratio VV dB difference (post - pre median composite)",
  "permanentWaterDataset": "JRC/GSW1_4/GlobalSurfaceWater (occurrence >= 80%)",
  "geometry": { ... },
  "floodGeoJSON": {
    "type": "FeatureCollection",
    "features": [ ... ]
  },
  "metadata": {
    "preStartDate": "2019-07-01",
    "preEndDate": "2019-08-10",
    "postStartDate": "2019-08-11",
    "postEndDate": "2019-08-28",
    "minAreaM2": 100000,
    "processingNotes": "Pre composite: 3 scene(s). Post composite: 2 scene(s)."
  }
}
```

### GET `/api/earth-engine/flood?area=<id>`

Legacy endpoint used by the Dashboard. Returns single-image thresholding result for backwards compatibility.

---

## Known Limitations

1. **False positives from terrain**: SAR shadow and foreshortening in mountainous areas produce dark pixels that can be misclassified as water even with change detection.

2. **Vegetation effects**: Flooded vegetation can exhibit double-bounce scattering, increasing backscatter and causing under-detection of flooded vegetated areas.

3. **Urban areas**: Urban canyons and street-level flooding are often missed because building walls create bright targets that mask the flooded surface.

4. **Acquisition geometry**: Results depend on the relative orbit direction. Ascending and descending passes see different scattering geometries.

5. **Temporal compositing**: Using median composites over multi-week periods may mix pre-flood and flood-period images, diluting the change signal. Shorter composite windows with adequate scene count improve accuracy.

6. **No ground truth validation**: This system has not been validated against field measurements, flood gauges, or verified flood extent maps. Area estimates are indicative only.

7. **Processing time**: Earth Engine analysis takes 15–120 seconds depending on study area size and EE server load.

8. **GeoJSON size**: For large flood extents, the returned GeoJSON may be large. Simplification is applied but very complex geometries may still cause slow rendering.

---

## Future Extensions (Not Yet Implemented)

- **PHASE 2**: Real GIS impact analysis (actual population, road, facility data)
- **PHASE 3**: Real risk scoring engine
- **PHASE 4**: Real emergency routing using routable road networks
- **PHASE 5**: Flood extent prediction using historical patterns
- **PHASE 6**: Flood simulation / scenario modelling
- **PHASE 7**: AI decision support

---

## References

- ESA Sentinel-1 Mission: https://sentinel.esa.int/web/sentinel/missions/sentinel-1
- Google Earth Engine: https://earthengine.google.com
- JRC Global Surface Water: https://global-surface-water.appspot.com
- Twele et al. (2016): Sentinel-1 based flood mapping — a fully automated processing chain. Int. J. Remote Sens.
- Chini et al. (2017): Sentinel-1 SAR and Sentinel-2 optical data complementarity for flood monitoring and mapping. Remote Sens.
