# Weather App

React app that fetches **current**, **historical**, and **marine** weather from [Weatherstack API](https://www.weatherstack.com/documentation), with a **glassmorphism** theme and location filter.

## Setup

1. **Open this folder in VS Code**  
   File → Open Folder → select the `Weather App` folder.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **API key**  
   The project includes a `.env` file with a Weatherstack API key. To use your own, copy `.env.example` to `.env` and set `VITE_WEATHERSTACK_API_KEY`.

## Run

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Build

```bash
npm run build
npm run preview
```

## Features

- **Current weather** – city name or ZIP
- **Historical weather** – pick a date
- **Marine weather** – use latitude,longitude (e.g. `51.51,-0.13`)
- **Location filter** – one input used for all three modes
- **Glassmorphism UI** – frosted glass style with blur and gradients
