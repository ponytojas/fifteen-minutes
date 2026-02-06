# Fifteen Minute Atlas

An interactive web application that visualizes urban walkability and transit accessibility. It evaluates whether essential amenities and public transit are reachable within approximately 15 minutes of walking from any location in a city, rendering the results as a hexagonal heatmap overlay.

## Features

- **Hexagonal heatmap** — H3-based grid (resolutions 7–11) colored by walkability score
- **City search** — Find any city via Nominatim and fetch its amenity/transit data from OpenStreetMap
- **Real-time scoring** — Web Worker computes amenity proximity and transit frequency scores off the main thread
- **Configurable parameters** — Walk speed, time windows, amenity weights, transit weights, day type filtering
- **Smart recomputation** — Detects which config knobs changed and only recalculates what's necessary
- **Hex explanation** — Click any hex to see a detailed breakdown of its score with evidence lines
- **Top areas ranking** — Highlights the best-scoring locations in the loaded city
- **POI & transit layers** — Toggle visibility of amenity points and transit stops
- **Dark / light / system theme**
- **Internationalization** — English, Spanish, German

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript, Vite |
| Map | Deck.GL, MapLibre GL, react-map-gl |
| Spatial | H3-js (hexagons), KDBush + geokdbush (spatial index) |
| State | Zustand (with localStorage persistence) |
| Styling | Tailwind CSS 4, Radix UI primitives, CVA |
| Threading | Web Worker via Comlink |
| Validation | Zod |
| Testing | Vitest, Testing Library |
| Linting | ESLint, Prettier |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (recommended, workspace configured)

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and search for a city to get started.

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Run ESLint |

## Architecture

```
User selects a city
        |
        v
  Nominatim API -----> City boundary & center
  Overpass API  -----> Amenities & transit stops (OSM)
        |
        v
  osm-transform -----> PoiPack + StopsPack
        |
        v
  Web Worker (scoring.worker.ts)
    |- Build KDBush spatial indexes
    |- Generate H3 hex grid over city bounds
    |- For each hex centroid:
    |    |- Amenity score (nearest per category -> distance decay)
    |    |- Transit score (stops in radius -> frequency + diversity)
    |    |- Weighted combination
    |- Post scores back to main thread
        |
        v
  Zustand store -----> React re-render
        |
        v
  Deck.GL layers
    |- Score surface (colored hexagons)
    |- POI markers
    |- Transit stop markers
    |- Evidence lines (on hex selection)
```

## Project Structure

```
src/
  app/            Zustand store & default config
  components/     UI components (toolbar, dialogs, panels, legend)
    ui/           Radix-based primitives (button, dialog, slider, etc.)
  data/           API clients (Nominatim, Overpass) & data transforms
  i18n/           Translation dictionaries (en, es, de)
  lib/            Utilities (H3 helpers, haversine, smoothstep)
  map/            DeckMap component & layer definitions
    layers/       Individual Deck.GL layer factories
  scoring/        Amenity & transit scoring algorithms, spatial indexing
  types/          TypeScript type definitions
  worker/         Web Worker entry point & React hook
```

## Data Sources

- **[Nominatim](https://nominatim.openstreetmap.org/)** — City geocoding and boundary extraction
- **[Overpass API](https://overpass-api.de/)** — Amenity and transit stop data from OpenStreetMap

## Scoring Model

Each hex receives a composite score from two sub-scores:

- **Amenity score** — For each category (grocery, gym, park, healthcare, cafe, library), finds the nearest POI, converts distance to walk time, and applies a decay function. Categories are weighted by user-configured importance.
- **Transit score** — Finds all transit stops within a configurable radius, evaluates departure frequency within the selected time window, and rewards stop diversity (multiple routes/modes).

The final score is a weighted blend: `wAmenity * amenityScore + wTransit * transitScore`, normalized to 0–100.

## License

Private project.
