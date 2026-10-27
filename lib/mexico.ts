/** The 32 federal entities, spelled exactly as the SEPOMEX catalog (and the API) spells them. */
export const MEXICAN_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila de Zaragoza',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán de Ocampo',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz de Ignacio de la Llave',
  'Yucatán',
  'Zacatecas',
] as const

export type PostalCodeInfo = {
  postal_code: string
  state: string
  municipality: string
  city: string | null
  settlements: { name: string; type: string | null }[]
}
