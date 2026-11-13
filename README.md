# Foresight — Climate Intelligence

Foresight is a Next.js and TypeScript web application for exploring climate analogues and regional agricultural context. It includes a searchable worldwide location selector, interactive MapLibre map, ranked candidate regions, regional crop/season/soil/water context, NASA POWER historical point-data retrieval, and CSV export.

## Requirements

- Node.js 20 LTS (the project is pinned to Next.js 15.5.28 and MapLibre GL JS 5.24.1)
- npm 10 or newer

## Run locally on Windows

Open Command Prompt in the project folder and run:

```bat
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Keep the Command Prompt window open while using the development server. Press `Ctrl+C` to stop it.

## Production check

```bat
npm run typecheck
npm run build
npm start
```

## Deploy to Vercel (recommended)

1. Create a GitHub repository and upload the contents of this project folder (do not upload `node_modules` or `.next`).
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository. Vercel should detect Next.js automatically.
4. Keep the default install/build settings (`npm install` and `npm run build`).
5. No secret key is required for the current Open-Meteo geocoding or NASA POWER public endpoints. Leave `NEXT_PUBLIC_MAP_STYLE` unset so the app can select the matching light/dark map style.
6. Deploy. Vercel will provide a public HTTPS URL. Every push to the connected production branch can trigger a redeployment.

## Other hosting options

Use a host that supports Node.js server-side Next.js deployments (not a static-only host). Configure:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Node version: 20.x

For a VPS or managed Node host, set the production environment, run the build, and keep `npm start` running behind the host's HTTPS reverse proxy. Do not use `next export` or treat this app as a static HTML site: it contains API routes for geocoding, analogue ranking and NASA POWER retrieval.

## Features

- Global city/region/country search using the Open-Meteo geocoding API.
- Interactive MapLibre map using OpenFreeMap styles, with separate light and dark basemaps, target marker and analogue markers.
- Climate analogue ranking and CSV export.
- Region-specific indicative crop opportunities, seasonality, rotations, soils and irrigation context for the included candidate regions.
- Historical daily climate retrieval through NASA POWER.
- Supplied Foresight light/dark logos and icon.

## Data and scientific limitations

The current candidate climate feature vectors and analogue scores are demonstration data. The SSP scenario, future period and historical baseline controls are not yet connected to a NASA NEX-GDDP-CMIP6 projection pipeline. Regional crop descriptions are broad regional context, not a validated crop suitability model or a farm-level recommendation. The relative similarity index is not a probability or calibrated confidence score. Verify local soil, water, cultivar, planting dates, pest pressure, markets and official agricultural-extension guidance before making decisions.

The NASA POWER endpoint retrieves historical point data; it does not provide future projections. For research-grade use, implement and validate multi-model NEX-GDDP-CMIP6 ingestion, common climate-feature engineering, uncertainty summaries, documented feature scaling, and source-attributed national/regional crop, soil and irrigation datasets.

## API routes

- `GET /api/geocode?q=mysuru` — worldwide place-name suggestions.
- `POST /api/analogue` — ranks the current candidate demonstration profiles.
- `GET /api/climate/power?lat=12.97&lon=77.59&start=20190101&end=20231231` — NASA POWER daily point data.
- `GET /api/health` — service health check.

## Data references

- OpenFreeMap: https://openfreemap.org/
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
- NASA POWER: https://power.larc.nasa.gov/
- NASA NEX-GDDP-CMIP6: https://www.nccs.nasa.gov/services/data-collections/land-based-products/nex-gddp-cmip6
- NASA Earthdata: https://www.earthdata.nasa.gov/
- USDA Cropland Data Layer: https://www.nass.usda.gov/Research_and_Science/Cropland/
- USDA SSURGO: https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo
