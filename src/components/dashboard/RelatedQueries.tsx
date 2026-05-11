type Query = {
  query?: string
  value?: string
  extracted_value?: number
}

interface RelatedQueriesProps {
  queries: Query[]
}

export default function RelatedQueries({ queries }: RelatedQueriesProps) {
  return (
    <ul className="space-y-2">
      {queries.slice(0, 10).map((q, i) => (
        <li
          key={q.query ?? i}
          className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 dark:bg-white/5"
        >
          <span className="text-sm font-medium text-[var(--sea-ink)]">{q.query}</span>
          {q.value && (
            <span className="ml-3 shrink-0 rounded-full bg-[rgba(79,184,178,0.14)] px-2.5 py-0.5 text-xs font-semibold text-[var(--lagoon-deep)]">
              {q.value === 'Breakout' ? '🔥 Explosão' : `+${q.value}%`}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
