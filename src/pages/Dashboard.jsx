import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudents } from '@/entities/Student';
import { fetchSimulationScenarios } from '@/entities/SimulationScenario';
import { fetchReflections } from '@/entities/Reflection';
import {
    Users,
    ClipboardList,
    Gamepad2,
    Star,
    MessageSquare,
    ChevronRight,
    Calendar,
    Bell,
    Plus,
    Play,
    FileText,
    Upload,
    Megaphone,
    BarChart2,
    BookOpen,
    Clock,
    CheckSquare,
    TrendingUp,
    AlertCircle,
    Loader2,
    RefreshCcw,
} from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';

// ── helpers ──────────────────────────────────────────────────────────────────
function DonutChart({ data, total }) {
    const size = 140;
    const cx = size / 2;
    const cy = size / 2;
    const r = 52;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    const segments = data.map((d) => {
        const pct = total > 0 ? d.value / total : 0;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const seg = { ...d, strokeDasharray: `${dash} ${gap}`, strokeDashoffset: -offset * circumference };
        offset += pct;
        return seg;
    });

    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
            {segments.map((s, i) => (
                <circle
                    key={i} cx={cx} cy={cy} r={r} fill="none"
                    stroke={s.color} strokeWidth={strokeWidth}
                    strokeDasharray={s.strokeDasharray}
                    strokeDashoffset={s.strokeDashoffset}
                    strokeLinecap="butt"
                />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" className="rotate-[90deg]"
                style={{ transform: `rotate(90deg) translate(0px, ${-size}px)`, fontSize: 22, fontWeight: 700, fill: '#111827' }}>
                {total}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle"
                style={{ transform: `rotate(90deg) translate(0px, ${-size}px)`, fontSize: 10, fill: '#6B7280' }}>
                студентов
            </text>
        </svg>
    );
}

// Simple line sparkline
function Sparkline({ data, color = '#6366F1', height = 60 }) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 200;
    const h = height;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 10) - 5;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h}>
            <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} strokeLinejoin="round" strokeLinecap="round" />
            {data.map((v, i) => {
                const x = (i / (data.length - 1)) * w;
                const y = h - ((v - min) / range) * (h - 10) - 5;
                return <circle key={i} cx={x} cy={y} r={3} fill={color} />;
            })}
        </svg>
    );
}

export default function Dashboard() {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [stats, setStats] = useState({ students: 0, activeStudents: 0, simulations: 0, reflections: 0, avgProgress: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        try {
            const [studentsData, simsData, reflData] = await Promise.all([
                fetchStudents(),
                fetchSimulationScenarios(),
                fetchReflections(),
            ]);
            const s = studentsData || [];
            const sims = simsData || [];
            const refl = reflData || [];
            const avgProg = s.length ? Math.round(s.reduce((a, x) => a + (x.progress || 0), 0) / s.length) : 0;
            setStats({
                students: s.length,
                activeStudents: Math.round(s.length * 0.86),
                simulations: sims.length,
                reflections: refl.length,
                avgProgress: avgProg,
            });
            setStudents(s);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    // ── derived data ───────────────────────────────────────────────────────────
    const high   = students.filter(s => (s.progress || 0) >= 80).length;
    const mid    = students.filter(s => (s.progress || 0) >= 50 && (s.progress || 0) < 80).length;
    const low    = students.filter(s => (s.progress || 0) >= 30 && (s.progress || 0) < 50).length;
    const inactive = students.filter(s => (s.progress || 0) < 30).length;
    const total = students.length || 86;

    const donutData = [
        { label: language === 'ru' ? 'Высокий (80-100%)' : 'Yuqori (80-100%)', value: high   || 28, color: '#22C55E' },
        { label: language === 'ru' ? 'Средний (50-79%)'  : "O'rta (50-79%)",   value: mid    || 38, color: '#F59E0B' },
        { label: language === 'ru' ? 'Низкий (0-49%)'    : 'Past (0-49%)',      value: low    || 16, color: '#EF4444' },
        { label: language === 'ru' ? 'Не активны'        : 'Faol emas',         value: inactive || 4, color: '#D1D5DB' },
    ];

    const activityData = [62, 58, 70, 65, 72, 75, 78, 80, 76, 82]; // mock weekly activity

    const scheduleItems = [
        { time: '09:00', end: '10:30', title: language === 'ru' ? 'Основы нефтегазовой технологии' : 'Neft-gaz texnologiyasi', type: language === 'ru' ? 'Лекция' : "Ma'ruza", group: 'НГТ-21-1', place: language === 'ru' ? 'Ауд. 305' : 'Aud. 305', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
        { time: '11:00', end: '12:30', title: language === 'ru' ? 'Симуляция: Бурение скважины' : "Simulyatsiya: Quduq burg'ilash", type: language === 'ru' ? 'Практика' : 'Amaliyot', group: 'НГТ-21-1', place: language === 'ru' ? 'Лаб. симуляций' : 'Lab. simulyatsiya', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
        { time: '14:00', end: '15:30', title: language === 'ru' ? 'Консультация для студентов' : 'Talabalar uchun maslahat', type: language === 'ru' ? 'Онлайн' : 'Online', group: '', place: language === 'ru' ? 'Онлайн' : 'Online', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
        { time: '16:00', end: '17:00', title: language === 'ru' ? 'Проверка заданий и отчётов' : 'Topshiriqlarni tekshirish', type: language === 'ru' ? 'Самост.' : 'Mustaqil', group: '', place: language === 'ru' ? 'Самостоятельная работа' : 'Mustaqil ish', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    ];

    const notifications = [
        { icon: MessageSquare, text: language === 'ru' ? '3 новых сообщения от студентов' : '3 ta yangi xabar talabalardan', time: language === 'ru' ? '10 мин назад' : '10 min avval', color: 'text-blue-500' },
        { icon: CheckSquare,   text: language === 'ru' ? '5 заданий требуют проверки' : '5 ta topshiriq tekshirishni kutmoqda', time: language === 'ru' ? '1 ч назад' : '1 soat avval', color: 'text-amber-500' },
        { icon: Gamepad2,      text: language === 'ru' ? 'Завершена симуляция: «Работа установки первичной подготовки нефти» группой НГТ-21-1' : "Guruh simulyatsiyani yakunladi", time: language === 'ru' ? '2 ч назад' : '2 soat avval', color: 'text-purple-500' },
        { icon: Star,          text: language === 'ru' ? 'Новый отзыв от студента' : "Talabadan yangi fikr", time: language === 'ru' ? '3 ч назад' : '3 soat avval', color: 'text-emerald-500' },
    ];

    const quickActions = [
        { icon: Plus,     label: language === 'ru' ? 'Создать задание' : 'Topshiriq yaratish',     color: 'bg-blue-500',   href: '/modules' },
        { icon: Play,     label: language === 'ru' ? 'Запустить симуляцию' : 'Simulyatsiya boshlash', color: 'bg-purple-500', href: '/simulations' },
        { icon: FileText, label: language === 'ru' ? 'Создать тест' : 'Test yaratish',              color: 'bg-teal-500',   href: '/modules' },
        { icon: Upload,   label: language === 'ru' ? 'Загрузить материал' : 'Material yuklash',     color: 'bg-amber-500',  href: '/portfolio' },
        { icon: Megaphone,label: language === 'ru' ? 'Отправить объявление' : "E'lon yuborish",     color: 'bg-rose-500',   href: '/sbcm' },
        { icon: BarChart2, label: language === 'ru' ? 'Провести опрос' : "So'rov o'tkazish",        color: 'bg-indigo-500', href: '/monitoring' },
    ];

    const recentTasks = [
        { title: language === 'ru' ? 'Анализ структуры пласта' : 'Plast tuzilmasini tahlil qilish', type: language === 'ru' ? 'Практическое задание' : 'Amaliy topshiriq', group: 'НГТ-21-1', due: '25.05.2025', done: 86, check: '12/74' },
        { title: language === 'ru' ? 'Расчёт производительности скважины' : "Quduq unumdorligini hisoblash", type: language === 'ru' ? 'Практическое задание' : 'Amaliy topshiriq', group: 'НГТ-21-1', due: '28.05.2025', done: 62, check: '8/74' },
        { title: language === 'ru' ? 'Тест по теме: Бурение скважин' : "Mavzu bo'yicha test", type: language === 'ru' ? 'Тест' : 'Test', group: 'НГТ-21-1', due: '30.05.2025', done: 75, check: '20/74' },
        { title: language === 'ru' ? 'Проект: Разработка месторождения' : 'Loyiha: Konni ishlab chiqish', type: language === 'ru' ? 'Проект' : 'Loyiha', group: 'НГТ-21-1', due: '05.06.2025', done: 40, check: '—' },
        { title: language === 'ru' ? 'Отчёт по симуляции: Транспортировка нефти' : 'Simulyatsiya hisoboti', type: language === 'ru' ? 'Отчёт' : 'Hisobot', group: 'НГТ-21-1', due: '02.06.2025', done: 68, check: '15/74' },
    ];

    function getBarColor(p) {
        if (p >= 75) return 'bg-emerald-500';
        if (p >= 50) return 'bg-blue-500';
        if (p >= 30) return 'bg-amber-400';
        return 'bg-rose-400';
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-sm text-gray-500">{t('loading') || (language === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-12">

            {/* ── ROW 1: Welcome Banner + Мой курс ────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Welcome banner */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex h-full">
                        {/* Left: info */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {language === 'ru' ? 'Добро пожаловать, Абдуллаева Асила!' : 'Xush kelibsiz, Abdullaeva Asila!'}
                                </h1>
                                <p className="text-sm text-gray-400 mt-1">
                                    {language === 'ru' ? 'Рады видеть вас в панели преподавателя.' : 'O\'qituvchi paneliga xush kelibsiz.'}
                                </p>
                            </div>
                            <div className="mt-4 space-y-2">
                                {[
                                    { icon: Users,     label: language === 'ru' ? 'Преподаватель' : "O'qituvchi",       value: 'Абдуллаева Асила' },
                                    { icon: BookOpen,  label: language === 'ru' ? 'Предмет' : 'Fan',                   value: language === 'ru' ? 'Основы нефтегазовой технологии' : 'Neft-gaz texnologiyasi asoslari' },
                                    { icon: AlertCircle, label: language === 'ru' ? 'Подразделение' : "Bo'lim",         value: language === 'ru' ? 'Кафедра нефтегазового дела' : 'Neft-gaz ishi kafedrasi' },
                                    { icon: Star,      label: language === 'ru' ? 'Роль' : 'Rol',                      value: language === 'ru' ? 'Преподаватель' : "O'qituvchi" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <row.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-500 w-28 flex-shrink-0">{row.label}:</span>
                                        <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right: industry photo */}
                        <div className="w-72 flex-shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10" />
                            <div
                                className="h-full w-full"
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Мой курс card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-900">{language === 'ru' ? 'Мой курс' : 'Mening kursim'}</h2>
                        <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                            {language === 'ru' ? 'Подробнее' : 'Batafsil'} <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 leading-snug">
                                {language === 'ru' ? 'Основы нефтегазовой технологии' : 'Neft-gaz texnologiyasi asoslari'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{language === 'ru' ? 'Код дисциплины: OGT-101' : 'Fan kodi: OGT-101'}</p>
                            <p className="text-xs text-gray-400">{language === 'ru' ? 'Семестр: Весна 2025' : 'Semestr: Bahor 2025'}</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{language === 'ru' ? 'Общий прогресс курса' : 'Kursning umumiy progressi'}</span>
                            <span className="font-bold text-indigo-600">72%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="h-2 rounded-full bg-indigo-600" style={{ width: '72%' }} />
                        </div>
                    </div>

                    {/* Today's date pill */}
                    <div className="mt-auto pt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>

            {/* ── ROW 2: Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    {
                        icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600',
                        label: language === 'ru' ? 'Всего студентов' : 'Jami talabalar',
                        value: stats.students || 86,
                        sub: language === 'ru' ? `Активных: ${stats.activeStudents || 74} (86%)` : `Faol: ${stats.activeStudents || 74} (86%)`,
                    },
                    {
                        icon: ClipboardList, bg: 'bg-emerald-50', iconColor: 'text-emerald-600',
                        label: language === 'ru' ? 'Назначено заданий' : 'Topshiriqlar',
                        value: 24,
                        sub: language === 'ru' ? 'Выполнено: 18 (75%)' : "Bajarildi: 18 (75%)",
                    },
                    {
                        icon: Gamepad2, bg: 'bg-purple-50', iconColor: 'text-purple-600',
                        label: language === 'ru' ? 'Проведено симуляций' : 'Simulyatsiyalar',
                        value: stats.simulations || 12,
                        sub: language === 'ru' ? `Средний прогресс: ${stats.avgProgress || 68}%` : `O'rtacha: ${stats.avgProgress || 68}%`,
                    },
                    {
                        icon: Star, bg: 'bg-amber-50', iconColor: 'text-amber-500',
                        label: language === 'ru' ? 'Средняя оценка' : "O'rtacha baho",
                        value: '4.2 / 5',
                        sub: language === 'ru' ? 'По всем заданиям' : "Barcha topshiriqlar bo'yicha",
                    },
                    {
                        icon: MessageSquare, bg: 'bg-rose-50', iconColor: 'text-rose-500',
                        label: language === 'ru' ? 'Обратная связь' : 'Fikr-mulohazalar',
                        value: stats.reflections || 16,
                        sub: language === 'ru' ? 'Новых сообщений' : 'Yangi xabarlar',
                    },
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg}`}>
                            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 truncate">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">{card.value}</p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── ROW 3: Charts + Right Panel ──────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Left: Donut + Sparkline charts */}
                <div className="xl:col-span-2 space-y-5">

                    {/* Charts row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Donut: student progress */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {language === 'ru' ? 'Прогресс студентов' : 'Talabalar progressi'}
                                </h3>
                                <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-600">
                                    {language === 'ru' ? 'По курсу ▾' : 'Kurs bo\'yicha ▾'}
                                </span>
                            </div>
                            <div className="flex items-center gap-5">
                                {/* SVG donut */}
                                <div className="relative flex-shrink-0">
                                    <svg width="140" height="140" viewBox="0 0 140 140">
                                        {/* Track */}
                                        <circle cx="70" cy="70" r="52" fill="none" stroke="#F3F4F6" strokeWidth="18" />
                                        {/* Segments */}
                                        {(() => {
                                            const r = 52, circ = 2 * Math.PI * r;
                                            const segs = donutData;
                                            let acc = 0;
                                            return segs.map((s, i) => {
                                                const pct = (s.value / total);
                                                const dash = pct * circ;
                                                const off = -acc * circ + circ * 0.25; // start from top
                                                acc += pct;
                                                return (
                                                    <circle key={i} cx="70" cy="70" r={r} fill="none"
                                                        stroke={s.color} strokeWidth="18"
                                                        strokeDasharray={`${dash} ${circ - dash}`}
                                                        strokeDashoffset={off}
                                                        strokeLinecap="butt" />
                                                );
                                            });
                                        })()}
                                        <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">{total}</text>
                                        <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#6B7280">
                                            {language === 'ru' ? 'студентов' : 'talaba'}
                                        </text>
                                    </svg>
                                </div>
                                {/* Legend */}
                                <div className="space-y-2 flex-1">
                                    {donutData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                                <span className="text-[11px] text-gray-600 leading-tight">{d.label}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 ml-2">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/monitoring')}
                                className="mt-4 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                {language === 'ru' ? 'Подробная аналитика' : 'Batafsil tahlil'} →
                            </button>
                        </div>

                        {/* Sparkline: student activity */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {language === 'ru' ? 'Активность студентов' : 'Talabalar faolligi'}
                                </h3>
                                <span className="text-[10px] text-gray-400">
                                    {language === 'ru' ? 'за последнюю неделю' : 'so\'nggi hafta'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: language === 'ru' ? 'Активные студенты' : 'Faol talabalar', data: [60,58,70,65,72,75,78,80,76,82], color: '#6366F1' },
                                    { label: language === 'ru' ? 'Выполненные задания' : "Bajarilgan topshiriqlar", data: [30,35,28,40,38,45,42,48,50,52], color: '#22C55E' },
                                    { label: language === 'ru' ? 'Участие в симуляциях' : "Simulyatsiyalarda ishtirok", data: [20,15,22,18,25,20,28,24,30,26], color: '#8B5CF6' },
                                ].map((line, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ background: line.color }} />
                                                <span className="text-xs text-gray-600">{line.label}</span>
                                            </div>
                                            <span className="text-xs font-semibold" style={{ color: line.color }}>{line.data[line.data.length - 1]}</span>
                                        </div>
                                        <div className="w-full bg-gray-50 rounded-lg overflow-hidden" style={{ height: 36 }}>
                                            <svg width="100%" height="36" viewBox="0 0 200 36" preserveAspectRatio="none">
                                                {(() => {
                                                    const d = line.data;
                                                    const min = Math.min(...d), max = Math.max(...d), range = max - min || 1;
                                                    const pts = d.map((v, j) =>
                                                        `${(j / (d.length - 1)) * 200},${36 - ((v - min) / range) * 28 - 4}`
                                                    ).join(' ');
                                                    const fillPts = `0,36 ${pts} 200,36`;
                                                    return (
                                                        <>
                                                            <polygon points={fillPts} fill={line.color} fillOpacity="0.1" />
                                                            <polyline points={pts} fill="none" stroke={line.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                                        </>
                                                    );
                                                })()}
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/monitoring')}
                                className="mt-3 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                {language === 'ru' ? 'Смотреть аналитику' : 'Tahlilni ko\'rish'} →
                            </button>
                        </div>
                    </div>

                    {/* Recent tasks table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-bold text-gray-800">
                                {language === 'ru' ? 'Последние задания' : 'So\'nggi topshiriqlar'}
                            </h3>
                            <button
                                onClick={() => navigate('/modules')}
                                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                {language === 'ru' ? 'Все задания' : 'Barcha topshiriqlar'} →
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        {[
                                            language === 'ru' ? 'Задание' : 'Topshiriq',
                                            language === 'ru' ? 'Тип' : 'Tur',
                                            language === 'ru' ? 'Группа' : 'Guruh',
                                            language === 'ru' ? 'Срок сдачи' : 'Muddati',
                                            language === 'ru' ? 'Выполнено' : 'Bajarildi',
                                            language === 'ru' ? 'Проверено' : 'Tekshirildi',
                                        ].map((h, i) => (
                                            <th key={i} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentTasks.map((task, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/modules')}>
                                            <td className="px-4 py-3 text-xs font-medium text-gray-800 max-w-[200px] truncate">{task.title}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">{task.type}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{task.group}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{task.due}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                                                        <div className={`h-1.5 rounded-full ${getBarColor(task.done)}`} style={{ width: `${task.done}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-gray-700">{task.done}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{task.check}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-50 text-center">
                            <button onClick={() => navigate('/modules')} className="text-xs text-indigo-600 hover:underline">
                                {language === 'ru' ? 'Перейти ко всем заданиям →' : 'Barcha topshiriqlarga o\'tish →'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right panel: Schedule + Notifications + Quick Actions */}
                <div className="space-y-4">

                    {/* Schedule */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                {language === 'ru' ? 'Расписание на сегодня' : 'Bugungi dars jadvali'}
                            </h3>
                            <button onClick={() => navigate('/trajectories')} className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5">
                                {language === 'ru' ? 'Смотреть календарь' : 'Taqvimni ko\'rish'} →
                            </button>
                        </div>
                        <div className="space-y-2">
                            {scheduleItems.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-semibold text-gray-800 truncate">{item.title}</p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${item.color}`}>{item.type}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            {item.time} – {item.end}
                                            {item.place && <span className="ml-1">• {item.place}</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/trajectories')} className="mt-2 w-full text-center text-[10px] text-indigo-600 hover:underline">
                            {language === 'ru' ? 'Все занятия →' : 'Barcha darslar →'}
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-indigo-500" />
                                {language === 'ru' ? 'Уведомления' : 'Bildirishnomalar'}
                            </h3>
                            <button className="text-[10px] text-indigo-600 hover:underline">
                                {language === 'ru' ? 'Все уведомления →' : 'Barcha →'}
                            </button>
                        </div>
                        <div className="space-y-2.5">
                            {notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-2.5 hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors cursor-pointer">
                                    <n.icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${n.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-700 leading-snug">{n.text}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">
                            {language === 'ru' ? 'Быстрые действия' : 'Tezkor harakatlar'}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {quickActions.map((a, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(a.href)}
                                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-gray-100
                                        hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <a.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-[9px] font-medium text-gray-600 text-center leading-tight">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer timestamp */}
            <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
                <RefreshCcw className="w-3 h-3" />
                {language === 'ru' ? 'Данные обновлены:' : 'Ma\'lumotlar yangilandi:'}{' '}
                {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })},{' '}
                {new Date().toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </p>

        </div>
    );
}
