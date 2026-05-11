export const PIAUI_CITIES = [
  { slug: 'teresina', label: 'Teresina', geoCode: 'BR-PI-TEI' },
  { slug: 'parnaiba', label: 'Parnaíba', geoCode: 'BR-PI' },
  { slug: 'picos', label: 'Picos', geoCode: 'BR-PI' },
  { slug: 'floriano', label: 'Floriano', geoCode: 'BR-PI' },
  { slug: 'piripiri', label: 'Piripiri', geoCode: 'BR-PI' },
  { slug: 'campo-maior', label: 'Campo Maior', geoCode: 'BR-PI' },
  { slug: 'sao-raimundo-nonato', label: 'São Raimundo Nonato', geoCode: 'BR-PI' },
  { slug: 'barras', label: 'Barras', geoCode: 'BR-PI' },
  { slug: 'oeiras', label: 'Oeiras', geoCode: 'BR-PI' },
  { slug: 'esperantina', label: 'Esperantina', geoCode: 'BR-PI' },
  { slug: 'jose-de-freitas', label: 'José de Freitas', geoCode: 'BR-PI' },
  { slug: 'urucui', label: 'Uruçuí', geoCode: 'BR-PI' },
  { slug: 'corrente', label: 'Corrente', geoCode: 'BR-PI' },
  { slug: 'bom-jesus', label: 'Bom Jesus', geoCode: 'BR-PI' },
  { slug: 'altos', label: 'Altos', geoCode: 'BR-PI' },
] as const

export type CitySlug = (typeof PIAUI_CITIES)[number]['slug']
export type City = (typeof PIAUI_CITIES)[number]

export function getCityBySlug(slug: CitySlug): City {
  return PIAUI_CITIES.find((c) => c.slug === slug)!
}

export function getCityGeoCode(slug: CitySlug): string {
  return getCityBySlug(slug).geoCode
}

export function isValidCitySlug(slug: string): slug is CitySlug {
  return PIAUI_CITIES.some((c) => c.slug === slug)
}
