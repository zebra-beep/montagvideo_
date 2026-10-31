import { motion } from 'framer-motion';
import { EditingTool } from '../types';
import {
  Scissors, Maximize, Volume2, Type, Trash2, Music,
  CheckCircle2, AlertCircle, Sparkles, Wand2, Zap, ArrowRight
} from 'lucide-react';

interface ToolPanelProps {
  selectedTool: EditingTool;
  onSelectTool: (tool: EditingTool) => void;
  onRemoveBad: () => void;
  onNormalizeFormat: () => void;
  onRemoveLogos: () => void;
  onAddSubtitles: () => void;
  onAddSoundEffects: () => void;
  appliedEffects: string[];
  stats: {
    total: number;
    bad: number;
    withLogos: number;
    differentFormat: number;
  };
}

const tools: { id: EditingTool; label: string; icon: React.ReactNode; description: string; action: string }[] = [
  { id: 'trim', label: 'Удалить неудачные', icon: <Scissors className="w-4 h-4" />, description: 'Убрать плохие дубли', action: 'Удалить кадры' },
  { id: 'format', label: 'Формат 16:9', icon: <Maximize className="w-4 h-4" />, description: 'Выровнять все сцены', action: 'Нормализовать' },
  { id: 'audio', label: 'Сохранить озвучку', icon: <Volume2 className="w-4 h-4" />, description: 'Целостность аудио', action: 'Автоматически ✓' },
  { id: 'subtitles', label: 'Добавить субтитры', icon: <Type className="w-4 h-4" />, description: 'Стильные подписи', action: 'Добавить' },
  { id: 'logo', label: 'Убрать логотипы', icon: <Trash2 className="w-4 h-4" />, description: 'Удалить водяные знаки', action: 'Удалить' },
  { id: 'sfx', label: 'Фоновые звуки', icon: <Music className="w-4 h-4" />, description: 'Дополнительные SFX', action: 'Добавить' },
];

export default function ToolPanel({
  selectedTool,
  onSelectTool,
  onRemoveBad,
  onNormalizeFormat,
  onRemoveLogos,
  onAddSubtitles,
  onAddSoundEffects,
  appliedEffects,
  stats,
}: ToolPanelProps) {
  const handleApply = () => {
    switch (selectedTool) {
      case 'trim': onRemoveBad(); break;
      case 'format': onNormalizeFormat(); break;
      case 'logo': onRemoveLogos(); break;
      case 'subtitles': onAddSubtitles(); break;
      case 'sfx': onAddSoundEffects(); break;
    }
  };

  const isApplied = (effect: string) => appliedEffects.includes(effect);

  const getToolEffect = (toolId: EditingTool): string => {
    switch (toolId) {
      case 'trim': return 'bad-removed';
      case 'format': return 'format-normalized';
      case 'logo': return 'logos-removed';
      case 'subtitles': return 'subtitles-added';
      case 'sfx': return 'sfx-added';
      default: return '';
    }
  };

  const currentTool = tools.find(t => t.id === selectedTool);
  const currentApplied = isApplied(getToolEffect(selectedTool));

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-violet-400" />
        Инструменты монтажа
      </h2>

      {/* Tools list */}
      <div className="space-y-1.5 mb-4">
        {tools.map((tool) => {
          const applied = isApplied(getToolEffect(tool.id));
          return (
            <motion.button
              key={tool.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTool(tool.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                selectedTool === tool.id
                  ? 'bg-violet-600/20 border border-violet-500/30 text-white'
                  : 'hover:bg-gray-800/50 text-gray-400 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                applied ? 'bg-emerald-500/20 text-emerald-400' :
                selectedTool === tool.id ? 'bg-violet-500/20 text-violet-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {applied ? <CheckCircle2 className="w-4 h-4" /> : tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{tool.label}</p>
                <p className="text-[10px] text-gray-500 truncate">{tool.description}</p>
              </div>
              {applied && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                  Готово
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Apply button */}
      <motion.button
        whileHover={{ scale: currentApplied || selectedTool === 'audio' ? 1 : 1.02 }}
        whileTap={{ scale: currentApplied || selectedTool === 'audio' ? 1 : 0.98 }}
        onClick={handleApply}
        disabled={selectedTool === 'audio' || currentApplied}
        className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all mb-4 ${
          currentApplied || selectedTool === 'audio'
            ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-default'
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20'
        }`}
      >
        {currentApplied ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Применено ✓
          </>
        ) : selectedTool === 'audio' ? (
          <>
            <Volume2 className="w-4 h-4" />
            Озвучка сохранена ✓
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            {currentTool?.action || 'Применить'}
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </motion.button>

      {/* Selected tool info */}
      <div className="px-3 py-2.5 rounded-xl bg-gray-800/30 border border-gray-800 mb-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Выбрано:</p>
        <p className="text-xs text-gray-300">{currentTool?.label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{currentTool?.description}</p>
      </div>

      {/* Stats */}
      <div className="mt-auto">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          Что нужно исправить
        </h3>
        <div className="space-y-2">
          {stats.bad > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
              <span className="text-[11px] text-gray-400">❌ Неудачные кадры</span>
              <span className="text-xs font-bold text-red-400">{stats.bad}</span>
            </div>
          )}
          {stats.withLogos > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <span className="text-[11px] text-gray-400">🏷️ С логотипами</span>
              <span className="text-xs font-bold text-amber-400">{stats.withLogos}</span>
            </div>
          )}
          {stats.differentFormat > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <span className="text-[11px] text-gray-400">📐 Другой формат</span>
              <span className="text-xs font-bold text-blue-400">{stats.differentFormat}</span>
            </div>
          )}
          {stats.bad === 0 && stats.withLogos === 0 && stats.differentFormat === 0 && (
            <div className="flex items-center justify-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-xs text-emerald-400">✅ Всё в порядке!</span>
            </div>
          )}
        </div>

        {/* Applied effects */}
        {appliedEffects.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Применённые эффекты
            </h3>
            <div className="flex flex-wrap gap-1">
              {appliedEffects.map((effect) => (
                <span key={effect} className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
                  {getEffectLabel(effect)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getEffectLabel(effect: string): string {
  switch (effect) {
    case 'bad-removed': return 'Кадры удалены';
    case 'format-normalized': return 'Формат 16:9';
    case 'logos-removed': return 'Логотипы убраны';
    case 'subtitles-added': return 'Субтитры';
    case 'sfx-added': return 'Звуковые эффекты';
    default: return effect;
  }
}
