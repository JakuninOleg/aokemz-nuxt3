/**
 * Координаты площадок — из открытых источников (сайты, GPS, webmineral.ru).
 * Позиции на карте — equirectangular по bounds map-eurasia-supply.png.
 */

export type SupplySite = {
  name: string
  short: string
  lat: number
  lon: number
  export: boolean
  source: string
}

/** Географические границы PNG map-eurasia-supply.png (евразийский кадр). */
export const MAP_GEO_BOUNDS = {
  lonMin: -12,
  lonMax: 148,
  latMin: 15,
  latMax: 78,
}

export const SUPPLY_SITES: SupplySite[] = [
  {
    name: 'Ковдорский ГОК',
    short: 'Ковдор',
    lat: 67.5592,
    lon: 30.4289,
    export: false,
    source: 'webmineral.ru: 67°33′33″N 30°25′44″E',
  },
  {
    name: 'АО «Апатит»',
    short: 'Апатит',
    lat: 67.6092,
    lon: 33.6724,
    export: false,
    source: 'Кировск — phosagro.ru / plaso.pro GPS',
  },
  {
    name: 'Стойленский ГОК',
    short: 'Стойленский',
    lat: 51.278,
    lon: 37.7266,
    export: false,
    source: 'Старый Оскол — sgok.nlmk.com',
  },
  {
    name: 'Михайловский ГОК',
    short: 'Михайловский',
    lat: 52.3132,
    lon: 35.4034,
    export: false,
    source: 'Железногорск — nashural.ru карьер',
  },
  {
    name: 'Сибирский Антрацит',
    short: 'Сиб. Антрацит',
    lat: 54.4407,
    lon: 83.488,
    export: false,
    source: 'пос. Листвянский, Искитимский р-н',
  },
  {
    name: 'Кузбассразрезуголь',
    short: 'Кузбасс',
    lat: 55.3497,
    lon: 86.1088,
    export: false,
    source: 'Кемерово — kru.ru GPS',
  },
  {
    name: 'СДС-Уголь',
    short: 'СДС-Уголь',
    lat: 55.354,
    lon: 86.158,
    export: false,
    source: 'Кемерово, пр. Притомский 7/2',
  },
  {
    name: 'Казахстан',
    short: 'Казахстан',
    lat: 49.804,
    lon: 73.109,
    export: true,
    source: 'Караганда',
  },
  {
    name: 'Узбекистан',
    short: 'Узбекистан',
    lat: 41.299,
    lon: 69.24,
    export: true,
    source: 'Ташкент',
  },
  {
    name: 'Индия',
    short: 'Индия',
    lat: 28.613,
    lon: 77.209,
    export: true,
    source: 'Нью-Дели',
  },
]

export function geoToMapPercent(lat: number, lon: number): { x: number; y: number } {
  const { lonMin, lonMax, latMin, latMax } = MAP_GEO_BOUNDS
  const x = ((lon - lonMin) / (lonMax - lonMin)) * 100
  const y = ((latMax - lat) / (latMax - latMin)) * 100
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  }
}

export function sitesWithMapPosition() {
  return SUPPLY_SITES.map((site) => ({
    ...site,
    ...geoToMapPercent(site.lat, site.lon),
  }))
}
