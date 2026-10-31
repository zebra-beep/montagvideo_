import { motion } from 'framer-motion';
import { EditingTool } from '../types';
import {
  Scissors, Maximize, Volume2, Type, Trash2, Music,
  CheckCircle2, AlertCircle, Sparkles, Wand2, Zap
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

const tools: { id: EditingTool; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'trim', label: 'Удаление кадров', icon: <Scissors className="w-4 h-4" />, description: 'Убрать неудачные дубли' },
  { id: 'format', label: 'Формат', icon: <Maximize className="w-4 h-4" />, description: 'Унифицировать форматы' },
  { id: 'audio', label: 'Озвучка', icon: <Volume2 className="w-4 h-4" />, description: 'Сохранить голос' },
  { id: 'subtitles', label: 'Субтитры', icon: <Type className="w-4 h-4" />, description: 'Стильные субтитры' },
  { id: 'logo', label: 'Логотипы', icon: <Trash2 className="w-4 h-4" />, description: 'Удалить водяные знаки' },
  { id: 'sfx', label: 'Звуки', icon: <Music className="w-4 h-4" />, description: 'Фоновые эффекты' },
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

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-violet-400" />
        Инструменты монтажа
      </h2>

      {/* Tools list */}
      <div className="space-y-1.5 mb-6">
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
            </motion.button>
          );
        })}
      </div>

      {/* Apply button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={selectedTool === 'audio'}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <Zap className="w-4 h-4" />
        {selectedTool === 'audio' ? 'Озвучка сохранена ✓' : 'Применить'}
      </motion.button>

      {/* Stats */}
      <div className="mt-auto">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          Статистика
        </h3>
        <div className="space-y-2">
          <StatRow label="Всего сцен" value={stats.total} color="text-gray-300" />
          <StatRow label="Неудачные" value={stats.bad} color="text-red-400" />
          <StatRow label="С логотипами" value={stats.withLogos} color="text-amber-400" />
          <StatRow label="Другой формат" value={stats.differentFormat} color="text-blue-400" />
        </div>

        {/* Applied effects */}
        {appliedEffects.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Применено
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

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-500">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
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
