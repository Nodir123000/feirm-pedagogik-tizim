import { useState, useEffect, useRef } from 'react';
import {
    X, ExternalLink, Play, RotateCcw, Trophy, Clock, Target,
    AlertTriangle, CheckCircle2, Zap, ChevronRight, Info,
    User, ChevronDown, TrendingUp, Shield, Brain, Award
} from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';
import { createSimulationResult } from '@/entities/SimulationResult';
import { fetchStudents, updateStudentCompetencyAfterSim } from '@/entities/Student';

// ─────────────────────────────────────────────
// SIMULATION ENGINES — параметры для каждого типа
// ─────────────────────────────────────────────
const buildSteps = (level) => {
    // level: 'beginner' | 'intermediate' | 'expert'
    const DRILLING = {
        beginner: [
            { id: 1, label_ru: 'Установите давление бурового раствора', label_uz: "Burg'ulash eritmasi bosimini sozlang", min: 50, max: 200, unit: 'bar', target: [110, 170], param: 'pressure' },
            { id: 2, label_ru: 'Настройте скорость вращения долота', label_uz: "Burg'ulash tezligini sozlang", min: 50, max: 300, unit: 'об/мин', target: [130, 240], param: 'rpm' },
            { id: 3, label_ru: 'Отрегулируйте нагрузку на долото', label_uz: "Qo'ng'iroqqa yuklamani sozlang", min: 5, max: 50, unit: 'тн', target: [15, 40], param: 'wob' },
        ],
        intermediate: [
            { id: 1, label_ru: 'Установите давление бурового раствора', label_uz: "Burg'ulash eritmasi bosimini sozlang", min: 50, max: 200, unit: 'bar', target: [120, 160], param: 'pressure' },
            { id: 2, label_ru: 'Настройте скорость вращения долота', label_uz: "Burg'ulash tezligini sozlang", min: 50, max: 300, unit: 'об/мин', target: [150, 220], param: 'rpm' },
            { id: 3, label_ru: 'Отрегулируйте нагрузку на долото', label_uz: "Qo'ng'iroqqa yuklamani sozlang", min: 5, max: 50, unit: 'тн', target: [20, 35], param: 'wob' },
            { id: 4, label_ru: 'Контролируйте расход промывочной жидкости', label_uz: "Yuvish suyuqligi sarfini nazorat qiling", min: 10, max: 50, unit: 'л/с', target: [25, 40], param: 'flow' },
        ],
        expert: [
            { id: 1, label_ru: 'Установите давление бурового раствора (±5 bar)', label_uz: "Bosimni sozlang (±5 bar aniqlik)", min: 50, max: 200, unit: 'bar', target: [130, 150], param: 'pressure' },
            { id: 2, label_ru: 'Настройте RPM с точностью ±10', label_uz: "RPM ni ±10 aniqlikda sozlang", min: 50, max: 300, unit: 'об/мин', target: [170, 200], param: 'rpm' },
            { id: 3, label_ru: 'Нагрузка на долото (узкий диапазон)', label_uz: "Tor diapazon yuklamasi", min: 5, max: 50, unit: 'тн', target: [24, 30], param: 'wob' },
            { id: 4, label_ru: 'Расход жидкости (точный контроль)', label_uz: "Aniq suyuqlik sarfi", min: 10, max: 50, unit: 'л/с', target: [28, 35], param: 'flow' },
            { id: 5, label_ru: 'Угол наклона ствола скважины', label_uz: "Quduq o'qi burchagi", min: 0, max: 90, unit: '°', target: [30, 45], param: 'angle' },
        ]
    };
    const EMERGENCY = {
        beginner: [
            { id: 1, label_ru: 'Остановите насос', label_uz: "Nasosni to'xtating", type: 'button', action: 'PUMP_OFF' },
            { id: 2, label_ru: 'Закройте превентор (BOP)', label_uz: "Preventorni yoping (BOP)", type: 'button', action: 'BOP_CLOSE' },
            { id: 3, label_ru: 'Сообщите диспетчеру', label_uz: "Dispetcherga xabar bering", type: 'button', action: 'NOTIFY' },
        ],
        intermediate: [
            { id: 1, label_ru: 'Активируйте систему ESD', label_uz: "ESD tizimini faollashtiring", type: 'button', action: 'ESD_ON' },
            { id: 2, label_ru: 'Закройте превентор (BOP)', label_uz: "Preventorni yoping (BOP)", type: 'button', action: 'BOP_CLOSE' },
            { id: 3, label_ru: 'Остановите циркуляцию раствора', label_uz: "Eritma aylanishini to'xtating", type: 'button', action: 'PUMP_OFF' },
            { id: 4, label_ru: 'Подтвердите безопасное состояние', label_uz: "Xavfsiz holatni tasdiqlang", type: 'button', action: 'CONFIRM_SAFE' },
        ],
        expert: [
            { id: 1, label_ru: 'ESD активация (<5 сек)', label_uz: "ESD (<5 soniya)", type: 'button', action: 'ESD_ON' },
            { id: 2, label_ru: 'BOP закрытие', label_uz: "BOP yopish", type: 'button', action: 'BOP_CLOSE' },
            { id: 3, label_ru: 'Стравить давление через штуцер', label_uz: "Shtutser orqali bosimni kamaytiring", type: 'button', action: 'CHOKE_OPEN' },
            { id: 4, label_ru: 'Активировать аварийный сигнал', label_uz: "Favqulodda signalni yoqing", type: 'button', action: 'ALARM' },
            { id: 5, label_ru: 'Протокол связи с береговой базой', label_uz: "Qirg'oq bazasi bilan aloqa", type: 'button', action: 'COMM' },
        ]
    };
    const GAS = {
        beginner: [
            { id: 1, label_ru: 'Давление сепаратора', label_uz: "Separator bosimi", min: 1, max: 20, unit: 'МПа', target: [4, 12], param: 'sep_pressure' },
            { id: 2, label_ru: 'Уровень жидкости', label_uz: "Suyuqlik darajasi", min: 20, max: 80, unit: '%', target: [35, 70], param: 'liquid_level' },
        ],
        intermediate: [
            { id: 1, label_ru: 'Давление сепаратора', label_uz: "Separator bosimi", min: 1, max: 20, unit: 'МПа', target: [5, 10], param: 'sep_pressure' },
            { id: 2, label_ru: 'Температура входного потока', label_uz: "Kiruvchi oqim harorati", min: 10, max: 80, unit: '°C', target: [35, 55], param: 'temperature' },
            { id: 3, label_ru: 'Клапан отвода газа', label_uz: "Gaz chiqarish klapani", min: 0, max: 100, unit: '%', target: [60, 80], param: 'gas_valve' },
            { id: 4, label_ru: 'Уровень жидкости', label_uz: "Suyuqlik darajasi", min: 20, max: 80, unit: '%', target: [45, 65], param: 'liquid_level' },
        ],
        expert: [
            { id: 1, label_ru: 'Давление (точный диапазон)', label_uz: "Aniq bosim", min: 1, max: 20, unit: 'МПа', target: [6, 8], param: 'sep_pressure' },
            { id: 2, label_ru: 'Температура (±3°C)', label_uz: "Harorat (±3°C)", min: 10, max: 80, unit: '°C', target: [42, 48], param: 'temperature' },
            { id: 3, label_ru: 'Клапан газа (точная настройка)', label_uz: "Gaz klapani aniq sozlash", min: 0, max: 100, unit: '%', target: [68, 75], param: 'gas_valve' },
            { id: 4, label_ru: 'Уровень жидкости (±3%)', label_uz: "Suyuqlik ±3%", min: 20, max: 80, unit: '%', target: [50, 56], param: 'liquid_level' },
            { id: 5, label_ru: 'Расход газа на выходе', label_uz: "Chiqish gaz sarfi", min: 10, max: 100, unit: 'тыс.м³/д', target: [55, 75], param: 'gas_flow' },
        ]
    };
    const LOGISTICS = {
        beginner: [
            { id: 1, label_ru: 'Объём прокачки нефти', label_uz: "Neft nasosi hajmi", min: 100, max: 1000, unit: 'т/ч', target: [400, 900], param: 'throughput' },
            { id: 2, label_ru: 'Давление в насосной станции', label_uz: "Nasos stantsiyasi bosimi", min: 20, max: 80, unit: 'атм', target: [35, 70], param: 'pump_pressure' },
        ],
        intermediate: [
            { id: 1, label_ru: 'Объём прокачки нефти', label_uz: "Neft nasosi hajmi", min: 100, max: 1000, unit: 'т/ч', target: [600, 850], param: 'throughput' },
            { id: 2, label_ru: 'Давление в головной насосной станции', label_uz: "Bosh nasos stantsiyasi bosimi", min: 20, max: 80, unit: 'атм', target: [45, 65], param: 'pump_pressure' },
            { id: 3, label_ru: 'Нагрузка промежуточных станций', label_uz: "Oraliq stantsiyalar yuki", min: 30, max: 100, unit: '%', target: [60, 80], param: 'load_dist' },
            { id: 4, label_ru: 'Частота танкерных рейсов', label_uz: "Tanker reyslari chastotasi", min: 1, max: 10, unit: 'рейс/нед', target: [4, 7], param: 'tanker_freq' },
        ],
        expert: [
            { id: 1, label_ru: 'Объём прокачки (точный)', label_uz: "Aniq nasos hajmi", min: 100, max: 1000, unit: 'т/ч', target: [700, 780], param: 'throughput' },
            { id: 2, label_ru: 'Давление (±3 атм)', label_uz: "Bosim (±3 atm)", min: 20, max: 80, unit: 'атм', target: [52, 58], param: 'pump_pressure' },
            { id: 3, label_ru: 'Нагрузка станций (баланс)', label_uz: "Stantsiya yuki (balans)", min: 30, max: 100, unit: '%', target: [68, 75], param: 'load_dist' },
            { id: 4, label_ru: 'Оптимальная частота рейсов', label_uz: "Optimal reys chastotasi", min: 1, max: 10, unit: 'рейс/нед', target: [5, 6], param: 'tanker_freq' },
            { id: 5, label_ru: 'Резервный объём хранения', label_uz: "Zahira saqlash hajmi", min: 10, max: 100, unit: 'тыс.т', target: [40, 60], param: 'storage_reserve' },
        ]
    };

    return { DRILLING, EMERGENCY, GAS, LOGISTICS };
};

function getEngineKey(scenario) {
    const title = (scenario?.title_ru || scenario?.title_uz_lat || '').toLowerCase();
    if (title.includes('аварийная') || title.includes('favqulodda')) return 'EMERGENCY';
    if (title.includes('газового') || title.includes('gaz separator')) return 'GAS';
    if (title.includes('логистика') || title.includes('quvuri')) return 'LOGISTICS';
    return 'DRILLING';
}

function getStudentLevel(student) {
    if (!student) return 'intermediate';
    const avg = (student.professional_competency + student.meta_competency) / 2;
    if (avg >= 80) return 'expert';
    if (avg >= 55) return 'intermediate';
    return 'beginner';
}

const ENGINE_COLORS = {
    DRILLING: '#7c3aed',
    EMERGENCY: '#dc2626',
    GAS: '#0891b2',
    LOGISTICS: '#d97706',
};

const LEVEL_LABELS = {
    beginner: { ru: '📘 Начинающий', uz: '📘 Boshlang\'ich' },
    intermediate: { ru: '📗 Средний', uz: '📗 O\'rta' },
    expert: { ru: '📕 Эксперт', uz: '📕 Ekspert' },
};

// ─────────────────────────────────────────────
// Slider sub-component
// ─────────────────────────────────────────────
function DrillSlider({ step, value, onChange, language }) {
    const isInTarget = value >= step.target[0] && value <= step.target[1];
    const pct = ((value - step.min) / (step.max - step.min)) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{language === 'ru' ? step.label_ru : step.label_uz}</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-md transition-all ${isInTarget ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {value} {step.unit}
                </span>
            </div>
            <input
                type="range" min={step.min} max={step.max} value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${isInTarget ? '#10b981' : '#ef4444'} ${pct}%, #e5e7eb ${pct}%)` }}
            />
            <div className="flex justify-between text-xs text-gray-400">
                <span>{step.min} {step.unit}</span>
                <span className="text-green-600 font-medium">✓ {step.target[0]}–{step.target[1]} {step.unit}</span>
                <span>{step.max} {step.unit}</span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main AnyLogicViewer Component
// ─────────────────────────────────────────────
export default function AnyLogicViewer({ scenario, onClose }) {
    const { language } = useLanguage();
    const engineKey = getEngineKey(scenario);
    const color = ENGINE_COLORS[engineKey];

    // ── Student selection ──
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentsLoading, setStudentsLoading] = useState(true);

    // ── Simulation state ──
    const [phase, setPhase] = useState('intro'); // intro | running | complete
    const [level, setLevel] = useState('intermediate');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [values, setValues] = useState({});
    const [completedActions, setCompletedActions] = useState([]);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState(null);
    const [competencyDelta, setCompetencyDelta] = useState(null);
    const timerRef = useRef(null);

    // Load students
    useEffect(() => {
        fetchStudents().then(data => {
            setStudents(data || []);
            setStudentsLoading(false);
        }).catch(() => setStudentsLoading(false));
    }, []);

    // Update level + steps when student changes
    useEffect(() => {
        const lvl = getStudentLevel(selectedStudent);
        setLevel(lvl);
        const { DRILLING, EMERGENCY, GAS, LOGISTICS } = buildSteps(lvl);
        const engineSteps = { DRILLING, EMERGENCY, GAS, LOGISTICS }[engineKey][lvl];
        setSteps(engineSteps);
        const init = {};
        engineSteps.forEach(s => { if (s.min !== undefined) init[s.param] = Math.floor((s.min + s.max) / 2); });
        setValues(init);
        setCurrentStep(0);
        setCompletedActions([]);
    }, [selectedStudent, engineKey]);

    // Timer
    useEffect(() => {
        if (phase === 'running') {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const checkStepDone = (step) => {
        if (step.type === 'button') return completedActions.includes(step.action);
        const v = values[step.param];
        return v >= step.target[0] && v <= step.target[1];
    };

    const allDone = steps.every(s => checkStepDone(s));

    const calculateScore = () => {
        const correct = steps.filter(s => checkStepDone(s)).length;
        const raw = (correct / steps.length) * 100;
        const timeBonus = Math.max(0, 10 - Math.floor(elapsed / 30));
        // Expert level gives less bonus but same score (harder targets)
        return Math.min(100, Math.round(raw + (level === 'expert' ? timeBonus * 1.5 : timeBonus)));
    };

    const handleComplete = async () => {
        clearInterval(timerRef.current);
        const finalScore = calculateScore();
        setScore(finalScore);
        setPhase('complete');

        // Calculate competency delta for display
        const growth = Math.max(0, Math.floor((finalScore - 60) / 8));
        setCompetencyDelta(growth);

        // Save result
        try {
            await createSimulationResult({
                student_id: selectedStudent?.id || null,
                scenario_id: scenario.id,
                score: finalScore,
                success_criteria_met: finalScore >= 70,
                completion_time_minutes: Math.ceil(elapsed / 60),
                attempt_number: 1,
                ai_feedback: { score: finalScore, level, elapsed, parameters: values, actions: completedActions }
            });
        } catch (e) { console.warn('Save result failed:', e); }

        // Update student competencies via RPC
        if (selectedStudent?.id && finalScore >= 50) {
            try {
                await updateStudentCompetencyAfterSim(selectedStudent.id, finalScore, scenario.scenario_type || 'Industrial');
            } catch (e) { console.warn('Competency update failed:', e); }
        }
    };

    const handleReset = () => {
        setPhase('intro');
        setCurrentStep(0);
        setElapsed(0);
        setScore(null);
        setCompetencyDelta(null);
        setCompletedActions([]);
        const { DRILLING, EMERGENCY, GAS, LOGISTICS } = buildSteps(level);
        const engineSteps = { DRILLING, EMERGENCY, GAS, LOGISTICS }[engineKey][level];
        setSteps(engineSteps);
        const init = {};
        engineSteps.forEach(s => { if (s.min !== undefined) init[s.param] = Math.floor((s.min + s.max) / 2); });
        setValues(init);
    };

    const step = steps[currentStep];
    const scenarioTitle = language === 'ru' ? scenario?.title_ru : scenario?.title_uz_lat;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col">

                {/* ── Header ── */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10"
                    style={{ background: `linear-gradient(135deg, ${color}12, white 60%)` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: color }}>
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AnyLogic Simulation</div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight max-w-[300px] truncate">{scenarioTitle}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {phase === 'running' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm font-mono font-bold text-gray-700">
                                <Clock className="w-3.5 h-3.5" />{formatTime(elapsed)}
                            </div>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ── INTRO PHASE ── */}
                {phase === 'intro' && (
                    <div className="p-6 flex flex-col gap-5">
                        {/* Preview image */}
                        <div className="relative rounded-xl overflow-hidden h-44">
                            <img
                                src={scenario?.preview_image_url || 'https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&q=80&w=800'}
                                alt={scenarioTitle}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-black/40 backdrop-blur-sm">
                                    {scenario?.scenario_type || 'Industrial'}
                                </span>
                                <span className="px-2 py-1 rounded-md text-xs font-bold text-white bg-black/40 backdrop-blur-sm">
                                    {scenario?.simulation_duration_minutes || 45} {language === 'ru' ? 'мин' : 'daq'}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            {language === 'ru' ? scenario?.description_ru : scenario?.description_uz_lat}
                        </p>

                        {/* ── Student selector ── */}
                        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-700">
                                    {language === 'ru' ? 'Выберите студента' : 'Talaba tanlang'}
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    {language === 'ru' ? '(результат сохранится в профиле)' : '(natija profilga saqlanadi)'}
                                </span>
                            </div>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:border-transparent transition-all bg-white"
                                style={{ '--tw-ring-color': color }}
                                value={selectedStudent?.id || ''}
                                onChange={e => {
                                    const s = students.find(s => s.id === e.target.value);
                                    setSelectedStudent(s || null);
                                }}
                                disabled={studentsLoading}
                            >
                                <option value="">{studentsLoading ? (language === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...') : (language === 'ru' ? '— Анонимный режим —' : '— Anonim rejim —')}</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.full_name} · {s.student_group} · {s.specialization}</option>
                                ))}
                            </select>

                            {selectedStudent && (
                                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-4 gap-2">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-0.5">{language === 'ru' ? 'Проф.' : 'Prof.'}</div>
                                        <div className="text-sm font-bold text-gray-900">{selectedStudent.professional_competency}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-0.5">{language === 'ru' ? 'Мета' : 'Meta'}</div>
                                        <div className="text-sm font-bold text-gray-900">{selectedStudent.meta_competency}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-0.5">{language === 'ru' ? 'Прогресс' : 'Progress'}</div>
                                        <div className="text-sm font-bold text-gray-900">{selectedStudent.progress}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-0.5">{language === 'ru' ? 'Уровень' : 'Daraja'}</div>
                                        <div className="text-xs font-bold" style={{ color }}>
                                            {LEVEL_LABELS[getStudentLevel(selectedStudent)][language === 'ru' ? 'ru' : 'uz']}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Adaptive level badge */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: `${color}40`, background: `${color}08` }}>
                            <Brain className="w-5 h-5 flex-shrink-0" style={{ color }} />
                            <div>
                                <div className="text-xs font-bold text-gray-700">
                                    {language === 'ru' ? 'Адаптивный уровень сложности:' : 'Adaptiv qiyinchilik darajasi:'}{' '}
                                    <span style={{ color }}>{LEVEL_LABELS[level][language === 'ru' ? 'ru' : 'uz']}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    {steps.length} {language === 'ru' ? `заданий · порог зачёта 70%` : `vazifa · o'tish chegarasi 70%`}
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
                            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700">
                                {language === 'ru'
                                    ? 'Результат симуляции автоматически обновит компетенции студента и будет включён в его портфолио.'
                                    : 'Simulyatsiya natijasi talabaning kompetentsiyalarini avtomatik yangilaydi va portfoliosiga qo\'shiladi.'}
                            </p>
                        </div>

                        <button
                            onClick={() => setPhase('running')}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold shadow-lg hover:opacity-90 transition-all active:scale-95"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                        >
                            <Play className="w-5 h-5" />
                            {language === 'ru' ? 'Запустить симуляцию' : 'Simulyatsiyani boshlash'}
                        </button>

                        {/* Powered by AnyLogic */}
                        <div className="flex items-center justify-center gap-2 pt-1">
                            <span className="text-xs text-gray-400">{language === 'ru' ? 'Технология:' : 'Texnologiya:'}</span>
                            <a
                                href="https://www.anylogic.ru/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                AnyLogic Simulation Platform
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}

                {/* ── RUNNING PHASE ── */}
                {phase === 'running' && (
                    <div className="p-6 flex flex-col gap-5">
                        {/* Progress */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>
                                    {language === 'ru' ? `Шаг ${currentStep + 1} из ${steps.length}` : `${currentStep + 1}/${steps.length} qadam`}
                                    {selectedStudent && <span className="ml-2 font-medium" style={{ color }}>· {selectedStudent.full_name}</span>}
                                </span>
                                <span className="font-medium" style={{ color }}>{LEVEL_LABELS[level][language === 'ru' ? 'ru' : 'uz']}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(currentStep / steps.length) * 100}%`, background: color }}
                                />
                            </div>
                        </div>

                        {/* Step tabs */}
                        <div className="flex gap-2 flex-wrap">
                            {steps.map((s, i) => {
                                const done = checkStepDone(s);
                                return (
                                    <button key={s.id} onClick={() => setCurrentStep(i)}
                                        className={`flex-1 min-w-[40px] h-9 rounded-lg text-xs font-bold border transition-all ${
                                            i === currentStep ? 'text-white border-transparent shadow'
                                                : done ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-gray-50 text-gray-400 border-gray-200'
                                        }`}
                                        style={i === currentStep ? { background: color, borderColor: color } : {}}
                                    >
                                        {done ? '✓' : i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Current step */}
                        {step && (
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                {step.type === 'button' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            <span className="font-bold text-gray-900 text-sm">
                                                {language === 'ru' ? step.label_ru : step.label_uz}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => { if (!completedActions.includes(step.action)) setCompletedActions(p => [...p, step.action]); }}
                                            disabled={completedActions.includes(step.action)}
                                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                                                completedActions.includes(step.action)
                                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                                    : 'text-white shadow-lg hover:opacity-90 active:scale-95'
                                            }`}
                                            style={!completedActions.includes(step.action) ? { background: color } : {}}
                                        >
                                            {completedActions.includes(step.action)
                                                ? `✓ ${language === 'ru' ? 'Выполнено' : 'Bajarildi'}`
                                                : language === 'ru' ? 'Выполнить действие' : 'Amalni bajarish'}
                                        </button>
                                    </div>
                                ) : (
                                    <DrillSlider
                                        step={step}
                                        value={values[step.param] || 0}
                                        onChange={v => setValues(p => ({ ...p, [step.param]: v }))}
                                        language={language}
                                    />
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                ← {language === 'ru' ? 'Назад' : 'Orqaga'}
                            </button>
                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold shadow hover:opacity-90 transition-all"
                                    style={{ background: color }}
                                >
                                    {language === 'ru' ? 'Далее' : 'Keyingisi'} →
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    disabled={!allDone}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        allDone ? 'text-white hover:opacity-90 shadow' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    style={allDone ? { background: '#10b981' } : {}}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {language === 'ru' ? 'Завершить' : 'Yakunlash'}
                                </button>
                            )}
                        </div>

                        {!allDone && currentStep === steps.length - 1 && (
                            <p className="text-xs text-amber-600 text-center">
                                ⚠️ {language === 'ru' ? 'Выполните все задания правильно' : 'Barcha vazifalarni to\'g\'ri bajaring'}
                            </p>
                        )}
                    </div>
                )}

                {/* ── COMPLETE PHASE ── */}
                {phase === 'complete' && (
                    <div className="p-6 flex flex-col items-center gap-5 text-center">
                        {/* Score circle */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl"
                            style={{ background: score >= 70 ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#f97316,#dc2626)' }}
                        >
                            {score}%
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">
                                {score >= 90 ? '🏆 ' : score >= 70 ? '✅ ' : '❌ '}
                                {score >= 90
                                    ? (language === 'ru' ? 'Отлично!' : 'Ajoyib!')
                                    : score >= 70
                                        ? (language === 'ru' ? 'Зачёт!' : 'O\'tdi!')
                                        : (language === 'ru' ? 'Не зачёт' : 'O\'tmadi')}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {language === 'ru' ? `Время: ${formatTime(elapsed)} · Уровень: ` : `Vaqt: ${formatTime(elapsed)} · Daraja: `}
                                <span style={{ color }}>{LEVEL_LABELS[level][language === 'ru' ? 'ru' : 'uz']}</span>
                            </p>
                        </div>

                        {/* Competency update badge */}
                        {selectedStudent && competencyDelta !== null && competencyDelta > 0 && (
                            <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="text-sm font-bold text-green-800">
                                        {language === 'ru'
                                            ? `Профиль студента обновлён — ${selectedStudent.full_name}`
                                            : `Talaba profili yangilandi — ${selectedStudent.full_name}`}
                                    </div>
                                    <div className="text-xs text-green-600">
                                        {language === 'ru'
                                            ? `Компетенции выросли на +${competencyDelta} балл(ов)`
                                            : `Kompetentsiyalar +${competencyDelta} ball oshdi`}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step results */}
                        <div className="w-full space-y-2">
                            {steps.map(s => {
                                const ok = checkStepDone(s);
                                return (
                                    <div key={s.id} className={`flex items-center gap-3 p-2.5 rounded-lg text-sm ${ok ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                        {ok ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> : <X className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                        <span className={`text-left ${ok ? 'text-green-800' : 'text-red-700'}`}>
                                            {language === 'ru' ? s.label_ru : s.label_uz}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* AI Feedback */}
                        <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-3 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <Brain className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-blue-700">{language === 'ru' ? 'AI Анализ' : 'AI Tahlil'}</span>
                            </div>
                            <p className="text-xs text-blue-600">
                                {score >= 90
                                    ? (language === 'ru' ? 'Превосходное управление. Готов к реальным производственным задачам данного уровня.' : 'A\'lo boshqaruv. Ushbu darajadagi real ishlab chiqarish vazifalariga tayyor.')
                                    : score >= 70
                                        ? (language === 'ru' ? 'Хороший результат. Обратите внимание на параметры, не попавшие в целевой диапазон.' : 'Yaxshi natija. Maqsadli diapazondan chiqib ketgan parametrlarga e\'tibor bering.')
                                        : (language === 'ru' ? 'Необходимо повторить. Рекомендуем пройти теоретический модуль перед следующей попыткой.' : 'Qayta urinish kerak. Keyingi urinishdan oldin nazariy modulni o\'tishni tavsiya etamiz.')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full">
                            <button onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm">
                                <RotateCcw className="w-4 h-4" />
                                {language === 'ru' ? 'Повторить' : 'Qaytadan'}
                            </button>
                            <button onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold shadow-lg hover:opacity-90 transition-all text-sm"
                                style={{ background: color }}>
                                {language === 'ru' ? 'Завершить' : 'Yakunlash'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Powered by AnyLogic */}
                        <a href="https://www.anylogic.ru/oil-and-gas/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors group">
                            <Shield className="w-3 h-3 group-hover:text-blue-500" />
                            {language === 'ru' ? 'Симуляция на базе технологии' : 'Simulyatsiya texnologiyasi'}
                            <span className="font-semibold text-blue-500 group-hover:underline">AnyLogic</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
