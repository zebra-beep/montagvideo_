import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scene } from '../types';
import { Trash2, AlertCircle } from 'lucide-react';

interface TimelineProps {
  scenes: Scene[];
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  appliedEffects: string[];
}

export default function Timeline({ scenes, currentTime, totalDuration, onSeek, appliedEffects }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredScene, setHoveredScene] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * totalDuration);
  };

  let accumulatedTime = 0;

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">Таймлайн</span>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Хорошие
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Удалить
          </span>
          {appliedEffects.includes('logos-removed') && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Логотипы убраны
            </span>
          )}
        </div>
      </div>

      {/* Time ruler */}
      <div className="relative h-4 mb-1">
        {Array.from({ length: Math.ceil(totalDuration / 5) + 1 }).map((_, i) => {
          const time = i * 5;
          if (time > totalDuration) return null;
          const left = (time / totalDuration) * 100;
          return (
            <span
              key={i}
              className="absolute text-[10px] text-gray-600 -translate-x-1/2"
              style={{ left: `${left}%` }}
            >
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </span>
          );
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex-1 relative rounded-lg overflow-hidden bg-gray-800/50 cursor-pointer border border-gray-700/50"
        onClick={handleClick}
      >
        {/* Scenes */}
        <div className="flex h-full">
          {scenes.map((scene) => {
            const width = (scene.duration / totalDuration) * 100;
            const isBad = scene.status === 'bad';
            const isRemoved = appliedEffects.includes('bad-removed') && isBad;

            accumulatedTime += scene.duration;

            return (
              <motion.div
                key={scene.id}
                initial={{ opacity: 1 }}
                animate={{
                  opacity: isRemoved ? 0.2 : 1,
                  scaleY: isRemoved ? 0.5 : 1,
                }}
                className={`relative h-full flex items-center justify-center border-r border-gray-700/30 overflow-hidden group transition-all ${
                  isBad ? 'bg-red-900/30' : 'bg-gradient-to-b from-violet-900/40 to-fuchsia-900/40'
                }`}
                style={{ width: `${width}%`, minWidth: '20px' }}
                onMouseEnter={() => setHoveredScene(scene.id)}
                onMouseLeave={() => setHoveredScene(null)}
              >
                <span className="text-lg">{scene.thumbnail}</span>
                {scene.hasLogo && !appliedEffects.includes('logos-removed') && (
                  <span className="absolute top-1 right-1 text-[8px] bg-amber-500/80 rounded px-1 text-white">
                    LOGO
                  </span>
                )}
                {scene.format !== '16:9' && !appliedEffects.includes('format-normalized') && (
                  <span className="absolute bottom-1 left-1 text-[8px] bg-blue-500/80 rounded px-1 text-white">
                    {scene.format}
                  </span>
                )}

                {/* Hover tooltip */}
                {hoveredScene === scene.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 rounded px-2 py-1 text-[10px] whitespace-nowrap z-10 shadow-lg border border-gray-700"
                  >
                    {scene.name} ({scene.duration}с)
                  </motion.div>
                )}

                {isRemoved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/50">
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10 pointer-events-none"
          style={{ left: `${(currentTime / totalDuration) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
        </motion.div>
      </div>
    </div>
  );
}
