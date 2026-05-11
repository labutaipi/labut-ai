type RegionEntry = {
  location?: string
  max_value_index?: number
  value?: Array<{ query?: string; value?: string; extracted_value?: number }>
}

interface RegionChartProps {
  data: RegionEntry[]
}

export default function RegionChart({ data }: RegionChartProps) {
  const sorted = [...data]
    .sort((a, b) => {
      const va = a.value?.[0]?.extracted_value ?? 0
      const vb = b.value?.[0]?.extracted_value ?? 0
      return vb - va
    })
    .slice(0, 8)

  const max = sorted[0]?.value?.[0]?.extracted_value ?? 100

  return (
    <div className="space-y-3">
      {sorted.map((region) => {
        const val = region.value?.[0]?.extracted_value ?? 0
        const pct = max > 0 ? Math.round((val / max) * 100) : 0
        return (
          <div key={region.location} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-sm text-[var(--sea-ink-soft)]">
              {region.location}
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-[var(--line)] h-2">
              <div
                className="h-full rounded-full bg-[var(--lagoon-deep)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-[var(--sea-ink)]">{val}</span>
          </div>
        )
      })}
    </div>
  )
}
