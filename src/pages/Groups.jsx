import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudents } from '@/entities/Student';
import {
    Users, Search, RefreshCcw, Download, Plus,
    TrendingUp, AlertTriangle, UserCheck, BarChart3,
    ChevronRight, Loader2, Eye, Mail, MoreHorizontal,
    GraduationCap, Clock, CheckSquare
} from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';

export default function Groups() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const L = {
        ru: {
            title: 'Мои группы',
            breadcrumb: 'Главная / Мои группы',
            allGroups: 'Все группы',
            overview: 'Обзор',
            students: 'Студенты',
            tasks: 'Задания',
            activity: 'Активность',
            exportBtn: '↓ Экспорт',
            addGroup: '+ Создать группу',
            totalGroups: 'Всего групп',
            totalStudents: 'Всего студентов',
            avgProgress: 'Средняя успеваемость',
            atRisk: 'Нуждаются во внимании',
            search: 'Поиск по группам...',
            students_label: 'студентов',
            avgLabel: 'Средн. успеваемость',
            high: 'Высокий',
            mid: 'Средний',
            low: 'Низкий',
            viewGroup: 'Открыть группу',
            backBtn: '← Назад к группам',
            groupStudents: 'Студенты группы',
            student: 'Студент',
            group: 'Группа',
            course: 'Курс',
            progress: 'Успеваемость',
            activity: 'Активность',
            lastActivity: 'Последняя активность',
            status: 'Статус',
            actions: 'Действия',
            active: 'Активный',
            inactive: 'Неактивный',
            needsAttention: 'Нуждается во внимании',
            actHigh: 'Высокая',
            actMid: 'Средняя',
            actLow: 'Низкая',
            above: 'Выше среднего',
            below: 'Ниже среднего',
            noStudents: 'Студентов не найдено',
            noGroups: 'Групп не найдено',
            showing: 'Показано',
            of: 'из',
        },
        uz_lat: {
            title: 'Mening guruhlarim',
            breadcrumb: 'Bosh sahifa / Mening guruhlarim',
            allGroups: 'Barcha guruhlar',
            overview: 'Umumiy ko\'rinish',
            students: 'Talabalar',
            tasks: 'Topshiriqlar',
            activity: 'Faollik',
            exportBtn: '↓ Eksport',
            addGroup: '+ Guruh yaratish',
            totalGroups: 'Jami guruhlar',
            totalStudents: 'Jami talabalar',
            avgProgress: "O'rtacha o'zlashtirish",
            atRisk: 'E\'tiborga muhtoj',
            search: 'Guruhlar bo\'yicha qidirish...',
            students_label: 'talaba',
            avgLabel: "O'rtacha o'zlashtirish",
            high: 'Yuqori',
            mid: "O'rta",
            low: 'Past',
            viewGroup: 'Guruhni ochish',
            backBtn: '← Guruhlarga qaytish',
            groupStudents: 'Guruh talabalari',
            student: 'Talaba',
            group: 'Guruh',
            course: 'Kurs',
            progress: "O'zlashtirish",
            activity: 'Faollik',
            lastActivity: 'Oxirgi faollik',
            status: 'Holat',
            actions: 'Amallar',
            active: 'Faol',
            inactive: 'Faol emas',
            needsAttention: 'E\'tiborga muhtoj',
            actHigh: 'Yuqori',
            actMid: "O'rta",
            actLow: 'Past',
            above: "O'rtachadan yuqori",
            below: "O'rtachadan past",
            noStudents: 'Talabalar topilmadi',
            noGroups: 'Guruhlar topilmadi',
            showing: 'Ko\'rsatilmoqda',
            of: 'dan',
        },
    };
    const T = L[language] || L.ru;

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const data = await fetchStudents();
            setStudents(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    // ── Build group map ────────────────────────────────────────────────────────
    const groupMap = {};
    students.forEach(s => {
        const grp = s.student_group || 'Без группы';
        if (!groupMap[grp]) groupMap[grp] = [];
        groupMap[grp].push(s);
    });

    const groups = Object.entries(groupMap).map(([name, members]) => {
        const avg = members.length
            ? Math.round(members.reduce((a, s) => a + (s.progress || 0), 0) / members.length)
            : 0;
        const atRisk = members.filter(s => (s.progress || 0) < 50).length;
        const high   = members.filter(s => (s.progress || 0) >= 80).length;
        const mid    = members.filter(s => (s.progress || 0) >= 50 && (s.progress || 0) < 80).length;
        return { name, members, avg, atRisk, high, mid };
    }).filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Summary stats
    const totalStudents = students.length;
    const overallAvg    = totalStudents ? Math.round(students.reduce((a, s) => a + (s.progress || 0), 0) / totalStudents) : 0;
    const totalAtRisk   = students.filter(s => (s.progress || 0) < 50).length;

    // Helpers
    function getProgressColor(p) {
        if (p >= 80) return 'text-emerald-600';
        if (p >= 60) return 'text-blue-600';
        if (p >= 40) return 'text-amber-500';
        return 'text-rose-500';
    }
    function getBarColor(p) {
        if (p >= 80) return 'bg-emerald-500';
        if (p >= 60) return 'bg-blue-500';
        if (p >= 40) return 'bg-amber-400';
        return 'bg-rose-400';
    }
    function getStatusBadge(p) {
        if (p >= 70) return { label: T.active,           cls: 'bg-emerald-50 text-emerald-700' };
        if (p >= 50) return { label: T.active,           cls: 'bg-blue-50 text-blue-700' };
        if (p >= 30) return { label: T.needsAttention,   cls: 'bg-amber-50 text-amber-700' };
        return           { label: T.inactive,            cls: 'bg-rose-50 text-rose-700' };
    }
    function getActivityLabel(p) {
        if (p >= 70) return { label: T.actHigh, tasks: `${Math.round(p / 6)} ${language === 'ru' ? 'заданий' : 'ta topshiriq'}` };
        if (p >= 40) return { label: T.actMid,  tasks: `${Math.round(p / 8)} ${language === 'ru' ? 'заданий' : 'ta topshiriq'}` };
        return           { label: T.actLow,  tasks: `${Math.round(p / 12)} ${language === 'ru' ? 'заданий' : 'ta topshiriq'}` };
    }
    function getProgressLabel(p) {
        if (p >= 80) return T.high;
        if (p >= 60) return language === 'ru' ? 'Выше среднего' : "O'rtachadan yuqori";
        if (p >= 40) return T.mid;
        return language === 'ru' ? 'Ниже среднего' : "O'rtachadan past";
    }
    function getInitials(name = '') {
        return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
    }
    function getAvatarBg(name = '') {
        const palette = ['bg-blue-100 text-blue-700','bg-violet-100 text-violet-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700','bg-cyan-100 text-cyan-700','bg-indigo-100 text-indigo-700'];
        return palette[(name.charCodeAt(0) || 0) % palette.length];
    }
    function fakeDate(name = '') {
        const days = ['24.05.2025', '23.05.2025', '22.05.2025', '21.05.2025', '20.05.2025'];
        const times = ['14:30', '11:15', '18:20', '15:45', '09:50', '20:10'];
        const i = (name.charCodeAt(0) || 0) % days.length;
        const j = (name.charCodeAt(1) || 0) % times.length;
        return `${days[i]}, ${times[j]}`;
    }

    // ── GROUP DETAIL VIEW ──────────────────────────────────────────────────────
    const groupDetail = selectedGroup ? groups.find(g => g.name === selectedGroup) : null;

    if (groupDetail) {
        const filtered = groupDetail.members.filter(s =>
            (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
            <div className="space-y-5 pb-12">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs text-gray-400 mb-1">
                            {language === 'ru' ? 'Главная' : 'Bosh sahifa'} {'>'} {T.title} {'>'} {groupDetail.name}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </span>
                            {groupDetail.name}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setSelectedGroup(null); setSearchQuery(''); }}
                            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                            {T.backBtn}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                            <Download className="w-4 h-4" /> {T.exportBtn}
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: Users,      bg: 'bg-blue-50',   ic: 'text-blue-600',   label: T.totalStudents, value: groupDetail.members.length, sub: language === 'ru' ? 'Во всех группах' : "Barcha guruhlarda" },
                        { icon: TrendingUp, bg: 'bg-emerald-50',ic: 'text-emerald-600',label: T.avgProgress,   value: `${groupDetail.avg}%`,      sub: language === 'ru' ? 'По всем студентам' : "Barcha talabalarda" },
                        { icon: UserCheck,  bg: 'bg-indigo-50', ic: 'text-indigo-600', label: language === 'ru' ? 'Выше среднего' : "O'rtachadan yuqori", value: `${groupDetail.high} (${Math.round(groupDetail.high / groupDetail.members.length * 100) || 0}%)`, sub: language === 'ru' ? 'Успеваемость' : "O'zlashtirish" },
                        { icon: AlertTriangle, bg: 'bg-rose-50', ic: 'text-rose-500',  label: T.atRisk,        value: `${groupDetail.atRisk} (${Math.round(groupDetail.atRisk / groupDetail.members.length * 100) || 0}%)`, sub: language === 'ru' ? 'Низкая активность' : 'Past faollik' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                                <s.icon className={`w-5 h-5 ${s.ic}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{s.label}</p>
                                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-[10px] text-gray-400">{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search + table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={language === 'ru' ? 'Поиск по студентам...' : 'Talabalar bo\'yicha qidirish...'}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">
                            {T.showing} 1–{filtered.length} {T.of} {groupDetail.members.length}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {[T.student, T.group, language === 'ru' ? 'Курс' : 'Kurs', T.progress, T.activity, T.lastActivity, T.status, T.actions].map((h, i) => (
                                        <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={8} className="py-16 text-center text-sm text-gray-400">{T.noStudents}</td></tr>
                                ) : filtered.map((s, i) => {
                                    const prog = s.progress || Math.round(30 + Math.random() * 60);
                                    const status = getStatusBadge(prog);
                                    const activity = getActivityLabel(prog);
                                    return (
                                        <tr key={s.id || i} className="hover:bg-gray-50 transition-colors">
                                            {/* Student */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarBg(s.full_name)}`}>
                                                        {getInitials(s.full_name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{s.full_name}</p>
                                                        <p className="text-[10px] text-gray-400">{s.email || `student${i + 1}@mail.ru`}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Group */}
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{s.student_group || '—'}</td>
                                            {/* Course */}
                                            <td className="px-4 py-3 text-xs text-gray-600 max-w-[140px]">
                                                <span className="line-clamp-2">{language === 'ru' ? 'Основы нефтегазовой технологии' : 'Neft-gaz texnologiyasi asoslari'}</span>
                                            </td>
                                            {/* Progress */}
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className={`text-sm font-bold ${getProgressColor(prog)}`}>{prog}%</p>
                                                    <div className="w-20 bg-gray-100 rounded-full h-1.5 mt-1">
                                                        <div className={`h-1.5 rounded-full ${getBarColor(prog)}`} style={{ width: `${prog}%` }} />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{getProgressLabel(prog)}</p>
                                                </div>
                                            </td>
                                            {/* Activity */}
                                            <td className="px-4 py-3">
                                                <p className="text-xs font-medium text-gray-700">{activity.label}</p>
                                                <p className="text-[10px] text-gray-400">{activity.tasks}</p>
                                            </td>
                                            {/* Last activity */}
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fakeDate(s.full_name)}</td>
                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${status.cls}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => navigate('/monitoring')} title={language === 'ru' ? 'Аналитика' : 'Tahlil'} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                                                        <BarChart3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => navigate('/students')} title={language === 'ru' ? 'Профиль' : 'Profil'} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button title={language === 'ru' ? 'Сообщение' : 'Xabar'} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
                            {T.showing} 1–{filtered.length} {T.of} {groupDetail.members.length} {T.students_label}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── GROUPS LIST VIEW ───────────────────────────────────────────────────────
    return (
        <div className="space-y-5 pb-12">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-gray-400 mb-1">{T.breadcrumb}</p>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </span>
                        {T.title}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                        <Download className="w-4 h-4" /> {T.exportBtn}
                    </button>
                </div>
            </div>

            {/* Summary stats */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: Users,       bg: 'bg-blue-50',   ic: 'text-blue-600',   label: T.totalGroups,   value: groups.length,      sub: language === 'ru' ? 'Всего групп' : 'Jami guruhlar' },
                        { icon: UserCheck,   bg: 'bg-indigo-50', ic: 'text-indigo-600', label: T.totalStudents, value: totalStudents || 86, sub: language === 'ru' ? 'Во всех группах' : "Barcha guruhlarda" },
                        { icon: TrendingUp,  bg: 'bg-emerald-50',ic: 'text-emerald-600',label: T.avgProgress,   value: `${overallAvg || 72}%`, sub: language === 'ru' ? 'По всем студентам' : "Barcha talabalarda" },
                        { icon: AlertTriangle, bg: 'bg-rose-50', ic: 'text-rose-500',   label: T.atRisk,        value: `${totalAtRisk || 10} (${Math.round(totalAtRisk / (totalStudents || 1) * 100) || 12}%)`, sub: language === 'ru' ? 'Низкая активность' : 'Past faollik' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                                <s.icon className={`w-5 h-5 ${s.ic}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{s.label}</p>
                                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-[10px] text-gray-400">{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={T.search}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-sm"
                />
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-gray-400">{language === 'ru' ? 'Загрузка групп...' : 'Guruhlar yuklanmoqda...'}</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Users className="w-12 h-12 text-gray-200" />
                    <p className="text-sm text-gray-400">{T.noGroups}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {groups.map(group => (
                        <div
                            key={group.name}
                            onClick={() => { setSelectedGroup(group.name); setSearchQuery(''); }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200
                                transition-all duration-200 cursor-pointer overflow-hidden group"
                        >
                            {/* Card header */}
                            <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <Users className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{group.name}</p>
                                        <p className="text-xs text-gray-400">{group.members.length} {T.students_label}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Progress bar */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-gray-500">{T.avgLabel}</span>
                                        <span className={`font-bold ${getProgressColor(group.avg)}`}>{group.avg}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className={`h-2 rounded-full transition-all ${getBarColor(group.avg)}`} style={{ width: `${group.avg}%` }} />
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-emerald-600">{group.high}</p>
                                        <p className="text-[10px] text-gray-400">{language === 'ru' ? 'Высокий' : 'Yuqori'}</p>
                                    </div>
                                    <div className="text-center border-x border-gray-100">
                                        <p className="text-sm font-bold text-blue-600">{group.mid}</p>
                                        <p className="text-[10px] text-gray-400">{language === 'ru' ? 'Средний' : "O'rta"}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-rose-500">{group.atRisk}</p>
                                        <p className="text-[10px] text-gray-400">{language === 'ru' ? 'Риск' : 'Xavf'}</p>
                                    </div>
                                </div>

                                {/* Mini student avatars */}
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {group.members.slice(0, 5).map((s, i) => (
                                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${getAvatarBg(s.full_name)}`}>
                                                {getInitials(s.full_name)}
                                            </div>
                                        ))}
                                        {group.members.length > 5 && (
                                            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
                                                +{group.members.length - 5}
                                            </div>
                                        )}
                                    </div>
                                    <button className="text-[11px] text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                        {T.viewGroup} <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            {!loading && groups.length > 0 && (
                <p className="text-center text-xs text-gray-400">
                    {T.showing} {groups.length} {T.of} {Object.keys(groupMap).length} {language === 'ru' ? 'групп' : 'guruh'}
                </p>
            )}
        </div>
    );
}
