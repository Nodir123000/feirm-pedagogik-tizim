import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Play, Pause, RotateCcw, Trophy, Clock, Target, AlertTriangle, CheckCircle2, Zap, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';
import { createSimulationResult } from '@/entities/SimulationResult';

// Embedded interactive simulation scenarios (no external iframe needed)
const SIMULATION_ENGINES = {
    'drilling': {
        type: 'drilling',
        title_ru: 'Управление процессом бурения',
        color: '#7c3aed',
        steps: [
            { id: 1, label_ru: 'Установите давление бурового раствора', label_uz: 'Burg\'ulash eritmasi bosimini sozlang', min: 50, max: 200, unit: 'bar', target: [120, 160], param: 'pressure' },
            { id: 2, label_ru: 'Настройте скорость вращения долота', label_uz: 'Qoʻngʻiroq aylanish tezligini sozlang', min: 50, max: 300, unit: 'об/мин', target: [150, 220], param: 'rpm' },
            { id: 3, label_ru: 'Отрегулируйте нагрузку на долото', label_uz: 'Qoʻngʻiroqqa yuklamani sozlang', min: 5, max: 50, unit: 'тн', target: [20, 35], param: 'wob' },
            { id: 4, label_ru: 'Контролируйте расход промывочной жидкости', label_uz: 'Yuvish suyuqligi sarfini nazorat qiling', min: 10, max: 50, unit: 'л/с', target: [25, 40], param: 'flow' },
        ]
    },
    'emergency': {
        type: 'emergency',
        title_ru: 'Аварийная остановка бурения',
        color: '#dc2626',
        steps: [
            { id: 1, label_ru: 'Активируйте систему аварийного отключения (ESD)', label_uz: 'Favqulodda o\'chirish tizimini faollashtiring (ESD)', type: 'button', action: 'ESD_ON' },
            { id: 2, label_ru: 'Закройте превентор (BOP)', label_uz: 'Preventorni yoping (BOP)', type: 'button', action: 'BOP_CLOSE' },
            { id: 3, label_ru: 'Остановите циркуляцию бурового раствора', label_uz: 'Burg\'ulash eritmasining aylanishini to\'xtating', type: 'button', action: 'PUMP_OFF' },
            { id: 4, label_ru: 'Подтвердите безопасное состояние скважины', label_uz: 'Quduqning xavfsiz holatini tasdiqlang', type: 'button', action: 'CONFIRM_SAFE' },
        ]
    },
    'gas': {
        type: 'gas',
        title_ru: 'Настройка газового сепаратора',
        color: '#0891b2',
        steps: [
            { id: 1, label_ru: 'Установите рабочее давление сепаратора', label_uz: 'Separator ish bosimini sozlang', min: 1, max: 20, unit: 'МПа', target: [5, 10], param: 'sep_pressure' },
            { id: 2, label_ru: 'Настройте температуру входящего потока', label_uz: 'Kiruvchi oqim haroratini sozlang', min: 10, max: 80, unit: '°C', target: [35, 55], param: 'temperature' },
            { id: 3, label_ru: 'Отрегулируйте клапан отвода газа', label_uz: 'Gaz chiqarish klapanini sozlang', min: 0, max: 100, unit: '%', target: [60, 80], param: 'gas_valve' },
            { id: 4, label_ru: 'Стабилизируйте уровень жидкости', label_uz: 'Suyuqlik darajasini barqarorlashtiring', min: 20, max: 80, unit: '%', target: [45, 65], param: 'liquid_level' },
        ]
    },
    'logistics': {
        type: 'logistics',
        title_ru: 'Логистика нефтепровода',
        color: '#d97706',
        steps: [
            { id: 1, label_ru: 'Определите объём прокачки нефти', label_uz: 'Neft nasosi hajmini belgilang', min: 100, max: 1000, unit: 'т/ч', target: [600, 850], param: 'throughput' },
            { id: 2, label_ru: 'Настройте давление в головной насосной станции', label_uz: 'Bosh nasos stantsiyasida bosimni sozlang', min: 20, max: 80, unit: 'атм', target: [45, 65], param: 'pump_pressure' },
            { id: 3, label_ru: 'Распределите нагрузку по промежуточным станциям', label_uz: 'Yukni oraliq stansiyalarga taqsimlang', min: 30, max: 100, unit: '%', target: [60, 80], param: 'load_dist' },
            { id: 4, label_ru: 'Оптимизируйте расписание танкерных поставок', label_uz: 'Tanker yetkazib berish jadvalini optimallashtiring', min: 1, max: 10, unit: 'рейсов/нед', target: [4, 7], param: 'tanker_freq' },
        ]
    }
};

function getEngineKey(scenario) {
    const title = (scenario?.title_ru || scenario?.title_uz_lat || '').toLowerCase();
    if (title.includes('аварийная') || title.includes('favqulodda')) return 'emergency';
    if (title.includes('газового') || title.includes('gaz separator')) return 'gas';
    if (title.includes('логистика') || title.includes('quvuri')) return 'logistics';
    return 'drilling';
}

function DrillSlider({ step, value, onChange, language }) {
    const isInTarget = value >= step.target[0] && value <= step.target[1];
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                    {language === 'ru' ? step.label_ru : step.label_uz}
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${isInTarget ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {value} {step.unit}
                </span>
            </div>
            <input
                type="range"
                min={step.min}
                max={step.max}
                value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, ${isInTarget ? '#10b981' : '#ef4444'} ${((value - step.min) / (step.max - step.min)) * 100}%, #e5e7eb ${((value - step.min) / (step.max - step.min)) * 100}%)`
                }}
            />
            <div className="flex justify-between text-xs text-gray-400">
                <span>{step.min} {step.unit}</span>
                <span className="text-green-600">✓ {step.target[0]}–{step.target[1]} {step.unit}</span>
                <span>{step.max} {step.unit}</span>
            </div>
        </div>
    );
}

export default function AnyLogicViewer({ scenario, onClose, studentId }) {
    const { language } = useLanguage();
    const engineKey = getEngineKey(scenario);
    const engine = SIMULATION_ENGINES[engineKey];
    const [phase, setPhase] = useState('intro'); // intro | running | complete
    const [currentStep, setCurrentStep] = useState(0);
    const [values, setValues] = useState(() => {
        const init = {};
        engine.steps.forEach(s => {
            if (s.min !== undefined) init[s.param] = Math.floor((s.min + s.max) / 2);
        });
        return init;
    });
    const [completedActions, setCompletedActions] = useState([]);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (phase === 'running') {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const checkAllCorrect = () => {
        return engine.steps.every(step => {
            if (step.type === 'button') return completedActions.includes(step.action);
            const v = values[step.param];
            return v >= step.target[0] && v <= step.target[1];
        });
    };

    const calculateScore = () => {
        let correct = 0;
        engine.steps.forEach(step => {
            if (step.type === 'button') {
                if (completedActions.includes(step.action)) correct++;
            } else {
                const v = values[step.param];
                if (v >= step.target[0] && v <= step.target[1]) correct++;
            }
        });
        const raw = (correct / engine.steps.length) * 100;
        // Time bonus: faster = higher (cap 10%)
        const timeBonus = Math.max(0, 10 - Math.floor(elapsed / 30));
        return Math.min(100, Math.round(raw + timeBonus));
    };

    const handleComplete = async () => {
        clearInterval(timerRef.current);
        const finalScore = calculateScore();
        setScore(finalScore);
        setPhase('complete');

        // Save to Supabase
        try {
            await createSimulationResult({
                student_id: studentId || null,
                scenario_id: scenario.id,
                score: finalScore,
                success_criteria_met: finalScore >= 70,
                completion_time_minutes: Math.ceil(elapsed / 60),
                attempt_number: 1,
                ai_feedback: {
                    score: finalScore,
                    elapsed_seconds: elapsed,
                    parameters: values,
                    actions: completedActions
                }
            });
        } catch (e) {
            console.warn('Failed to save result:', e);
        }
    };

    const handleReset = () => {
        setPhase('intro');
        setCurrentStep(0);
        setElapsed(0);
        setScore(null);
        setCompletedActions([]);
        const init = {};
        engine.steps.forEach(s => {
            if (s.min !== undefined) init[s.param] = Math.floor((s.min + s.max) / 2);
        });
        setValues(init);
    };

    const step = engine.steps[currentStep];
    const allDone = checkAllCorrect();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${engine.color}15, white)` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: engine.color }}>
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AnyLogic Simulation</div>
                            <h2 className="text-base font-bold text-gray-900 leading-tight">
                                {language === 'ru' ? scenario?.title_ru : scenario?.title_uz_lat}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {phase === 'running' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm font-mono font-bold text-gray-700">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(elapsed)}
                            </div>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* INTRO PHASE */}
                {phase === 'intro' && (
                    <div className="p-6 flex flex-col gap-5">
                        <img
                            src={scenario?.preview_image_url || 'https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&q=80&w=800'}
                            alt="scenario"
                            className="w-full h-48 object-cover rounded-xl"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {language === 'ru' ? 'О симуляции' : 'Simulyatsiya haqida'}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {language === 'ru' ? scenario?.description_ru : scenario?.description_uz_lat}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                <div className="text-sm font-bold text-gray-900">{scenario?.simulation_duration_minutes || 45} {language === 'ru' ? 'мин' : 'daq'}</div>
                                <div className="text-xs text-gray-500">{language === 'ru' ? 'Длительность' : 'Davomiylik'}</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <Target className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                <div className="text-sm font-bold text-gray-900">{engine.steps.length}</div>
                                <div className="text-xs text-gray-500">{language === 'ru' ? 'Задания' : 'Vazifalar'}</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <Trophy className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                <div className="text-sm font-bold text-gray-900">70%</div>
                                <div className="text-xs text-gray-500">{language === 'ru' ? 'Порог успеха' : 'Muvaffaqiyat'}</div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                {language === 'ru'
                                    ? 'Ваши результаты будут автоматически сохранены в системе и учтены в вашем портфолио.'
                                    : 'Natijalaringiz tizimda avtomatik saqlanadi va portfoliongizga kiritiladi.'}
                            </p>
                        </div>

                        <button
                            onClick={() => setPhase('running')}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-95"
                            style={{ background: `linear-gradient(135deg, ${engine.color}, ${engine.color}cc)` }}
                        >
                            <Play className="w-5 h-5" />
                            {language === 'ru' ? 'Запустить симуляцию' : 'Simulyatsiyani boshlash'}
                        </button>
                    </div>
                )}

                {/* RUNNING PHASE */}
                {phase === 'running' && (
                    <div className="p-6 flex flex-col gap-5">
                        {/* Progress bar */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>{language === 'ru' ? `Шаг ${currentStep + 1} из ${engine.steps.length}` : `${currentStep + 1}/${engine.steps.length} qadam`}</span>
                                <span>{Math.round(((currentStep) / engine.steps.length) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentStep) / engine.steps.length) * 100}%`, background: engine.color }}
                                />
                            </div>
                        </div>

                        {/* Step indicators */}
                        <div className="flex gap-2">
                            {engine.steps.map((s, i) => {
                                let done = false;
                                if (s.type === 'button') done = completedActions.includes(s.action);
                                else done = values[s.param] >= s.target[0] && values[s.param] <= s.target[1];
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setCurrentStep(i)}
                                        className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all ${
                                            i === currentStep
                                                ? 'text-white border-transparent shadow'
                                                : done
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}
                                        style={i === currentStep ? { background: engine.color, borderColor: engine.color } : {}}
                                    >
                                        {done ? '✓' : i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Current Step */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                            {step?.type === 'button' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="font-bold text-gray-900 text-sm">
                                            {language === 'ru' ? step.label_ru : step.label_uz}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!completedActions.includes(step.action)) {
                                                setCompletedActions(prev => [...prev, step.action]);
                                            }
                                        }}
                                        disabled={completedActions.includes(step.action)}
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                                            completedActions.includes(step.action)
                                                ? 'bg-green-100 text-green-700 border border-green-300'
                                                : 'text-white shadow-lg hover:opacity-90 active:scale-95'
                                        }`}
                                        style={!completedActions.includes(step.action) ? { background: engine.color } : {}}
                                    >
                                        {completedActions.includes(step.action)
                                            ? `✓ ${language === 'ru' ? 'Выполнено' : 'Bajarildi'}`
                                            : language === 'ru' ? 'Выполнить действие' : 'Amalni bajarish'}
                                    </button>
                                </div>
                            ) : (
                                <DrillSlider
                                    step={step}
                                    value={values[step?.param] || 0}
                                    onChange={v => setValues(prev => ({ ...prev, [step.param]: v }))}
                                    language={language}
                                />
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                ← {language === 'ru' ? 'Назад' : 'Orqaga'}
                            </button>
                            {currentStep < engine.steps.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold shadow hover:opacity-90 transition-all"
                                    style={{ background: engine.color }}
                                >
                                    {language === 'ru' ? 'Далее' : 'Keyingisi'} →
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold shadow transition-all flex items-center justify-center gap-2 ${
                                        allDone ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    style={allDone ? { background: '#10b981' } : {}}
                                    disabled={!allDone}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {language === 'ru' ? 'Завершить' : 'Yakunlash'}
                                </button>
                            )}
                        </div>

                        {!allDone && currentStep === engine.steps.length - 1 && (
                            <p className="text-xs text-amber-600 text-center">
                                {language === 'ru'
                                    ? '⚠️ Выполните все задания правильно перед завершением'
                                    : '⚠️ Yakunlashdan oldin barcha vazifalarni to\'g\'ri bajaring'}
                            </p>
                        )}
                    </div>
                )}

                {/* COMPLETE PHASE */}
                {phase === 'complete' && (
                    <div className="p-6 flex flex-col items-center gap-5 text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl ${score >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-orange-400 to-red-500'}`}>
                            {score}%
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">
                                {score >= 90
                                    ? (language === 'ru' ? '🏆 Отлично!' : '🏆 Ajoyib!')
                                    : score >= 70
                                        ? (language === 'ru' ? '✅ Зачёт!' : '✅ O\'tdi!')
                                        : (language === 'ru' ? '❌ Не зачёт' : '❌ O\'tmadi')}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {language === 'ru'
                                    ? `Время: ${formatTime(elapsed)} • Баллов: ${score}/100`
                                    : `Vaqt: ${formatTime(elapsed)} • Ball: ${score}/100`}
                            </p>
                        </div>

                        {/* Step results */}
                        <div className="w-full space-y-2">
                            {engine.steps.map(s => {
                                let ok = false;
                                if (s.type === 'button') ok = completedActions.includes(s.action);
                                else ok = values[s.param] >= s.target[0] && values[s.param] <= s.target[1];
                                return (
                                    <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${ok ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                        {ok ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> : <X className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                        <span className={ok ? 'text-green-800' : 'text-red-700'}>
                                            {language === 'ru' ? s.label_ru : s.label_uz}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 w-full text-left">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                                {language === 'ru' ? 'AI Анализ' : 'AI Tahlil'}
                            </p>
                            <p className="text-xs text-blue-600">
                                {score >= 90
                                    ? (language === 'ru' ? 'Превосходное управление параметрами. Рекомендуем переходить к более сложным симуляциям.' : 'A\'lo parametrlarni boshqarish. Murakkabroq simulyatsiyalarga o\'tish tavsiya etiladi.')
                                    : score >= 70
                                        ? (language === 'ru' ? 'Хороший результат. Обратите внимание на параметры, которые не попали в целевой диапазон.' : 'Yaxshi natija. Maqsadli diapazondan chiqib ketgan parametrlarga e\'tibor bering.')
                                        : (language === 'ru' ? 'Необходимо повторное прохождение. Изучите теоретическую часть модуля перед следующей попыткой.' : 'Qayta o\'tish kerak. Keyingi urinishdan oldin modulning nazariy qismini o\'rganing.')}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                {language === 'ru' ? 'Повторить' : 'Qaytadan'}
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold shadow-lg hover:opacity-90 transition-all text-sm"
                                style={{ background: engine.color }}
                            >
                                {language === 'ru' ? 'Завершить' : 'Yakunlash'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
