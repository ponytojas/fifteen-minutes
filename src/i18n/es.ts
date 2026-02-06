import type { TranslationDictionary } from "./types";

const es: TranslationDictionary = {
  // Toolbar
  "toolbar.selectCity": "Seleccionar ciudad",
  "toolbar.res": "Res",
  "toolbar.h3HexSize": "Tamaño hex H3:",
  "toolbar.highResWarning": "Alta resolución puede ser lenta",
  "toolbar.chooseTheme": "Elegir tema",
  "toolbar.light": "Claro",
  "toolbar.dark": "Oscuro",
  "toolbar.system": "Sistema",
  "toolbar.hideHexes": "Ocultar hexágonos",
  "toolbar.showHexes": "Mostrar hexágonos",
  "toolbar.hideHexLayer": "Ocultar capa hex",
  "toolbar.showHexLayer": "Mostrar capa hex",
  "toolbar.searchCity": "Buscar ciudad",
  "toolbar.openSettings": "Abrir ajustes",
  "toolbar.settings": "Ajustes",
  "toolbar.selectLanguage": "Seleccionar idioma",
  "toolbar.openInfo": "Acerca de esta app",
  "toolbar.hidePois": "Ocultar POIs",
  "toolbar.showPois": "Mostrar POIs",

  // App
  "app.loadingCityData": "Cargando datos de la ciudad...",

  // Settings
  "settings.title": "Ajustes",

  // Explain panel
  "explain.title": "Detalles del hexágono",
  "explain.clickToInspect": "Haz clic en un hexágono para inspeccionar",
  "explain.loading": "Cargando explicación...",
  "explain.score": "Puntuación",
  "explain.amenities": "Servicios",
  "explain.transit": "Transporte",
  "explain.disabled": "deshabilitado",
  "explain.showEvidence": "Mostrar evidencia en mapa",
  "explain.showTransitEvidence": "Mostrar evidencia de transporte",
  "explain.hideTransitEvidence": "Ocultar evidencia de transporte",
  "explain.stopsInRadius": "Paradas en radio",
  "explain.freqSum": "Suma frec.",
  "explain.freqScore": "Punt. frec.",
  "explain.divSum": "Suma div.",
  "explain.divScore": "Punt. div.",
  "explain.contribution": "Contribución",
  "explain.departuresPerHour": "Salidas / hora",
  "explain.stopsConsidered": "paradas consideradas",

  // Controls panel
  "controls.time": "Horario",
  "controls.weekday": "laborable",
  "controls.weekend": "fin de semana",
  "controls.from": "Desde",
  "controls.to": "Hasta",
  "controls.amenitySelection": "Selección de servicios",
  "controls.used": "Activo",
  "controls.ignored": "Ignorado",
  "controls.amenityWeights": "Pesos de servicios",
  "controls.transitWeights": "Pesos de transporte",
  "controls.frequency": "Frecuencia",
  "controls.diversity": "Diversidad",
  "controls.balance": "Balance",
  "controls.amenities": "Servicios",
  "controls.transit": "Transporte",
  "controls.hexLayer": "Capa hexagonal",
  "controls.hideHexes": "Ocultar hexágonos",
  "controls.showHexes": "Mostrar hexágonos",
  "controls.hidePois": "Ocultar POIs",
  "controls.showPois": "Mostrar POIs",
  "controls.hexOpacity": "Opacidad hex",
  "controls.constraints": "Restricciones",
  "controls.walkBudget": "Tiempo caminando (min)",
  "controls.maxWalkToStop": "Máx. caminar a parada (min)",

  // Category names
  "category.grocery": "supermercado",
  "category.gym": "gimnasio",
  "category.park": "parque",
  "category.healthcare": "salud",
  "category.cafe": "cafetería",
  "category.library": "biblioteca",

  // Search dialog
  "search.title": "Buscar ciudad",
  "search.description":
    "Busca cualquier ciudad y descarga datos de accesibilidad desde OpenStreetMap",
  "search.placeholder": "Escribe el nombre de una ciudad...",
  "search.fetchingOSM": "Obteniendo datos de OpenStreetMap...",
  "search.processingAmenities": "Procesando servicios...",
  "search.processingTransit": "Procesando paradas de transporte...",
  "search.buildingCity": "Construyendo ciudad...",
  "search.downloadFailed": "Error al descargar datos de la ciudad",
  "search.searchFailed": "Error en la búsqueda",
  "search.noCitiesFound": "No se encontraron ciudades",

  // Confidence badge
  "confidence.high": "alta",
  "confidence.medium": "media",
  "confidence.low": "baja",

  // Top areas
  "topAreas.title": "Mejores zonas",

  // Tooltip
  "tooltip.score": "Puntuación:",
  "tooltip.poi": "POI",
  "tooltip.stop": "Parada de transporte",

  // Legend
  "legend.title": "Leyenda",
  "legend.score": "Puntuación de accesibilidad",
  "legend.low": "Baja",
  "legend.high": "Alta",
  "legend.pois": "Puntos de interés",

  // Info dialog
  "info.title": "Acerca de 15-Minute City Atlas",
  "info.description": "Análisis interactivo de accesibilidad peatonal con datos de OpenStreetMap",
  "info.whatIs": "¿Qué es esto?",
  "info.whatIsBody": "Esta app visualiza la accesibilidad peatonal de una ciudad usando el concepto de ciudad de 15 minutos. Analiza la proximidad a servicios cotidianos (supermercados, parques, salud, etc.) y el acceso al transporte público, y puntúa cada zona en una cuadrícula hexagonal con código de colores.",
  "info.howTo": "Cómo usar",
  "info.howToBody": "Busca una ciudad desde la barra de herramientas. Ajusta los pesos de servicios y los parámetros de transporte en Ajustes. Haz clic en cualquier hexágono del mapa para inspeccionar su desglose de puntuación. Activa o desactiva la capa hexagonal para ver mejor el mapa base.",
  "info.tips": "Consejos",
  "info.tipsBody": "Usa resoluciones H3 más altas para mayor detalle (más lento). Habilita o deshabilita categorías de servicios para enfocarte en lo que te importa. Consulta el panel de Mejores Zonas para los barrios con mejor puntuación.",

  // Units
  "unit.m": "m",
  "unit.min": "min",
  "unit.depPerHour": "sal/h",
};

export default es;
