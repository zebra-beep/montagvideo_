import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scene } from '../types';
import {
  X, Download, CheckCircle2, Film, Clock, HardDrive,
  Sparkles, Loader2
} from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  scenes: Scene[];
  appliedEffects: string[];
}

type ExportQuality = '720p' | '1080p' | '4k';
type ExportFormat = 'mp4' | 'mov' | 'webm';

export default function ExportModal({ onClose, scenes, appliedEffects }: ExportModalProps) {
  const [quality, setQuality] = useState<ExportQuality>('1080p');
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  const handleExport = () => {
    setIsExporting(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Экспорт видео</h2>
              <p className="text-xs text-gray-400">Настройте параметры экспорта</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {!isComplete ? (
            <>
              {/* Quality */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Качество</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '1080p', '4k'] as ExportQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        quality === q
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {q === '4k' ? '4K' : q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Формат</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mp4', 'mov', 'webm'] as ExportFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all uppercase ${
                        format === f
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      .{f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <Film className="w-3 h-3" /> Сцен
                  </span>
                  <span className="text-xs font-medium text-white">{scenes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Длительность
                  </span>
                  <span className="text-xs font-medium text-white">{totalDuration}с</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <HardDrive className="w-3 h-3" /> Примерный размер
                  </span>
                  <span className="text-xs font-medium text-white">
                    {quality === '4k' ? '~2.4 GB' : quality === '1080p' ? '~850 MB' : '~420 MB'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Эффектов применено
                  </span>
                  <span className="text-xs font-medium text-white">{appliedEffects.length}</span>
                </div>
              </div>

              {/* Applied effects list */}
              {appliedEffects.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Применённые эффекты</label>
                  <div className="flex flex-wrap gap-1.5">
                    {appliedEffects.map((effect) => (
                      <span key={effect} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {getEffectLabel(effect)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-1">Экспорт завершён!</h3>
              <p className="text-sm text-gray-400">Видео готово к скачиванию</p>
            </motion.div>
          )}

          {/* Progress bar */}
          {isExporting && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center">Обработка... {progress}%</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
          >
            {isComplete ? 'Закрыть' : 'Отмена'}
          </button>
          {!isComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Экспорт...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Экспортировать
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function getEffectLabel(effect: string): string {
  switch (effect) {
    case 'bad-removed': return 'Удаление неудачных кадров';
    case 'format-normalized': return 'Унификация формата';
    case 'logos-removed': return 'Удаление логотипов';
    case 'subtitles-added': return 'Стильные субтитры';
    case 'sfx-added': return 'Фоновые звуки';
    default: return effect;
  }
}
