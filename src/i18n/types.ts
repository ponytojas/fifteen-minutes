export type Locale = "en" | "es" | "de";

export type TranslationDictionary = {
  // Toolbar
  "toolbar.selectCity": string;
  "toolbar.res": string;
  "toolbar.h3HexSize": string;
  "toolbar.highResWarning": string;
  "toolbar.chooseTheme": string;
  "toolbar.light": string;
  "toolbar.dark": string;
  "toolbar.system": string;
  "toolbar.hideHexes": string;
  "toolbar.showHexes": string;
  "toolbar.hideHexLayer": string;
  "toolbar.showHexLayer": string;
  "toolbar.searchCity": string;
  "toolbar.openSettings": string;
  "toolbar.settings": string;
  "toolbar.selectLanguage": string;
  "toolbar.openInfo": string;
  "toolbar.hidePois": string;
  "toolbar.showPois": string;

  // App
  "app.loadingCityData": string;

  // Settings
  "settings.title": string;

  // Explain panel
  "explain.title": string;
  "explain.clickToInspect": string;
  "explain.loading": string;
  "explain.score": string;
  "explain.amenities": string;
  "explain.transit": string;
  "explain.disabled": string;
  "explain.showEvidence": string;
  "explain.showTransitEvidence": string;
  "explain.hideTransitEvidence": string;
  "explain.stopsInRadius": string;
  "explain.freqSum": string;
  "explain.freqScore": string;
  "explain.divSum": string;
  "explain.divScore": string;
  "explain.contribution": string;
  "explain.departuresPerHour": string;
  "explain.stopsConsidered": string;

  // Controls panel
  "controls.time": string;
  "controls.weekday": string;
  "controls.weekend": string;
  "controls.from": string;
  "controls.to": string;
  "controls.amenitySelection": string;
  "controls.used": string;
  "controls.ignored": string;
  "controls.amenityWeights": string;
  "controls.transitWeights": string;
  "controls.frequency": string;
  "controls.diversity": string;
  "controls.balance": string;
  "controls.amenities": string;
  "controls.transit": string;
  "controls.hexLayer": string;
  "controls.hideHexes": string;
  "controls.showHexes": string;
  "controls.hidePois": string;
  "controls.showPois": string;
  "controls.hexOpacity": string;
  "controls.constraints": string;
  "controls.walkBudget": string;
  "controls.maxWalkToStop": string;

  // Category names
  "category.grocery": string;
  "category.gym": string;
  "category.park": string;
  "category.healthcare": string;
  "category.cafe": string;
  "category.library": string;

  // Search dialog
  "search.title": string;
  "search.description": string;
  "search.placeholder": string;
  "search.fetchingOSM": string;
  "search.processingAmenities": string;
  "search.processingTransit": string;
  "search.buildingCity": string;
  "search.downloadFailed": string;
  "search.searchFailed": string;
  "search.noCitiesFound": string;

  // Confidence badge
  "confidence.high": string;
  "confidence.medium": string;
  "confidence.low": string;

  // Top areas
  "topAreas.title": string;

  // Tooltip
  "tooltip.score": string;
  "tooltip.poi": string;
  "tooltip.stop": string;

  // Legend
  "legend.title": string;
  "legend.score": string;
  "legend.low": string;
  "legend.high": string;
  "legend.pois": string;

  // Info dialog
  "info.title": string;
  "info.description": string;
  "info.whatIs": string;
  "info.whatIsBody": string;
  "info.howTo": string;
  "info.howToBody": string;
  "info.tips": string;
  "info.tipsBody": string;

  // Units
  "unit.m": string;
  "unit.min": string;
  "unit.depPerHour": string;
};

export type TranslationKey = keyof TranslationDictionary;
