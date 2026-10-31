import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Film, Download, ChevronRight, ChevronLeft, RotateCcw,
  HelpCircle, X
} from 'lucide-react';
import Timeline from './components/Timeline';
import PreviewPanel from './components/PreviewPanel';
import ToolPanel from './components/ToolPanel';
import ExportModal from './components/ExportModal';
import Onboarding from './components/Onboarding';
import { Scene, EditingTool } from './types';

const initialScenes: Scene[] = [
  { id: '1', name: 'Вступление', duration: 5, thumbnail: '🎬', status: 'good', format: '16:9', hasLogo: false },
  { id: '2', name: 'Интервью ч.1', duration: 12, thumbnail: '🎤', status: 'good', format: '16:9', hasLogo: false },
  { id: '3', name: 'Неудачный дубль', duration: 3, thumbnail: '❌', status: 'bad', format: '4:3', hasLogo: true },
  { id: '4', name: 'B-roll кадры', duration: 8, thumbnail: '🌆', status: 'good', format: '16:9', hasLogo: false },
  { id: '5', name: 'Неудачный кадр', duration: 2, thumbnail: '❌', status: 'bad', format: '16:9', hasLogo: false },
  { id: '6', name: 'Основная часть', duration: 15, thumbnail: '📹', status: 'good', format: '4:3', hasLogo: true },
  { id: '7', name: 'Переход', duration: 4, thumbnail: '✨', status: 'good', format: '16:9', hasLogo: false },
  { id: '8', name: 'Финал', duration: 6, thumbnail: '🎉', status: 'good', format: '16:9', hasLogo: false },
];

function App() {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [selectedTool, setSelectedTool] = useState<EditingTool>('trim');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, totalDuration]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeBadScenes = () => {
    const badCount = scenes.filter(s => s.status === 'bad').length;
    if (badCount === 0) {
      showNotification('ℹ️ Неудачных кадров не найдено');
      return;
    }
    setScenes(prev => prev.filter(s => s.status !== 'bad'));
    setAppliedEffects(prev => [...prev, 'bad-removed']);
    showNotification(`✅ Удалено ${badCount} неудачных кадров`);
  };

  const normalizeFormat = () => {
    const diffCount = scenes.filter(s => s.format !== '16:9').length;
    if (diffCount === 0) {
      showNotification('ℹ️ Все сцены уже в формате 16:9');
      return;
    }
    setScenes(prev => prev.map(s => ({ ...s, format: '16:9' })));
    setAppliedEffects(prev => [...prev, 'format-normalized']);
    showNotification(`✅ Формат ${diffCount} сцен изменён на 16:9`);
  };

  const removeLogos = () => {
    const logoCount = scenes.filter(s => s.hasLogo).length;
    if (logoCount === 0) {
      showNotification('ℹ️ Логотипов не обнаружено');
      return;
    }
    setScenes(prev => prev.map(s => ({ ...s, hasLogo: false })));
    setAppliedEffects(prev => [...prev, 'logos-removed']);
    showNotification(`✅ Убрано ${logoCount} логотипов`);
  };

  const addSubtitles = () => {
    if (appliedEffects.includes('subtitles-added')) {
      showNotification('ℹ️ Субтитры уже добавлены');
      return;
    }
    setAppliedEffects(prev => [...prev, 'subtitles-added']);
    showNotification('✅ Стильные субтитры добавлены');
  };

  const addSoundEffects = () => {
    if (appliedEffects.includes('sfx-added')) {
      showNotification('ℹ️ Звуковые эффекты уже добавлены');
      return;
    }
    setAppliedEffects(prev => [...prev, 'sfx-added']);
    showNotification('✅ Фоновые звуки добавлены');
  };

  const resetAll = () => {
    setScenes(initialScenes);
    setAppliedEffects([]);
    setCurrentTime(0);
    showNotification('🔄 Проект сброшен');
  };

  const goodScenes = scenes.filter(s => s.status !== 'bad');
  const scenesWithLogos = scenes.filter(s => s.hasLogo);
  const scenesWithDifferentFormat = scenes.filter(s => s.format !== '16:9');

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl text-sm font-medium"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-violet-400" />
                  Как пользоваться
                </h2>
                <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-gray-800 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                  <span className="text-lg">1️⃣</span>
                  <div>
                    <p className="font-medium text-white">Выберите инструмент слева</p>
                    <p className="text-gray-400 text-xs mt-0.5">Нажмите на нужный инструмент в панели</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                  <span className="text-lg">2️⃣</span>
                  <div>
                    <p className="font-medium text-white">Нажмите «Применить»</p>
                    <p className="text-gray-400 text-xs mt-0.5">Эффект применится ко всему видео</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                  <span className="text-lg">3️⃣</span>
                  <div>
                    <p className="font-medium text-white">Просмотрите результат</p>
                    <p className="text-gray-400 text-xs mt-0.5">Нажмите ▶️ для воспроизведения или кликните на таймлайн</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                  <span className="text-lg">4️⃣</span>
                  <div>
                    <p className="font-medium text-white">Экспортируйте видео</p>
                    <p className="text-gray-400 text-xs mt-0.5">Нажмите кнопку «Экспорт» вверху справа</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  💡 Совет: применяйте эффекты по порядку — сначала удалите неудачные кадры, потом нормализуйте формат, затем добавьте субтитры и звуки.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Video Editor Pro
          </h1>
          <span className="text-xs text-gray-500 ml-2 hidden sm:block">Автоматический монтаж</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            title="Помощь"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAll}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сброс</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExport(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Экспорт</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-900/50 border-r border-gray-800 overflow-hidden shrink-0"
            >
              <ToolPanel
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
                onRemoveBad={removeBadScenes}
                onNormalizeFormat={normalizeFormat}
                onRemoveLogos={removeLogos}
                onAddSubtitles={addSubtitles}
                onAddSoundEffects={addSoundEffects}
                appliedEffects={appliedEffects}
                stats={{
                  total: scenes.length,
                  bad: scenes.filter(s => s.status === 'bad').length,
                  withLogos: scenesWithLogos.length,
                  differentFormat: scenesWithDifferentFormat.length,
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center - Preview & Timeline */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <PreviewPanel
              scenes={goodScenes}
              currentTime={currentTime}
              totalDuration={totalDuration}
              showSubtitles={appliedEffects.includes('subtitles-added')}
            />

            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-12 rounded-r-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {/* Quick action hints */}
            {appliedEffects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20"
              >
                <span className="text-xs text-violet-300">← Выберите инструмент и нажмите «Применить»</span>
              </motion.div>
            )}
          </div>

          {/* Transport Controls */}
          <div className="h-12 bg-gray-900/50 border-t border-gray-800 flex items-center justify-center gap-4 px-4">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center hover:from-violet-500 hover:to-fuchsia-500 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </motion.button>
            <button
              onClick={() => setCurrentTime(totalDuration)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 font-mono ml-4">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          {/* Timeline */}
          <div className="h-40 bg-gray-900/30 border-t border-gray-800">
            <Timeline
              scenes={scenes}
              currentTime={currentTime}
              totalDuration={totalDuration}
              onSeek={setCurrentTime}
              appliedEffects={appliedEffects}
            />
          </div>
        </main>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <ExportModal
            onClose={() => setShowExport(false)}
            scenes={goodScenes}
            appliedEffects={appliedEffects}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default App;
