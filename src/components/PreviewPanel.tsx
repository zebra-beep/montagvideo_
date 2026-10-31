import { motion, AnimatePresence } from 'framer-motion';
import { Scene } from '../types';
import { Subtitles, Music, Volume2 } from 'lucide-react';

interface PreviewPanelProps {
  scenes: Scene[];
  currentTime: number;
  totalDuration: number;
  showSubtitles: boolean;
}

export default function PreviewPanel({ scenes, currentTime, totalDuration, showSubtitles }: PreviewPanelProps) {
  // Determine current scene
  let accumulated = 0;
  let currentScene = scenes[0];
  for (const scene of scenes) {
    accumulated += scene.duration;
    if (currentTime < accumulated) {
      currentScene = scene;
      break;
    }
  }

  const subtitleTexts = [
    'Добро пожаловать в наш проект...',
    'Сегодня мы рассмотрим важную тему...',
    'Начнём с основных моментов...',
    'Обратите внимание на детали...',
    'Это ключевой момент...',
    'Подведём итоги...',
    'Спасибо за просмотр!',
  ];

  const subtitleIndex = Math.floor((currentTime / totalDuration) * subtitleTexts.length);
  const currentSubtitle = subtitleTexts[Math.min(subtitleIndex, subtitleTexts.length - 1)];

  return (
    <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-gray-800">
      {/* Video background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-400 rounded-full"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene?.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <motion.span
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentScene?.thumbnail || '🎬'}
          </motion.span>
          <h3 className="text-xl font-semibold text-white/90">{currentScene?.name || 'Превью'}</h3>
          <p className="text-sm text-gray-400 mt-1">{currentScene?.duration}с • {currentScene?.format}</p>
        </motion.div>
      </AnimatePresence>

      {/* Subtitles */}
      <AnimatePresence>
        {showSubtitles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10"
          >
            <p className="text-sm font-medium text-white text-center max-w-md">
              {currentSubtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound effects indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <motion.div
          className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Volume2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-400">SFX</span>
        </motion.div>
      </div>

      {/* Scene indicator */}
      <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
        <span className="text-[10px] text-gray-300">
          Сцена {scenes.indexOf(currentScene) + 1}/{scenes.length}
        </span>
      </div>

      {/* Format badge */}
      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
        <span className="text-[10px] text-gray-300">{currentScene?.format}</span>
      </div>
    </div>
  );
}
