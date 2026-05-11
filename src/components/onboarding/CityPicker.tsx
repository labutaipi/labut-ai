import { PIAUI_CITIES, type CitySlug } from '#/lib/cities'

interface CityPickerProps {
  selected: CitySlug | null
  onSelect: (slug: CitySlug) => void
}

export default function CityPicker({ selected, onSelect }: CityPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {PIAUI_CITIES.map((city) => {
        const isSelected = selected === city.slug
        return (
          <button
            key={city.slug}
            type="button"
            onClick={() => onSelect(city.slug)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 ${
              isSelected
                ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.12)] text-[var(--lagoon-deep)] shadow-[0_0_0_2px_var(--lagoon-deep)]'
                : 'border-[var(--line)] bg-white/60 text-[var(--sea-ink)] hover:border-[rgba(50,143,151,0.4)] dark:bg-white/5'
            }`}
          >
            {city.label}
          </button>
        )
      })}
    </div>
  )
}
