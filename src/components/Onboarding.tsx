import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors, Film, Sparkles, Download, Play, ChevronRight
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: <Film className="w-8 h-8" />,
    title: 'Добро пожаловать в Video Editor Pro!',
    description: 'Это ваш автоматический видеоредактор. Он поможет быстро обработать видео: убрать неудачные кадры, выровнять форматы, добавить субтитры и звуки.',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    title: 'Шаг 1: Выберите инструмент',
    description: 'В панели слева выберите нужный инструмент: удаление кадров, нормализация формата, субтитры, звуки или удаление логотипов.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Шаг 2: Нажмите «Применить»',
    description: 'После выбора инструмента нажмите кнопку "Применить" — эффект будет применён ко всему видео. Вы увидите изменения на таймлайне и в превью.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Play className="w-8 h-8" />,
    title: 'Шаг 3: Просмотрите результат',
    description: 'Используйте кнопки воспроизведения для просмотра. Таймлайн покажет, какие сцены были удалены или изменены.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: 'Шаг 4: Экспортируйте!',
    description: 'Когда всё готово — нажмите "Экспорт" в правом верхнем углу. Выберите качество и формат, и скачайте готовое видео.',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="w-full max-w-md bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-violet-500' : i < currentStep ? 'w-4 bg-violet-500/50' : 'w-4 bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <motion.div
            key={`icon-${currentStep}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}
          >
            {step.icon}
          </motion.div>

          <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <button
            onClick={onComplete}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Пропустить
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isLast) {
                onComplete();
              } else {
                setCurrentStep(prev => prev + 1);
              }
            }}
            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${step.color} text-white text-sm font-medium flex items-center gap-2 shadow-lg`}
          >
            {isLast ? 'Начать работу' : 'Далее'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
