import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type Color = 'green' | 'red' | 'neutral' | 'orange'
type Arrow = 'up' | 'down' | 'neutral'

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  color?: Color
  arrow?: Arrow
}

const colorMap: Record<Color, string> = {
  green: '#16A34A',
  red: '#DC2626',
  neutral: '#6B7280',
  orange: '#EA580C',
}

export default function KpiCard({ label, value, subtitle, color = 'neutral', arrow }: KpiCardProps) {
  return (
    <Card className="gap-2 py-5">
      <CardContent className="px-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: colorMap[color] }}
          >
            {value}
          </span>
          {arrow && arrow !== 'neutral' && (
            <span
              className={cn('text-lg font-bold')}
              style={{ color: colorMap[arrow === 'up' ? 'green' : 'red'] }}
            >
              {arrow === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
