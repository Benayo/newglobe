# Battery Health Monitoring Dashboard

## Overview

This web app helps field teams prioritize school visits by flagging teacher tablet batteries needing replacement. It processes `public/data/battery.json`, calculates daily battery use, and marks devices exceeding 30% daily usage as unhealthy. Schools are sorted by unhealthy device count, with filters for unhealthy devices or specific school IDs. Built with Vue 3, TypeScript, Pinia, Vue Query, Element Plus, PrimeVue, and date-fns, it runs on the latest Chrome and includes unit tests.

## Features
1. **Battery Analysis**: Groups data by device, calculates daily usage (duration-weighted), skips charging periods, marks high-drain devices (>30%) as unhealthy, and labels single-point data as "unknown."
2. **UI**: Lists schools by unhealthy device count, showing serial number, consumption (% or "Unknown"), status, battery level (%), and timestamps (MM/DD/YYYY HH:MM:SS via date-fns).
3. **Filters**: Toggle "Show Unhealthy Only" or select a school ID.
4. **Tests**: 4 Vitest unit tests for `BatteryService.ts`.

## Type Safety
Fixed TypeScript errors for a clean build.

## Prerequisites
- Node.js: v18+
- npm: v8+
- Git
- Chrome (latest)

## Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/Benayo/newglobe.git
   cd newglobe

### Install dependencies:
npm install

### Run the app:
npm run dev


Visit: http://localhost:5173

### Run tests:

npm run test

### Check types:
npm run type-check


## Technical Details

- **Data**:  
  Processes `public/data/battery.json` via `BatteryService.ts`.

- **Calculation**:  
  Uses `(totalConsumption / totalHours) * 24`, ignores charging, marks single points as "unknown," flags >30% as unhealthy.

## Tech Stack

- Vue 3: Reactive UI
- TypeScript: Type safety
- Pinia: State management
- Vue Query: Data fetching
- Element Plus, PrimeVue: UI styling
- date-fns: Timestamp formatting
- Vitest: Unit testing


