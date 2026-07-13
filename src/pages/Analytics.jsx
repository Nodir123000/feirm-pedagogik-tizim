import { useState } from 'react';
import { useLanguage } from '@/components/shared/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
    Users,
    GraduationCap,
    TrendingUp,
    CheckSquare,
    Zap,
    AlertTriangle,
    Download,
    FileText,
    RefreshCcw,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    BarChart2,
    BookOpen,
    Cpu,
    Star,
    Activity
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Mini Line Chart (pure SVG) ──────────────────────────────────────────────
function MiniLineChart({ data, color = '#4F46E5', height = 60 }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 260;
    const h = height;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 10) - 5;
        return `${x},${y}`;
    });
    const pointsStr = pts.join(' ');
    const areaStr = `0,${h} ${pointsStr} ${w},${h}`;

    return (
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaStr} fill={`url(#grad-${color.replace('#','')})`} />
            <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => {
                const [x, y] = p.split(',');
                return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
            })}
        </svg>
    );
}

// ─── Mini Bar Chart (pure SVG) ────────────────────────────────────────────────
function MiniBarChart({ data, colors, labels }) {
    const max = Math.max(...data.map(d => d.value));
    const w = 260;
    const h = 120;
    const barW = 36;
    const gap = (w - data.length * barW) / (data.length + 1);

    return (
        <svg width="100%" height={h + 24} viewBox={`0 0 ${w} ${h + 24}`}>
            {data.map((item, i) => {
                const barH = Math.max(4, (item.value / max) * h);
                const x = gap + i * (barW + gap);
                const y = h - barH;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH} rx="6" fill={colors[i]} opacity="0.85" />
                        <text x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize="10" fill="#9CA3AF">{labels[i]}</text>
                        <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">{item.value}%</text>
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Donut Chart (pure SVG) ───────────────────────────────────────────────────
function DonutChart({ data, total, label }) {
    const radius = 54;
    const cx = 70;
    const cy = 70;
    const circumference = 2 * Math.PI * radius;

    let accumulated = 0;
    const segments = data.map((item) => {
        const pct = item.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotation = accumulated * 360;
        accumulated += pct;
        return { ...item, dash, gap, rotation };
    });

    return (
        <div className="flex items-center gap-6">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F3F4F6" strokeWidth="16" />
                {segments.map((seg, i) => (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="16"
                        strokeDasharray={`${seg.dash} ${seg.gap}`}
                        strokeDashoffset={0}
                        transform={`rotate(${seg.rotation - 90} ${cx} ${cy})`}
                        strokeLinecap="round"
                    />
                ))}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">{total}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6B7280">{label}</text>
            </svg>
            <div className="space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                        <span className="text-gray-600 flex-1">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                        <span className="text-gray-400 text-xs">({Math.round(item.value / total * 100)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Analytics() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');

    const ru = language === 'ru';

    const handleExport = () => {
        toast({
            title: ru ? 'Экспорт данных' : 'Ma\'lumotlarni eksport qilish',
            description: ru ? 'Отчёт формируется и будет загружен.' : 'Hisobot shakllantirilmoqda.',
        });
    };

    const handleCreateReport = () => {
        toast({
            title: ru ? 'Создание отчёта' : 'Hisobot yaratish',
            description: ru ? 'Функция находится в разработке.' : 'Funksiya ishlab chiqilmoqda.',
        });
    };

    // KPI stats
    const kpiStats = [
        {
            title: ru ? 'Всего студентов' : 'Jami talabalar',
            value: '86',
            sub: ru ? 'Во всех группах' : 'Barcha guruhlarda',
            icon: Users,
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            trend: '+4',
            trendUp: true
        },
        {
            title: ru ? 'Средний балл' : "O'rtacha ball",
            value: '72%',
            sub: ru ? 'По всем курсам' : 'Barcha kurslarda',
            icon: GraduationCap,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            trend: '+5%',
            trendUp: true
        },
        {
            title: ru ? 'Успеваемость выше 70%' : "70% dan yuqori o'zlashtirish",
            value: '36',
            sub: ru ? 'Студентов (42%)' : 'Talabalar (42%)',
            icon: TrendingUp,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            trend: '+3',
            trendUp: true
        },
        {
            title: ru ? 'Выполнено заданий' : 'Bajarilgan topshiriqlar',
            value: '98%',
            sub: ru ? 'Средний показатель' : "O'rtacha ko'rsatkich",
            icon: CheckSquare,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            trend: '+2%',
            trendUp: true
        },
        {
            title: ru ? 'Средняя активность' : "O'rtacha faollik",
            value: '4.6/5',
            sub: ru ? 'По всем курсам' : 'Barcha kurslarda',
            icon: Zap,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            trend: '+0.2',
            trendUp: true
        },
        {
            title: ru ? 'Студенты в зоне риска' : 'Xavf zonasidagi talabalar',
            value: '10',
            sub: ru ? '(12%) Требуют внимания' : "(12%) E'tibor talab qiladi",
            icon: AlertTriangle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-500',
            trend: '-2',
            trendUp: true
        },
    ];

    // Line chart: академическая динамика
    const lineData = [58, 62, 68, 72];
    const lineLabels = ['01.05', '08.05', '15.05', '22.05'];

    // Task completion multi-line data (simplified as bar series)
    const taskData = [
        { value: 82 }, { value: 76 }, { value: 68 }, { value: 60 }
    ];

    // Donut chart: student levels
    const donutData = [
        { label: ru ? 'Высокий (80-100%)' : 'Yuqori (80-100%)', value: 26, color: '#4F46E5' },
        { label: ru ? 'Выше среднего (60-79%)' : "O'rta-yuqori (60-79%)", value: 30, color: '#22C55E' },
        { label: ru ? 'Средний (40-59%)' : "O'rta (40-59%)", value: 20, color: '#F59E0B' },
        { label: ru ? 'Низкий (0-39%)' : "Past (0-39%)", value: 10, color: '#EF4444' },
    ];

    // Bar chart: Activity by week
    const activityData = [
        { value: 48 }, { value: 46 }, { value: 43 }, { value: 42 }
    ];

    // At-risk students
    const atRiskStudents = [
        { name: 'Саид Р.', group: 'НГТ-21-1', score: 48, activity: '2.1/5', risk: 'high', ru: true },
        { name: 'Одилбек К.', group: 'НГТ-21-3', score: 45, activity: '2.3/5', risk: 'high', ru: true },
        { name: 'Нигина С.', group: 'НГТ-21-2', score: 58, activity: '2.8/5', risk: 'medium', ru: true },
        { name: 'Шохрух М.', group: 'НГТ-21-1', score: 59, activity: '2.9/5', risk: 'medium', ru: true },
    ];

    // Top courses
    const topCourses = [
        { name: ru ? 'Основы нефтегазовой технологии' : "Neft-gaz texnologiyalari asoslari", score: 72, students: 28, above70: 18 },
        { name: ru ? 'Бурение нефтяных и газовых скважин' : "Neft va gaz quduqlarini burg'ulash", score: 74, students: 24, above70: 16 },
        { name: ru ? 'Транспортировка нефти и газа' : 'Neft va gazni tashish', score: 69, students: 20, above70: 12 },
        { name: ru ? 'Подготовка нефти и газа' : 'Neft va gazni tayyorlash', score: 71, students: 14, above70: 9 },
    ];

    // Recent reports
    const recentReports = [
        { name: ru ? 'Отчёт по успеваемости (май 2025)' : "Iyul 2025 o'zlashtirish hisoboti", date: '24.05.2025, 15:30' },
        { name: ru ? 'Активность студентов за 4 недели' : '4 haftalik talabalar faolligi', date: '24.05.2025, 14:45' },
        { name: ru ? 'Выполнение заданий и тестов' : 'Topshiriqlar va testlar bajarilishi', date: '24.05.2025, 14:20' },
        { name: ru ? 'Анализ использования симуляций' : 'Simulyatsiyalardan foydalanish tahlili', date: '24.05.2025, 13:50' },
    ];

    // Platform modules summary
    const platformModules = [
        { name: ru ? 'Модуль проектирования компетенций (SBCM)' : 'Kompetensiyalar loyihalash moduli (SBCM)', efficiency: 75, color: '#4F46E5' },
        { name: ru ? 'Модуль симуляционного обучения (SDME + ASM)' : "Simulyatsion ta'lim moduli (SDME + ASM)", efficiency: 81, color: '#22C55E' },
        { name: ru ? 'Модуль фасилитационного сопровождения (FEIRM)' : 'Fasilitatsion yordam moduli (FEIRM)', efficiency: 76, color: '#F59E0B' },
        { name: ru ? 'Модуль мониторинга и аналитики (MPMS)' : 'Monitoring va analitika moduli (MPMS)', efficiency: 89, color: '#EF4444' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {ru ? 'Аналитика и отчёты' : 'Analitika va hisobotlar'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {ru ? 'Академическая аналитика и мониторинг успеваемости студентов' : "Talabalar o'zlashtirishi monitoringi va akademik analitika"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                        <Download className="w-4 h-4" />
                        {ru ? 'Экспорт данных' : 'Ma\'lumotlarni eksport'}
                    </button>
                    <button
                        onClick={handleCreateReport}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm shadow-indigo-200">
                        <FileText className="w-4 h-4" />
                        {ru ? 'Создать отчёт' : 'Hisobot yaratish'}
                    </button>
                </div>
            </div>

            {/* ── Tabs ───────────────────────────────────────────────────────── */}
            <div className="border-b border-gray-200">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-6">
                        {[
                            { value: 'overview',    label: ru ? 'Обзор' : 'Umumiy' },
                            { value: 'performance', label: ru ? 'Успеваемость' : "O'zlashtirish" },
                            { value: 'activity',    label: ru ? 'Активность' : 'Faollik' },
                            { value: 'courses',     label: ru ? 'Курсы' : 'Kurslar' },
                            { value: 'simulations', label: ru ? 'Симуляции' : 'Simulyatsiyalar' },
                            { value: 'tasks',       label: ru ? 'Задания и тесты' : 'Topshiriqlar' },
                            { value: 'reports',     label: ru ? 'Отчёты' : 'Hisobotlar' },
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700 font-medium text-sm whitespace-nowrap"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* ── Filters ────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>01.05.2025 – 24.05.2025</span>
                </div>
                {[
                    { label: ru ? 'Курс: Все' : 'Kurs: Barcha' },
                    { label: ru ? 'Группа: Все' : 'Guruh: Barcha' },
                    { label: ru ? 'Модуль: Все' : 'Modul: Barcha' },
                ].map((f, i) => (
                    <select key={i} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2">
                        <option>{f.label}</option>
                    </select>
                ))}
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />
                    {ru ? 'Сбросить' : 'Qayta tiklash'}
                </button>
            </div>

            {/* ── KPI Cards ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                                </div>
                                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</p>
                            <p className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wide leading-snug">{stat.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{stat.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Main Grid ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* LEFT: 3 columns */}
                <div className="xl:col-span-3 space-y-6">

                    {/* Row 1: Line chart + Donut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Динамика успеваемости */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">{ru ? 'Динамика успеваемости' : "O'zlashtirish dinamikasi"}</h3>
                                <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                                    <option>{ru ? 'По неделям' : 'Haftalar boyicha'}</option>
                                </select>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{ru ? 'Средний балл (%)' : "O'rtacha ball (%)"}</p>

                            {/* SVG Chart */}
                            <div className="relative">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-4">
                                    {['100', '75', '50', '25', '0'].map(v => <span key={v}>{v}</span>)}
                                </div>
                                <div className="pl-6">
                                    <MiniLineChart data={lineData} color="#4F46E5" height={100} />
                                    <div className="flex justify-between mt-1">
                                        {lineLabels.map(l => (
                                            <span key={l} className="text-[10px] text-gray-400">{l}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Распределение по уровням */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4">
                                {ru ? 'Распределение студентов по уровням' : "Talabalarning darajalar bo'yicha taqsimlanishi"}
                            </h3>
                            <DonutChart data={donutData} total={86} label={ru ? 'студентов' : 'talaba'} />
                        </div>
                    </div>

                    {/* Row 2: Task completion + Top Courses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Активность студентов (bar) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-1">{ru ? 'Активность студентов' : 'Talabalar faolligi'}</h3>
                            <p className="text-xs text-gray-400 mb-3">{ru ? 'Средняя активность (из 5)' : "O'rtacha faollik (5 dan)"}</p>
                            <MiniBarChart
                                data={activityData}
                                colors={['#4F46E5', '#818CF8', '#6366F1', '#A5B4FC']}
                                labels={[
                                    ru ? 'Нед. 1' : 'Haf. 1',
                                    ru ? 'Нед. 2' : 'Haf. 2',
                                    ru ? 'Нед. 3' : 'Haf. 3',
                                    ru ? 'Нед. 4' : 'Haf. 4',
                                ]}
                            />
                        </div>

                        {/* Топ курсов */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">{ru ? 'Топ курсов по успеваемости' : "O'zlashtirish bo'yicha top kurslar"}</h3>
                            </div>
                            <div className="text-xs text-gray-400 grid grid-cols-4 gap-2 pb-2 border-b border-gray-100 font-semibold uppercase">
                                <span className="col-span-2">{ru ? 'Курс' : 'Kurs'}</span>
                                <span className="text-center">{ru ? 'Ср. балл' : "O'rt. ball"}</span>
                                <span className="text-center">{ru ? 'Студ.' : 'Talaba'}</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {topCourses.map((course, i) => (
                                    <div key={i} className="grid grid-cols-4 gap-2 py-3 items-center">
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">{course.name}</p>
                                        </div>
                                        <div className="text-center">
                                            <span className={`font-bold text-sm ${course.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{course.score}%</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="font-semibold text-gray-700 text-sm">{course.students}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 border-t border-gray-100 text-center">
                                {ru ? 'Смотреть все курсы →' : 'Barcha kurslarni ko\'rish →'}
                            </button>
                        </div>
                    </div>

                    {/* Row 3: Platform modules */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-5">{ru ? 'Сводка по модулям платформы' : 'Platforma modullari bo\'yicha xulosа'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {platformModules.map((mod, i) => (
                                <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: mod.color }}></div>
                                        <p className="text-xs font-semibold text-gray-700 leading-tight">{mod.name}</p>
                                    </div>
                                    <p className="text-2xl font-bold mb-2" style={{ color: mod.color }}>{mod.efficiency}%</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">{ru ? 'Средняя эффективность' : "O'rtacha samaradorlik"}</p>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${mod.efficiency}%`, background: mod.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Sidebar */}
                <div className="xl:col-span-1 space-y-6">

                    {/* Students at risk */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">{ru ? 'Студенты в зоне риска' : 'Xavf zonasidagi talabalar'}</h3>
                            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                                {ru ? 'Смотреть всех →' : 'Barchasini ko\'rish →'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {atRiskStudents.map((s, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm flex-shrink-0">
                                        {s.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{s.name}</p>
                                        <p className="text-xs text-gray-400">{s.group} · {ru ? 'Балл' : 'Ball'}: <span className="font-medium text-gray-600">{s.score}%</span></p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                                        s.risk === 'high' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'
                                    }`}>
                                        {s.risk === 'high' ? (ru ? 'Риск' : 'Xavf') : (ru ? 'Внимание' : "E'tibor")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent reports */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">{ru ? 'Недавние отчёты' : "So'nggi hisobotlar"}</h3>
                            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                                {ru ? 'Все отчёты →' : 'Barcha hisobotlar →'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentReports.map((rep, i) => (
                                <div key={i} className="flex items-start gap-3 group cursor-pointer" onClick={handleExport}>
                                    <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">{rep.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{rep.date}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick analytics actions */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg shadow-indigo-200">
                        <h3 className="font-bold mb-1">{ru ? 'Быстрые действия' : 'Tezkor amallar'}</h3>
                        <p className="text-indigo-200 text-xs mb-4">{ru ? 'Создать или скачать отчёт за период' : 'Davr uchun hisobot yaratish yoki yuklab olish'}</p>
                        <div className="space-y-2">
                            {[
                                { icon: BarChart2, label: ru ? 'Отчёт по успеваемости' : "O'zlashtirish hisoboti" },
                                { icon: Activity, label: ru ? 'Отчёт по активности' : 'Faollik hisoboti' },
                                { icon: BookOpen, label: ru ? 'Отчёт по курсам' : 'Kurslar hisoboti' },
                                { icon: Cpu, label: ru ? 'Анализ симуляций' : 'Simulyatsiyalar tahlili' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={handleCreateReport}
                                    className="w-full flex items-center gap-2 text-sm text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors text-left">
                                    <action.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
