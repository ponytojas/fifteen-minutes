import type { TranslationDictionary } from "./types";

const de: TranslationDictionary = {
  // Toolbar
  "toolbar.selectCity": "Stadt auswählen",
  "toolbar.res": "Res",
  "toolbar.h3HexSize": "H3-Hexgröße:",
  "toolbar.highResWarning": "Hohe Auflösung kann langsam sein",
  "toolbar.chooseTheme": "Design wählen",
  "toolbar.light": "Hell",
  "toolbar.dark": "Dunkel",
  "toolbar.system": "System",
  "toolbar.hideHexes": "Hexagone ausblenden",
  "toolbar.showHexes": "Hexagone einblenden",
  "toolbar.hideHexLayer": "Hex-Ebene ausblenden",
  "toolbar.showHexLayer": "Hex-Ebene einblenden",
  "toolbar.searchCity": "Stadt suchen",
  "toolbar.openSettings": "Einstellungen öffnen",
  "toolbar.settings": "Einstellungen",
  "toolbar.selectLanguage": "Sprache auswählen",
  "toolbar.openInfo": "Über diese App",
  "toolbar.hidePois": "POIs ausblenden",
  "toolbar.showPois": "POIs einblenden",

  // App
  "app.loadingCityData": "Stadtdaten werden geladen...",

  // Settings
  "settings.title": "Einstellungen",

  // Explain panel
  "explain.title": "Hex-Details",
  "explain.clickToInspect": "Klicke auf ein Hexagon zum Inspizieren",
  "explain.loading": "Erklärung wird geladen...",
  "explain.score": "Punktzahl",
  "explain.amenities": "Einrichtungen",
  "explain.transit": "Nahverkehr",
  "explain.disabled": "deaktiviert",
  "explain.showEvidence": "Nachweis auf Karte anzeigen",
  "explain.showTransitEvidence": "Nahverkehrsnachweis anzeigen",
  "explain.hideTransitEvidence": "Nahverkehrsnachweis ausblenden",
  "explain.stopsInRadius": "Haltestellen im Radius",
  "explain.freqSum": "Freq.-Summe",
  "explain.freqScore": "Freq.-Wert",
  "explain.divSum": "Div.-Summe",
  "explain.divScore": "Div.-Wert",
  "explain.contribution": "Beitrag",
  "explain.departuresPerHour": "Abfahrten / Stunde",
  "explain.stopsConsidered": "Haltestellen berücksichtigt",

  // Controls panel
  "controls.time": "Zeit",
  "controls.weekday": "Werktag",
  "controls.weekend": "Wochenende",
  "controls.from": "Von",
  "controls.to": "Bis",
  "controls.amenitySelection": "Einrichtungsauswahl",
  "controls.used": "Aktiv",
  "controls.ignored": "Ignoriert",
  "controls.amenityWeights": "Einrichtungsgewichte",
  "controls.transitWeights": "Nahverkehrsgewichte",
  "controls.frequency": "Frequenz",
  "controls.diversity": "Diversität",
  "controls.balance": "Balance",
  "controls.amenities": "Einrichtungen",
  "controls.transit": "Nahverkehr",
  "controls.hexLayer": "Hex-Ebene",
  "controls.hideHexes": "Hexagone ausblenden",
  "controls.showHexes": "Hexagone einblenden",
  "controls.hidePois": "POIs ausblenden",
  "controls.showPois": "POIs einblenden",
  "controls.hexOpacity": "Hex-Deckkraft",
  "controls.constraints": "Beschränkungen",
  "controls.walkBudget": "Gehzeit-Budget (Min)",
  "controls.maxWalkToStop": "Max. Gehzeit zur Haltestelle (Min)",

  // Category names
  "category.grocery": "Lebensmittel",
  "category.gym": "Fitnessstudio",
  "category.park": "Park",
  "category.healthcare": "Gesundheit",
  "category.cafe": "Café",
  "category.library": "Bibliothek",

  // Search dialog
  "search.title": "Stadt suchen",
  "search.description":
    "Finde eine Stadt und lade Erreichbarkeitsdaten von OpenStreetMap herunter",
  "search.placeholder": "Stadtname eingeben...",
  "search.fetchingOSM": "Daten von OpenStreetMap werden abgerufen...",
  "search.processingAmenities": "Einrichtungen werden verarbeitet...",
  "search.processingTransit": "Haltestellen werden verarbeitet...",
  "search.buildingCity": "Stadt wird aufgebaut...",
  "search.downloadFailed": "Fehler beim Herunterladen der Stadtdaten",
  "search.searchFailed": "Suche fehlgeschlagen",
  "search.noCitiesFound": "Keine Städte gefunden",

  // Confidence badge
  "confidence.high": "hoch",
  "confidence.medium": "mittel",
  "confidence.low": "niedrig",

  // Top areas
  "topAreas.title": "Top-Gebiete",

  // Tooltip
  "tooltip.score": "Punktzahl:",
  "tooltip.poi": "POI",
  "tooltip.stop": "Haltestelle",

  // Legend
  "legend.title": "Legende",
  "legend.score": "Erreichbarkeitswert",
  "legend.low": "Niedrig",
  "legend.high": "Hoch",
  "legend.pois": "Einrichtungen",

  // Info dialog
  "info.title": "Über 15-Minute City Atlas",
  "info.description": "Interaktive Erreichbarkeitsanalyse mit OpenStreetMap-Daten",
  "info.whatIs": "Was ist das?",
  "info.whatIsBody": "Diese App visualisiert die Fußläufigkeit einer Stadt anhand des Konzepts der 15-Minuten-Stadt. Sie analysiert die Nähe zu alltäglichen Einrichtungen (Lebensmittel, Parks, Gesundheit usw.) und den Zugang zum öffentlichen Nahverkehr und bewertet jedes Gebiet auf einem farbcodierten Hexagonraster.",
  "info.howTo": "Bedienung",
  "info.howToBody": "Suche eine Stadt über die Symbolleiste. Passe die Gewichtung der Einrichtungen und die Nahverkehrsparameter in den Einstellungen an. Klicke auf ein Hexagon auf der Karte, um die Bewertungsdetails einzusehen. Schalte die Hex-Ebene ein oder aus, um die Basiskarte besser zu sehen.",
  "info.tips": "Tipps",
  "info.tipsBody": "Verwende höhere H3-Auflösungen für mehr Detail (langsamer). Aktiviere oder deaktiviere Einrichtungskategorien, um dich auf das Wesentliche zu konzentrieren. Prüfe das Top-Gebiete-Panel für die am besten bewerteten Viertel.",

  // Units
  "unit.m": "m",
  "unit.min": "Min",
  "unit.depPerHour": "Abf/h",
};

export default de;
