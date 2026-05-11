import { SEGMENTS, type SegmentSlug } from '#/lib/segments'

interface SegmentPickerProps {
  selected: SegmentSlug | null
  onSelect: (slug: SegmentSlug) => void
}

export default function SegmentPicker({ selected, onSelect }: SegmentPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SEGMENTS.map((segment) => {
        const isSelected = selected === segment.slug
        return (
          <button
            key={segment.slug}
            type="button"
            onClick={() => onSelect(segment.slug)}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 ${
              isSelected
                ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.12)] shadow-[0_0_0_2px_var(--lagoon-deep)]'
                : 'border-[var(--line)] bg-white/60 hover:border-[rgba(50,143,151,0.4)] dark:bg-white/5'
            }`}
          >
            <span className="text-2xl">{segment.icon}</span>
            <span className="text-sm font-semibold text-[var(--sea-ink)]">{segment.label}</span>
          </button>
        )
      })}
    </div>
  )
}
