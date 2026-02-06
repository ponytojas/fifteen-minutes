import type { TranslationDictionary } from "./types";

const en: TranslationDictionary = {
  // Toolbar
  "toolbar.selectCity": "Select a city",
  "toolbar.res": "Res",
  "toolbar.h3HexSize": "H3 hex size:",
  "toolbar.highResWarning": "High resolution may be slow",
  "toolbar.chooseTheme": "Choose theme",
  "toolbar.light": "Light",
  "toolbar.dark": "Dark",
  "toolbar.system": "System",
  "toolbar.hideHexes": "Hide hexes",
  "toolbar.showHexes": "Show hexes",
  "toolbar.hideHexLayer": "Hide hex layer",
  "toolbar.showHexLayer": "Show hex layer",
  "toolbar.searchCity": "Search city",
  "toolbar.openSettings": "Open settings",
  "toolbar.settings": "Settings",
  "toolbar.selectLanguage": "Select language",
  "toolbar.openInfo": "About this app",
  "toolbar.hidePois": "Hide POIs",
  "toolbar.showPois": "Show POIs",

  // App
  "app.loadingCityData": "Loading city data...",

  // Settings
  "settings.title": "Settings",

  // Explain panel
  "explain.title": "Hex Details",
  "explain.clickToInspect": "Click a hex to inspect",
  "explain.loading": "Loading explanation...",
  "explain.score": "Score",
  "explain.amenities": "Amenities",
  "explain.transit": "Transit",
  "explain.disabled": "disabled",
  "explain.showEvidence": "Show evidence on map",
  "explain.showTransitEvidence": "Show transit evidence",
  "explain.hideTransitEvidence": "Hide transit evidence",
  "explain.stopsInRadius": "Stops in radius",
  "explain.freqSum": "Freq sum",
  "explain.freqScore": "Freq score",
  "explain.divSum": "Div sum",
  "explain.divScore": "Div score",
  "explain.contribution": "Contribution",
  "explain.departuresPerHour": "Departures / hour",
  "explain.stopsConsidered": "stops considered",

  // Controls panel
  "controls.time": "Time",
  "controls.weekday": "weekday",
  "controls.weekend": "weekend",
  "controls.from": "From",
  "controls.to": "To",
  "controls.amenitySelection": "Amenity Selection",
  "controls.used": "Used",
  "controls.ignored": "Ignored",
  "controls.amenityWeights": "Amenity Weights",
  "controls.transitWeights": "Transit Weights",
  "controls.frequency": "Frequency",
  "controls.diversity": "Diversity",
  "controls.balance": "Balance",
  "controls.amenities": "Amenities",
  "controls.transit": "Transit",
  "controls.hexLayer": "Hex Layer",
  "controls.hideHexes": "Hide hexes",
  "controls.showHexes": "Show hexes",
  "controls.hidePois": "Hide POIs",
  "controls.showPois": "Show POIs",
  "controls.hexOpacity": "Hex opacity",
  "controls.constraints": "Constraints",
  "controls.walkBudget": "Walk budget (min)",
  "controls.maxWalkToStop": "Max walk to stop (min)",

  // Category names
  "category.grocery": "grocery",
  "category.gym": "gym",
  "category.park": "park",
  "category.healthcare": "healthcare",
  "category.cafe": "cafe",
  "category.library": "library",

  // Search dialog
  "search.title": "Search City",
  "search.description":
    "Find any city and download walkability data from OpenStreetMap",
  "search.placeholder": "Type a city name...",
  "search.fetchingOSM": "Fetching data from OpenStreetMap...",
  "search.processingAmenities": "Processing amenities...",
  "search.processingTransit": "Processing transit stops...",
  "search.buildingCity": "Building city...",
  "search.downloadFailed": "Failed to download city data",
  "search.searchFailed": "Search failed",
  "search.noCitiesFound": "No cities found",

  // Confidence badge
  "confidence.high": "high",
  "confidence.medium": "medium",
  "confidence.low": "low",

  // Top areas
  "topAreas.title": "Top Areas",

  // Tooltip
  "tooltip.score": "Score:",
  "tooltip.poi": "POI",
  "tooltip.stop": "Transit stop",

  // Legend
  "legend.title": "Legend",
  "legend.score": "Walkability Score",
  "legend.low": "Low",
  "legend.high": "High",
  "legend.pois": "Points of Interest",

  // Info dialog
  "info.title": "About 15-Minute City Atlas",
  "info.description": "Interactive walkability analysis powered by OpenStreetMap",
  "info.whatIs": "What is this?",
  "info.whatIsBody": "This app visualises how walkable a city is using the 15-minute city concept. It analyses proximity to everyday amenities (groceries, parks, healthcare, etc.) and public-transit access, then scores each area on a colour-coded hex grid.",
  "info.howTo": "How to use",
  "info.howToBody": "Search for a city using the toolbar. Adjust amenity weights and transit parameters in Settings. Click any hexagon on the map to inspect its score breakdown. Toggle the hex layer on or off for a clearer base map view.",
  "info.tips": "Tips",
  "info.tipsBody": "Use higher H3 resolutions for finer detail (slower). Enable or disable amenity categories to focus on what matters to you. Check the Top Areas panel for the best-scoring neighbourhoods.",

  // Units
  "unit.m": "m",
  "unit.min": "min",
  "unit.depPerHour": "dep/h",
};

export default en;
