'use client';

type Point = { t: string; v: number };

export function AnalyticsLineChart({
  points,
  height = 160,
  strokeClassName = 'stroke-primary-600',
}: {
  points: Point[];
  height?: number;
  strokeClassName?: string;
}) {
  if (points.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-neutral-200 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        No data in this range.
      </div>
    );
  }

  const values = points.map((p) => p.v);
  const minV = Math.min(...values, 0);
  const maxV = Math.max(...values, 1);
  const w = 560;
  const pad = 12;
  const innerW = w - pad * 2;
  const innerH = height - pad * 2;
  const n = points.length;
  const step = n <= 1 ? innerW : innerW / (n - 1);

  const pts = points.map((p, i) => {
    const x = pad + i * step;
    const yNorm = (p.v - minV) / (maxV - minV || 1);
    const y = pad + innerH - yNorm * innerH;
    return `${x},${y}`;
  });

  return (
    <svg
      aria-label="Line chart"
      className="w-full max-w-full text-neutral-900 dark:text-neutral-100"
      role="img"
      viewBox={`0 0 ${w} ${height}`}
    >
      <title>Time series</title>
      <rect fill="currentColor" height={height} opacity={0.03} rx={12} width={w} x={0} y={0} />
      <polyline
        className={strokeClassName}
        fill="none"
        points={pts.join(' ')}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p, i) => {
        const x = pad + i * step;
        const yNorm = (p.v - minV) / (maxV - minV || 1);
        const y = pad + innerH - yNorm * innerH;
        return <circle className="fill-primary-500" cx={x} cy={y} key={p.t} r={3} />;
      })}
    </svg>
  );
}

export function AnalyticsBarList({
  rows,
  labelKey,
  valueKey,
  valueSuffix = '',
}: {
  rows: Record<string, unknown>[];
  labelKey: string;
  valueKey: string;
  valueSuffix?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">No rows.</p>;
  }
  const max = Math.max(
    1,
    ...rows.map((r) => {
      const v = r[valueKey];
      return typeof v === 'number' ? v : Number(v);
    })
  );
  return (
    <ul className="space-y-2">
      {rows.map((r, idx) => {
        const label = String(r[labelKey] ?? idx);
        const val = typeof r[valueKey] === 'number' ? (r[valueKey] as number) : Number(r[valueKey]);
        const pct = Math.round((val / max) * 100);
        return (
          <li className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950" key={`${label}-${idx}`}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-neutral-800 dark:text-neutral-100">{label}</span>
              <span className="tabular-nums text-neutral-600 dark:text-neutral-300">
                {val}
                {valueSuffix}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
