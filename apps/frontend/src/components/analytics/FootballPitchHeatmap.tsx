import React, { useMemo } from 'react';

interface FootballPitchHeatmapProps {
  matrix?: number[][];
  heatmapType?: string;
  title?: string;
}

export const FootballPitchHeatmap: React.FC<FootballPitchHeatmapProps> = ({
  matrix,
  heatmapType = 'player',
  title = 'Pitch Heatmap Visualization',
}) => {
  const defaultMatrix = useMemo(() => {
    if (matrix && matrix.length > 0) return matrix;
    const grid: number[][] = [];
    for (let r = 0; r < 20; r++) {
      const rowArr: number[] = [];
      for (let c = 0; c < 30; c++) {
        const x = (c / 30) * 105;
        const y = (r / 20) * 68;
        let val = 0;
        if (heatmapType === 'attacking') {
          val = Math.max(0, Math.sin((x / 105) * Math.PI) * 90 + Math.cos((y / 68) * Math.PI) * 20);
        } else if (heatmapType === 'defensive') {
          val = Math.max(0, (1 - x / 105) * 85 + Math.sin((y / 68) * Math.PI) * 30);
        } else {
          val = Math.max(0, 100 - Math.hypot(x - 52.5, y - 34) * 1.9);
        }
        rowArr.push(Math.round(val));
      }
      grid.push(rowArr);
    }
    return grid;
  }, [matrix, heatmapType]);

  const getColor = (val: number) => {
    if (val < 15) return 'transparent';
    if (val < 35) return 'rgba(59, 130, 246, 0.45)'; // Blue
    if (val < 55) return 'rgba(34, 197, 94, 0.65)';  // Green
    if (val < 75) return 'rgba(234, 179, 8, 0.85)';  // Yellow
    return 'rgba(239, 68, 68, 0.92)';               // Red
  };

  return (
    <div className="rounded-2xl bg-[#0f2416] p-4 text-white shadow-xl border border-emerald-900/60">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold tracking-wide text-emerald-400 uppercase">{title}</h4>
          <p className="text-xs text-emerald-200/70">Tracking coordinates aggregated on standard 105m x 68m pitch</p>
        </div>
        <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-300">
          {heatmapType.toUpperCase()} MODE
        </span>
      </div>

      {/* FOOTBALL PITCH SVG OVERLAY + HEATMAP GRID */}
      <div className="relative aspect-[105/68] w-full overflow-hidden rounded-xl bg-[#14381e] border-2 border-emerald-500/40">
        {/* Heatmap Grid Layer */}
        <div className="absolute inset-0 grid grid-cols-30 grid-rows-20 opacity-85">
          {defaultMatrix.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{ backgroundColor: getColor(val) }}
                className="transition-colors duration-300"
                title={`Intensity: ${val}%`}
              />
            )),
          )}
        </div>

        {/* Pitch Lines SVG */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none stroke-emerald-300/60 fill-none"
          strokeWidth="2"
          viewBox="0 0 105 68"
        >
          {/* Outer Boundary */}
          <rect x="2" y="2" width="101" height="64" />
          {/* Halfway Line */}
          <line x1="52.5" y1="2" x2="52.5" y2="66" />
          {/* Center Circle */}
          <circle cx="52.5" cy="34" r="9.15" />
          <circle cx="52.5" cy="34" r="0.8" fill="rgba(255,255,255,0.8)" />

          {/* Left Penalty Area (18-yard box) */}
          <rect x="2" y="13.84" width="16.5" height="40.32" />
          {/* Left 6-yard box */}
          <rect x="2" y="24.84" width="5.5" height="18.32" />
          {/* Left Penalty Spot */}
          <circle cx="13" cy="34" r="0.6" fill="rgba(255,255,255,0.8)" />

          {/* Right Penalty Area */}
          <rect x="86.5" y="13.84" width="16.5" height="40.32" />
          {/* Right 6-yard box */}
          <rect x="97.5" y="24.84" width="5.5" height="18.32" />
          {/* Right Penalty Spot */}
          <circle cx="92" cy="34" r="0.6" fill="rgba(255,255,255,0.8)" />

          {/* Goals */}
          <rect x="0.5" y="30.34" width="1.5" height="7.32" strokeWidth="1" />
          <rect x="103" y="30.34" width="1.5" height="7.32" strokeWidth="1" />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200/80">
        <span>Low Intensity</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded bg-blue-500/60 inline-block" />
          <span className="h-3 w-6 rounded bg-emerald-500/80 inline-block" />
          <span className="h-3 w-6 rounded bg-yellow-500/90 inline-block" />
          <span className="h-3 w-6 rounded bg-red-500 inline-block" />
        </div>
        <span>High Intensity</span>
      </div>
    </div>
  );
};
