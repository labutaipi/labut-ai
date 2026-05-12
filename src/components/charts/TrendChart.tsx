import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type TimelineValue = {
  query?: string
  value?: string
  extracted_value?: number
}

type TimelineEntry = {
  date?: string
  values?: TimelineValue[]
}

interface TrendChartProps {
  data: TimelineEntry[]
  keywords: readonly string[]
}

const COLORS = ['#328f97', '#16A34A', '#EA580C', '#6B7280', '#DC2626']

export default function TrendChart({ data, keywords }: TrendChartProps) {
  const chartData = data.map((entry) => {
    const point: Record<string, unknown> = { date: formatDate(entry.date ?? '') }
    entry.values?.forEach((v, i) => {
      point[keywords[i] ?? `kw${i}`] = v.extracted_value ?? 0
    })
    return point
  })

  const visibleKeywords = keywords.slice(0, 5)

  return (
    <div className="h-56 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,58,64,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#416166' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#416166' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(23,58,64,0.14)',
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: '#173a40', fontWeight: 600, marginBottom: 4 }}
          />
          {visibleKeywords.map((kw, i) => (
            <Line
              key={kw}
              type="monotone"
              dataKey={kw}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('–')
  return parts[0]?.trim().slice(0, 6) ?? dateStr
}
