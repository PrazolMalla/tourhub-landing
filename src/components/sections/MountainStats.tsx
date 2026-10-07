const STATS = [
  { value: '13', label: 'Trek routes' },
  { value: '30+', label: 'Tour packages' },
  { value: '06', label: 'Years guiding' },
  { value: '4.9', label: 'Traveller rating' },
];

const PEAKS = [
  {
    name: 'KANGCHENJUNGA',
    meters: 8586,
    x: 135,
    href: '/trek/everest-base-camp-trek',
    labelDx: -55,
    labelDy: -50,
  },
  {
    name: 'DHAULAGIRI I',
    meters: 8167,
    x: 330,
    href: '/trek/ghodepani-poon-hill-trek',
    labelDx: -60,
    labelDy: -45,
  },
  {
    name: 'EVEREST',
    meters: 8848.86,
    x: 610,
    href: '/trek/everest-base-camp-trek',
    labelDx: -55,
    labelDy: -55,
  },
  {
    name: 'LHOTSE',
    meters: 8516,
    x: 730,
    href: '/trek/everest-base-camp-trek',
    labelDx: -35,
    labelDy: -48,
  },
  {
    name: 'MAKALU',
    meters: 8485,
    x: 850,
    href: '/trek/everest-base-camp-trek',
    labelDx: -45,
    labelDy: -48,
  },
  {
    name: 'CHO OYU',
    meters: 8188,
    x: 980,
    href: '/trek/everest-base-camp-trek',
    labelDx: -35,
    labelDy: -45,
  },
  {
    name: 'MANASLU',
    meters: 8163,
    x: 1095,
    href: '/trek/manaslu-circuit-trek',
    labelDx: -42,
    labelDy: -48,
  },
  {
    name: 'ANNAPURNA I',
    meters: 8091,
    x: 1240,
    href: '/trek/annapurna-base-camp',
    labelDx: -50,
    labelDy: -42,
  },
];

function peakY(meters: number) {
  const baseY = 270;
  const minHeight = 7900;
  const scale = 0.16;

  return baseY - (meters - minHeight) * scale;
}

function formatHeight(meters: number) {
  return `${Math.round(meters).toLocaleString()}m`;
}

export function MountainStats() {
  return (
    <section className="relative overflow-hidden bg-[#f7f7f4] py-24">
      <div className="wrap">
        <div className="mx-auto max-w-7xl text-center">
          <MountainLine />

          <div className="mt-8 flex items-center justify-center gap-3">
            <h2 className="font-serif text-3xl font-bold text-neutral-950 md:text-4xl">
              Himalayan journeys
            </h2>
            <span className="text-4xl leading-none text-neutral-950">→</span>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-4xl font-bold text-emerald-600 md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-[0.28em] text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MountainLine() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <svg
        viewBox="0 0 1400 360"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* very soft far background ridge */}
        <path
          d="M0 255 C55 238 95 230 145 242 C190 252 230 225 275 210 C330 192 370 250 430 222 C495 190 550 205 610 225 C685 250 735 205 800 215 C870 226 920 190 980 215 C1045 238 1090 205 1150 215 C1220 225 1290 245 1400 220"
          stroke="#e4e4e4"
          strokeWidth="1.2"
        />

        {/* second background ridge */}
        <path
          d="M0 275 C80 238 135 248 200 220 C260 190 310 238 370 205 C430 168 485 245 545 195 C610 138 665 230 730 170 C800 112 860 235 925 180 C995 135 1050 238 1115 190 C1185 150 1250 232 1400 190"
          stroke="#d2d2d2"
          strokeWidth="1.45"
        />

        {/* main flowing front ridge */}
        <path
          d="M0 295
          C45 282 85 260 120 240
          C160 218 185 250 220 218
          C260 180 300 255 340 222
          C380 188 420 135 465 112
          C510 88 545 210 590 158
          C635 105 665 70 705 62
          C750 52 785 172 825 132
          C870 86 900 215 950 165
          C1000 122 1040 230 1090 180
          C1140 135 1180 238 1230 195
          C1280 150 1335 198 1400 175"
          stroke="#a9a9a9"
          strokeWidth="1.9"
        />

        {/* lower terrain contour */}
        <path
          d="M0 305 C90 280 150 285 220 265 C300 245 360 290 440 258 C520 230 590 292 670 258 C750 225 820 292 900 260 C980 235 1055 290 1135 262 C1220 238 1310 280 1400 255"
          stroke="#c4c4c4"
          strokeWidth="1.25"
        />

        {/* individual mountain depth and contour lines */}
        {PEAKS.map((peak, index) => {
          const y = peakY(peak.meters);
          const baseY = 292;
          const width = index === 2 ? 96 : 76;

          return (
            <g key={`mountain-${peak.name}`}>
              <path
                d={`M ${peak.x - width} ${baseY}
                  C ${peak.x - width / 1.7} ${baseY - 35},
                    ${peak.x - 28} ${y + 58},
                    ${peak.x} ${y}
                  C ${peak.x + 30} ${y + 58},
                    ${peak.x + width / 1.6} ${baseY - 38},
                    ${peak.x + width} ${baseY}`}
                stroke={index === 2 ? '#8f8f8f' : '#b8b8b8'}
                strokeWidth={index === 2 ? 2.1 : 1.45}
              />

              <path
                d={`M ${peak.x - 45} ${baseY - 8}
                  C ${peak.x - 25} ${baseY - 55},
                    ${peak.x - 12} ${y + 58},
                    ${peak.x} ${y + 12}
                  C ${peak.x + 12} ${y + 58},
                    ${peak.x + 25} ${baseY - 58},
                    ${peak.x + 48} ${baseY - 12}`}
                stroke="#dadada"
                strokeWidth="1"
              />

              <path
                d={`M ${peak.x - 25} ${baseY - 35}
                  C ${peak.x - 8} ${baseY - 72},
                    ${peak.x + 15} ${baseY - 75},
                    ${peak.x + 35} ${baseY - 38}`}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* clickable labels */}
        {PEAKS.map((peak) => {
          const y = peakY(peak.meters);
          const labelX = peak.x + peak.labelDx;
          const labelY = y + peak.labelDy;
          const lineEndX = labelX + 95;

          return (
            <a key={peak.name} href={peak.href} className="group">
              <g className="cursor-pointer">
                <path
                  d={`M ${peak.x} ${y - 2} V ${labelY + 20} H ${lineEndX}`}
                  stroke="#666"
                  strokeWidth="1"
                />

                <text
                  x={labelX}
                  y={labelY}
                  className="fill-neutral-700 font-mono text-[11px] transition group-hover:fill-emerald-600"
                >
                  <tspan x={labelX} dy="0">
                    {peak.name}
                  </tspan>
                  <tspan x={labelX} dy="15">
                    {formatHeight(peak.meters)}
                  </tspan>
                </text>
              </g>
            </a>
          );
        })}
      </svg>
    </div>
  );
}
