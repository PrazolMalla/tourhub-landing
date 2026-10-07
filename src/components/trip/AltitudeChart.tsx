'use client';

import type { AltitudePoint } from '@/types/trip';
import { useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const INK = 'var(--ink, #0f172a)';
const ACCENT = 'var(--green-btn, #0f766e)';
const MUTED = 'var(--muted, #64748b)';
const LINE = 'var(--line, #e5e7eb)';
const PAPER = `#ffffff`;

// Fixed locale: an unspecified locale differs server vs browser and breaks hydration.
const fmt = (n: number) => n.toLocaleString('en-US');

type Row = { i: number; name: string; altitude: number; delta: number | null };

/* ---------- Peak marker: pulsing halo + floating label pill ---------- */
function PeakMarker({ cx, cy, label }: { cx?: number; cy?: number; label: string }) {
  if (cx == null || cy == null) return null;
  const w = label.length * 7 + 22;

  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={8} fill={ACCENT} opacity={0.3} className="motion-reduce:hidden">
        <animate attributeName="r" values="8;20" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={7} fill={ACCENT} stroke={PAPER} strokeWidth={3} />

      <g transform={`translate(${cx}, ${cy - 30})`}>
        <rect x={-w / 2} y={-13} width={w} height={26} rx={13} fill={INK} />
        <path d="M -5 12.5 L 0 18 L 5 12.5 Z" fill={INK} />
        <text
          textAnchor="middle"
          y={4.5}
          fontSize={12}
          fontWeight={600}
          fill="#fff"
          style={{ letterSpacing: '0.02em' }}
        >
          {label}
        </text>
      </g>
    </g>
  );
}

/* ---------- Tooltip ---------- */
function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.25)]">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
        {row.name}
      </div>
      <div className="mt-0.5 text-[17px] font-semibold text-ink">{fmt(row.altitude)} m</div>
      <div className="mt-0.5 text-[12px] text-muted">
        {row.delta === null
          ? 'Starting point'
          : `${row.delta >= 0 ? '▲ +' : '▼ −'}${fmt(Math.abs(row.delta))} m from previous stop`}
      </div>
    </div>
  );
}

/* ---------- Chart ---------- */
export function AltitudeChart({
  points,
  smooth = false,
}: {
  points: AltitudePoint[];
  /** Smooth curve looks softer, but draws slopes between stops that don't exist. */
  smooth?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fillId = `alt-fill-${uid}`;
  const strokeId = `alt-stroke-${uid}`;

  const { data, peak, ascent, yDomain } = useMemo(() => {
    const rows: Row[] = points.map((p, i) => ({
      i,
      name: p.l,
      altitude: p.m,
      delta: i === 0 ? null : p.m - points[i - 1].m,
    }));
    const peakRow = rows.reduce((a, b) => (b.altitude > a.altitude ? b : a), rows[0]);
    const totalAscent = rows.reduce((s, r) => s + (r.delta && r.delta > 0 ? r.delta : 0), 0);
    const lo = Math.min(...rows.map((r) => r.altitude));

    return {
      data: rows,
      peak: peakRow,
      ascent: totalAscent,
      yDomain: [
        Math.max(0, Math.floor((lo - 200) / 500) * 500),
        Math.ceil((peakRow.altitude + 500) / 500) * 500,
      ] as [number, number],
    };
  }, [points]);

  return (
    <div
      className="relative overflow-hidden rounded-(--r-lg) border border-line p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:p-7"
      style={{
        background: `linear-gradient(180deg, ${PAPER} 0%, color-mix(in srgb, ${ACCENT} 5%, ${PAPER}) 100%)`,
      }}
    >
      {/* Header: one hero number, two supporting ones */}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            Highest point
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[38px] font-semibold leading-none tracking-tight text-ink sm:text-[46px]">
              {fmt(peak.altitude)}
            </span>
            <span className="text-[16px] font-medium text-muted">m</span>
          </div>
          <div className="mt-1.5 text-[13px] text-muted">{peak.name}</div>
        </div>

        <div className="flex gap-8 sm:gap-10">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              Start
            </div>
            <div className="mt-1.5 text-[18px] font-semibold text-ink">
              {fmt(data[0].altitude)} m
            </div>
          </div>
          <div className="border-l border-line pl-8 sm:pl-10">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              Total ascent
            </div>
            <div className="mt-1.5 text-[18px] font-semibold text-ink">+{fmt(ascent)} m</div>
          </div>
        </div>
      </div>

      <div
        className="mt-6 h-[300px] w-full sm:h-[360px]"
        role="img"
        aria-label={`Altitude profile from ${data[0].name} at ${fmt(data[0].altitude)} metres to a high point of ${fmt(peak.altitude)} metres at ${peak.name}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 52, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.38} />
                <stop offset="70%" stopColor={ACCENT} stopOpacity={0.08} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ACCENT} />
                <stop offset="100%" stopColor={INK} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={LINE}
              strokeDasharray="1 5"
              strokeLinecap="round"
              vertical={false}
            />

            <XAxis
              type="number"
              dataKey="i"
              domain={[0, data.length - 1]}
              ticks={data.map((r) => r.i)}
              tickFormatter={(i: number) => data[i]?.name ?? ''}
              interval="preserveStartEnd"
              minTickGap={20}
              padding={{ left: 30, right: 30 }}
              tick={{ fontSize: 10.5, fill: MUTED }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              domain={yDomain}
              tickCount={5}
              width={48}
              tick={{ fontSize: 10.5, fill: MUTED }}
              tickFormatter={(v: number) => fmt(v)}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: INK, strokeOpacity: 0.2, strokeDasharray: '2 4' }}
              isAnimationActive={false}
            />

            <Area
              type={smooth ? 'monotone' : 'linear'}
              dataKey="altitude"
              stroke={`url(#${strokeId})`}
              strokeWidth={2.25}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill={`url(#${fillId})`}
              dot={{ r: 3.5, fill: PAPER, stroke: INK, strokeWidth: 1.5 }}
              activeDot={{ r: 6.5, fill: ACCENT, stroke: PAPER, strokeWidth: 2.5 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />

            <ReferenceDot
              x={peak.i}
              y={peak.altitude}
              ifOverflow="extendDomain"
              shape={<PeakMarker label={`${fmt(peak.altitude)} m`} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
