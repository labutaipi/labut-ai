export const SEGMENTS = [
  {
    slug: 'salao-beleza',
    label: 'Salão de Beleza',
    icon: '✂️',
    keywords: [
      'salão de beleza',
      'corte de cabelo',
      'manicure',
      'escova progressiva',
      'coloração cabelo',
    ],
  },
  {
    slug: 'alimentacao',
    label: 'Alimentação',
    icon: '🍽️',
    keywords: ['marmita', 'delivery comida', 'lanchonete', 'comida caseira', 'salgado'],
  },
  {
    slug: 'manutencao',
    label: 'Manutenção e Reparos',
    icon: '🔧',
    keywords: [
      'conserto de celular',
      'eletricista residencial',
      'encanador',
      'manutenção ar condicionado',
      'marido de aluguel',
    ],
  },
  {
    slug: 'moda',
    label: 'Moda e Vestuário',
    icon: '👗',
    keywords: ['roupas femininas', 'brechó', 'moda plus size', 'roupa sob medida', 'costureira'],
  },
  {
    slug: 'servicos-gerais',
    label: 'Serviços Gerais',
    icon: '🏠',
    keywords: ['faxina', 'limpeza residencial', 'jardinagem', 'personal organizer', 'diarista'],
  },
] as const

export type SegmentSlug = (typeof SEGMENTS)[number]['slug']
export type Segment = (typeof SEGMENTS)[number]

export function getSegmentBySlug(slug: SegmentSlug): Segment {
  return SEGMENTS.find((s) => s.slug === slug)!
}

export function getSegmentKeywords(slug: SegmentSlug): readonly string[] {
  return getSegmentBySlug(slug).keywords
}

export function isValidSegmentSlug(slug: string): slug is SegmentSlug {
  return SEGMENTS.some((s) => s.slug === slug)
}
