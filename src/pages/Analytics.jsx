import { useState } from 'react';
import { useLanguage } from '@/components/shared/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
    Users, GraduationCap, TrendingUp, CheckSquare, Zap, AlertTriangle,
    Download, FileText, RefreshCcw, Calendar, ArrowUpRight, BarChart2,
    BookOpen, Cpu, Activity, ClipboardList, FlaskConical, Briefcase,
    Gamepad2, Star, Eye, CheckCircle2, Clock, XCircle, HelpCircle,
    ChevronRight, Plus
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Mini SVG Line Chart ──────────────────────────────────────────────────────
function LineChart({ data, color = '#4F46E5', height = 100, labels = [] }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 400; const h = height;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 14) - 7;
        return `${x},${y}`;
    });
    const areaStr = `0,${h} ${pts.join(' ')} ${w},${h}`;
    return (
        <div>
            <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={areaStr} fill={`url(#g${color.replace('#','')})`} />
                <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, i) => { const [x, y] = p.split(','); return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />; })}
                {data.map((v, i) => { const [x, y] = pts[i].split(','); return <text key={i} x={x} y={parseFloat(y)-8} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{v}%</text>; })}
            </svg>
            {labels.length > 0 && (
                <div className="flex justify-between mt-1 px-1">
                    {labels.map((l, i) => <span key={i} className="text-[10px] text-gray-400">{l}</span>)}
                </div>
            )}
        </div>
    );
}

// ─── Multi Line Chart ─────────────────────────────────────────────────────────
function MultiLineChart({ series, height = 120, labels = [] }) {
    const allVals = series.flatMap(s => s.data);
    const max = Math.max(...allVals); const min = Math.min(...allVals);
    const range = max - min || 1;
    const w = 400; const h = height;
    const getY = v => h - ((v - min) / range) * (h - 14) - 7;
    const getX = (i, total) => (i / (total - 1)) * w;

    return (
        <div>
            <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                {series.map((s, si) => {
                    const pts = s.data.map((v, i) => `${getX(i, s.data.length)},${getY(v)}`);
                    return <polyline key={si} points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeDasharray={s.dash || ''} />;
                })}
                {series[0]?.data.map((_, i) => {
                    const x = getX(i, series[0].data.length);
                    return series.map((s, si) => <circle key={`${si}-${i}`} cx={x} cy={getY(s.data[i])} r="3.5" fill={s.color} />);
                })}
            </svg>
            {labels.length > 0 && (
                <div className="flex justify-between mt-1 px-1">
                    {labels.map((l, i) => <span key={i} className="text-[10px] text-gray-400">{l}</span>)}
                </div>
            )}
        </div>
    );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data, colors, labels, height = 120 }) {
    const max = Math.max(...data.map(d => d.value));
    const w = 320; const h = height; const barW = 40;
    const gap = (w - data.length * barW) / (data.length + 1);
    return (
        <svg width="100%" height={h + 24} viewBox={`0 0 ${w} ${h + 24}`}>
            {data.map((item, i) => {
                const barH = Math.max(4, (item.value / max) * h);
                const x = gap + i * (barW + gap);
                const y = h - barH;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH} rx="6" fill={colors[i % colors.length]} opacity="0.85" />
                        <text x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize="10" fill="#9CA3AF">{labels[i]}</text>
                        <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">{item.value}</text>
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ data, total, label }) {
    const radius = 54; const cx = 70; const cy = 70;
    const circ = 2 * Math.PI * radius;
    let acc = 0;
    const segs = data.map(item => {
        const pct = item.value / total;
        const dash = pct * circ; const gap = circ - dash;
        const rot = acc * 360; acc += pct;
        return { ...item, dash, gap, rotation: rot };
    });
    return (
        <div className="flex items-center gap-6">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F3F4F6" strokeWidth="16" />
                {segs.map((seg, i) => (
                    <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={seg.color} strokeWidth="16"
                        strokeDasharray={`${seg.dash} ${seg.gap}`}
                        transform={`rotate(${seg.rotation - 90} ${cx} ${cy})`} strokeLinecap="round" />
                ))}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">{total}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6B7280">{label}</text>
            </svg>
            <div className="space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                        <span className="text-gray-600 flex-1 text-xs">{item.label}</span>
                        <span className="font-semibold text-gray-900 text-xs">{item.value}</span>
                        <span className="text-gray-400 text-[10px]">({Math.round(item.value / total * 100)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, iconBg, iconColor, trend, trendUp }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconBg}`}><Icon className={`w-4 h-4 ${iconColor}`} /></div>
                {trend && <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                    <ArrowUpRight className="w-3 h-3" />{trend}
                </span>}
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
            <p className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wide leading-snug">{title}</p>
            {sub && <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{sub}</p>}
        </div>
    );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ children }) {
    return <div className="space-y-6">{children}</div>;
}

export default function Analytics() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const ru = language === 'ru';

    const notify = (msg) => toast({
        title: ru ? 'Уведомление' : 'Xabarnoma',
        description: msg,
    });

    const kpiStats = [
        { title: ru ? 'Всего студентов' : 'Jami talabalar', value: '86', sub: ru ? 'Во всех группах' : 'Barcha guruhlarda', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', trend: '+4', trendUp: true },
        { title: ru ? 'Средний балл' : "O'rtacha ball", value: '72%', sub: ru ? 'По всем курсам' : 'Barcha kurslarda', icon: GraduationCap, iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: '+5%', trendUp: true },
        { title: ru ? 'Успеваемость >70%' : "O'zlashtirish >70%", value: '36', sub: ru ? 'Студентов (42%)' : 'Talabalar (42%)', icon: TrendingUp, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: '+3', trendUp: true },
        { title: ru ? 'Выполнено заданий' : 'Bajarilgan topshiriqlar', value: '98%', sub: ru ? 'Средний показатель' : "O'rtacha", icon: CheckSquare, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: '+2%', trendUp: true },
        { title: ru ? 'Средняя активность' : "O'rtacha faollik", value: '4.6/5', sub: ru ? 'По всем курсам' : 'Barcha kurslarda', icon: Zap, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', trend: '+0.2', trendUp: true },
        { title: ru ? 'Студенты в риске' : 'Xavf zonasida', value: '10', sub: ru ? '(12%) Внимание' : "(12%) E'tibor", icon: AlertTriangle, iconBg: 'bg-red-100', iconColor: 'text-red-500', trend: '-2', trendUp: true },
    ];

    const atRisk = [
        { name: 'Саид Р.', group: 'НГТ-21-1', score: 48, activity: '2.1/5', risk: 'high' },
        { name: 'Одилбек К.', group: 'НГТ-21-3', score: 45, activity: '2.3/5', risk: 'high' },
        { name: 'Нигина С.', group: 'НГТ-21-2', score: 58, activity: '2.8/5', risk: 'medium' },
        { name: 'Шохрух М.', group: 'НГТ-21-1', score: 59, activity: '2.9/5', risk: 'medium' },
    ];

    const topCourses = [
        { name: ru ? 'Основы нефтегазовой технологии' : "Neft-gaz texnologiyalari asoslari", score: 72, students: 28, above70: 18 },
        { name: ru ? 'Бурение нефтяных и газовых скважин' : "Neft va gaz quduqlarini burg'ulash", score: 74, students: 24, above70: 16 },
        { name: ru ? 'Транспортировка нефти и газа' : 'Neft va gazni tashish', score: 69, students: 20, above70: 12 },
        { name: ru ? 'Подготовка нефти и газа' : 'Neft va gazni tayyorlash', score: 71, students: 14, above70: 9 },
    ];

    const recentReports = [
        { name: ru ? 'Отчёт по успеваемости (май 2025)' : 'Iyul 2025 hisoboti', date: '24.05.2025, 15:30' },
        { name: ru ? 'Активность студентов за 4 недели' : '4 haftalik faollik', date: '24.05.2025, 14:45' },
        { name: ru ? 'Выполнение заданий и тестов' : 'Topshiriqlar bajarilishi', date: '24.05.2025, 14:20' },
        { name: ru ? 'Анализ использования симуляций' : 'Simulyatsiyalar tahlili', date: '24.05.2025, 13:50' },
    ];

    const platformModules = [
        { name: 'SBCM', full: ru ? 'Модуль проектирования компетенций' : 'Kompetensiyalar loyihalash', efficiency: 75, color: '#4F46E5' },
        { name: 'SDME+ASM', full: ru ? 'Модуль симуляционного обучения' : "Simulyatsion ta'lim", efficiency: 81, color: '#22C55E' },
        { name: 'FEIRM', full: ru ? 'Модуль фасилитационного сопровождения' : 'Fasilitatsion yordam', efficiency: 76, color: '#F59E0B' },
        { name: 'MPMS', full: ru ? 'Модуль мониторинга и аналитики' : 'Monitoring va analitika', efficiency: 89, color: '#EF4444' },
    ];

    const weekLabels = [
        `${ru ? 'Нед.1' : 'Haf.1'}\n01.05`,
        `${ru ? 'Нед.2' : 'Haf.2'}\n08.05`,
        `${ru ? 'Нед.3' : 'Haf.3'}\n15.05`,
        `${ru ? 'Нед.4' : 'Haf.4'}\n22.05`,
    ];

    // ── TAB: OVERVIEW ─────────────────────────────────────────────────────────
    const OverviewTab = () => (
        <Section>
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiStats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Line chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">{ru ? 'Динамика успеваемости' : "O'zlashtirish dinamikasi"}</h3>
                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-medium">{ru ? 'По неделям' : 'Haftalik'}</span>
                            </div>
                            <LineChart data={[58, 62, 68, 72]} color="#4F46E5" height={100} labels={['01.05', '08.05', '15.05', '22.05']} />
                        </div>
                        {/* Donut */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4">{ru ? 'Распределение по уровням' : "Darajalar bo'yicha taqsimlanish"}</h3>
                            <DonutChart total={86} label={ru ? 'студентов' : 'talaba'} data={[
                                { label: ru ? 'Высокий (80-100%)' : 'Yuqori', value: 26, color: '#4F46E5' },
                                { label: ru ? 'Выше среднего (60-79%)' : "O'rta-yuqori", value: 30, color: '#22C55E' },
                                { label: ru ? 'Средний (40-59%)' : "O'rta", value: 20, color: '#F59E0B' },
                                { label: ru ? 'Низкий (0-39%)' : 'Past', value: 10, color: '#EF4444' },
                            ]} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bar chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-1">{ru ? 'Активность студентов' : 'Talabalar faolligi'}</h3>
                            <p className="text-xs text-gray-400 mb-3">{ru ? 'Средняя активность (из 5)' : "O'rtacha faollik (5 dan)"}</p>
                            <BarChart data={[{value:48},{value:46},{value:43},{value:42}]} colors={['#4F46E5','#818CF8','#6366F1','#A5B4FC']}
                                labels={[ru?'Нед.1':'Haf.1', ru?'Нед.2':'Haf.2', ru?'Нед.3':'Haf.3', ru?'Нед.4':'Haf.4']} />
                        </div>
                        {/* Top courses */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4">{ru ? 'Топ курсов по успеваемости' : "Top kurslar"}</h3>
                            <div className="divide-y divide-gray-50">
                                {topCourses.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 py-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center flex-shrink-0">{i+1}</span>
                                        <p className="text-sm text-gray-700 flex-1 line-clamp-1">{c.name}</p>
                                        <span className={`font-bold text-sm ${c.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{c.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Platform modules */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">{ru ? 'Сводка по модулям платформы' : "Platforma modullari"}</h3>
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                            {platformModules.map((m, i) => (
                                <div key={i} className="border border-gray-100 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">{m.name}</p>
                                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{m.full}</p>
                                    <p className="text-2xl font-bold mb-2" style={{color:m.color}}>{m.efficiency}%</p>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{width:`${m.efficiency}%`, background:m.color}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Sidebar */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">{ru ? 'Зона риска' : 'Xavf zonasi'}</h3>
                            <button className="text-xs text-indigo-600 hover:underline">{ru ? 'Все →' : 'Barchasi →'}</button>
                        </div>
                        <div className="space-y-3">
                            {atRisk.map((s, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-sm flex-shrink-0">{s.name[0]}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                                        <p className="text-xs text-gray-400">{s.group} · {s.score}%</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.risk==='high'?'text-red-600 bg-red-50':'text-amber-600 bg-amber-50'}`}>
                                        {s.risk==='high'?(ru?'Риск':'Xavf'):(ru?'Внимание':"E'tibor")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">{ru ? 'Последние отчёты' : "So'nggi hisobotlar"}</h3>
                            <button className="text-xs text-indigo-600 hover:underline">{ru ? 'Все →' : 'Barchasi →'}</button>
                        </div>
                        <div className="space-y-3">
                            {recentReports.map((r, i) => (
                                <div key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => notify(ru ? 'Скачивание отчёта...' : 'Hisobot yuklanmoqda...')}>
                                    <div className="p-2 bg-indigo-50 rounded-lg"><FileText className="w-3.5 h-3.5 text-indigo-500" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{r.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{r.date}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg shadow-indigo-200">
                        <h3 className="font-bold mb-3">{ru ? 'Быстрые действия' : 'Tezkor amallar'}</h3>
                        {[{icon:BarChart2,l:ru?'Отчёт по успеваемости':"O'zlashtirish hisoboti"},{icon:Activity,l:ru?'Отчёт по активности':'Faollik hisoboti'},{icon:BookOpen,l:ru?'Отчёт по курсам':'Kurslar hisoboti'},{icon:Cpu,l:ru?'Анализ симуляций':'Simulyatsiyalar tahlili'}].map((a,i) => (
                            <button key={i} onClick={() => notify(ru?`Формируется: ${a.l}`:`Yaratilmoqda: ${a.l}`)} className="w-full flex items-center gap-2 text-sm text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors text-left mb-1">
                                <a.icon className="w-4 h-4" /><span className="font-medium">{a.l}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );

    // ── TAB: PERFORMANCE ──────────────────────────────────────────────────────
    const PerformanceTab = () => (
        <Section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {title:ru?'Средний балл':"O'rtacha ball", value:'72%', icon:GraduationCap, iconBg:'bg-indigo-100', iconColor:'text-indigo-600', trend:'+5%', trendUp:true},
                    {title:ru?'Выше 70%':">70% o'zlashtirish", value:'36', sub:ru?'Студентов':'Talabalar', icon:TrendingUp, iconBg:'bg-green-100', iconColor:'text-green-600', trend:'+3', trendUp:true},
                    {title:ru?'Ниже 50%':"<50% o'zlashtirish", value:'10', sub:ru?'Зона риска':'Xavf zonasi', icon:AlertTriangle, iconBg:'bg-red-100', iconColor:'text-red-500', trend:'-2', trendUp:true},
                    {title:ru?'Выполнено тестов':"Testlar bajarilgan", value:'98%', icon:CheckSquare, iconBg:'bg-amber-100', iconColor:'text-amber-600', trend:'+2%', trendUp:true},
                ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Динамика среднего балла':''}</h3>
                    <LineChart data={[58,62,65,68,70,72]} color="#4F46E5" height={120} labels={['Нед.1','Нед.2','Нед.3','Нед.4','Нед.5','Нед.6']} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Средний балл по группам':"Guruhlar bo'yicha ball"}</h3>
                    <BarChart data={[{value:74},{value:69},{value:72},{value:68}]} colors={['#4F46E5','#22C55E','#F59E0B','#EF4444']} labels={['НГТ-21-1','НГТ-21-2','НГТ-21-3','НГТ-21-4']} height={120}/>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">{ru?'Топ курсов по успеваемости':"Top kurslar"}</h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/60 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">{ru?'Курс':'Kurs'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Студентов':'Talabalar'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Средний балл':"O'rtacha"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Выше 70%':">70%"}</th>
                            <th className="px-4 py-3 font-semibold">{ru?'Прогресс бар':'Progressbar'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {topCourses.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4 font-medium text-gray-800">{c.name}</td>
                                <td className="px-4 py-4 text-center text-gray-600">{c.students}</td>
                                <td className="px-4 py-4 text-center"><span className={`font-bold ${c.score>=70?'text-green-600':'text-amber-600'}`}>{c.score}%</span></td>
                                <td className="px-4 py-4 text-center text-gray-600">{c.above70} <span className="text-gray-400 text-xs">({Math.round(c.above70/c.students*100)}%)</span></td>
                                <td className="px-4 py-4">
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{width:`${c.score}%`}}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );

    // ── TAB: ACTIVITY ─────────────────────────────────────────────────────────
    const ActivityTab = () => (
        <Section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {title:ru?'Средняя активность':"O'rtacha faollik", value:'4.6/5', icon:Zap, iconBg:'bg-amber-100', iconColor:'text-amber-600', trend:'+0.2', trendUp:true},
                    {title:ru?'Вход в систему':"Tizimga kirish", value:'94%', sub:ru?'Студентов':'Talabalar', icon:Activity, iconBg:'bg-indigo-100', iconColor:'text-indigo-600', trend:'+3%', trendUp:true},
                    {title:ru?'Просмотрено материалов':"Ko'rilgan materiallar", value:'1240', icon:Eye, iconBg:'bg-blue-100', iconColor:'text-blue-600', trend:'+120', trendUp:true},
                    {title:ru?'Низкая активность':"Past faollik", value:'8', sub:ru?'Студентов':'Talabalar', icon:AlertTriangle, iconBg:'bg-red-100', iconColor:'text-red-500', trend:'-1', trendUp:true},
                ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Активность по неделям':"Haftalik faollik"}</h3>
                    <MultiLineChart
                        series={[
                            {data:[4.8,4.6,4.3,4.2], color:'#4F46E5', label:ru?'Активность':'Faollik'},
                            {data:[3.8,3.5,3.7,3.4], color:'#EF4444', dash:'5,3', label:ru?'Порог риска':'Xavf chegarasi'},
                        ]}
                        height={120} labels={['Нед.1','Нед.2','Нед.3','Нед.4']}
                    />
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-indigo-500 rounded"></div><span className="text-xs text-gray-500">{ru?'Активность':'Faollik'}</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-red-400 rounded" style={{borderStyle:'dashed'}}></div><span className="text-xs text-gray-500">{ru?'Порог риска':'Xavf chegarasi'}</span></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Активность по группам':"Guruhlar faolligi"}</h3>
                    <BarChart data={[{value:49},{value:44},{value:46},{value:41}]} colors={['#4F46E5','#22C55E','#F59E0B','#818CF8']}
                        labels={['НГТ-21-1','НГТ-21-2','НГТ-21-3','НГТ-21-4']} height={120}/>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">{ru?'Студенты с низкой активностью':"Past faollikdagi talabalar"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {atRisk.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700">{s.name[0]}</div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{s.name}</p>
                                <p className="text-xs text-gray-400">{s.group}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">{s.activity}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.risk==='high'?'text-red-600 bg-red-50':'text-amber-600 bg-amber-50'}`}>
                                    {s.risk==='high'?(ru?'Риск':'Xavf'):(ru?'Внимание':"E'tibor")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );

    // ── TAB: COURSES ──────────────────────────────────────────────────────────
    const CoursesTab = () => (
        <Section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {title:ru?'Всего курсов':'Jami kurslar', value:'8', icon:BookOpen, iconBg:'bg-indigo-100', iconColor:'text-indigo-600', trend:'+1', trendUp:true},
                    {title:ru?'Активных':'Faol', value:'6', sub:'75%', icon:CheckCircle2, iconBg:'bg-green-100', iconColor:'text-green-600', trend:'+1', trendUp:true},
                    {title:ru?'Завершённых':'Yakunlangan', value:'2', icon:Star, iconBg:'bg-amber-100', iconColor:'text-amber-600'},
                    {title:ru?'Всего студентов':'Jami talabalar', value:'86', sub:ru?'Во всех курсах':'Barcha kurslarda', icon:Users, iconBg:'bg-blue-100', iconColor:'text-blue-600', trend:'+4', trendUp:true},
                ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{ru?'Детализация по курсам':'Kurslar bo\'yicha'}</h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/60 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">{ru?'Курс':'Kurs'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Студентов':'Talabalar'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Ср. балл':"O'rtacha"}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'>70%':">70%"}</th>
                            <th className="px-4 py-3 font-semibold">{ru?'Эффективность':'Samaradorlik'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Статус':'Holat'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...topCourses, {name:ru?'Охрана труда и безопасность':'Mehnat muhofazasi', score:77, students:18, above70:14, status:'active'}, {name:ru?'Цифровые технологии':'Raqamli texnologiyalar', score:65, students:22, above70:10, status:'active'}].map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-800">{c.name}</p>
                                </td>
                                <td className="px-4 py-4 text-center text-gray-600">{c.students}</td>
                                <td className="px-4 py-4 text-center"><span className={`font-bold ${c.score>=70?'text-green-600':'text-amber-600'}`}>{c.score}%</span></td>
                                <td className="px-4 py-4 text-center text-gray-600">{c.above70}</td>
                                <td className="px-4 py-4 w-40">
                                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="h-2 rounded-full bg-indigo-500" style={{width:`${c.score}%`}}></div></div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{ru?'Активный':'Faol'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );

    // ── TAB: SIMULATIONS ─────────────────────────────────────────────────────
    const SimulationsTab = () => (
        <Section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {title:ru?'Всего симуляций':'Jami simulyatsiyalar', value:'18', icon:Gamepad2, iconBg:'bg-indigo-100', iconColor:'text-indigo-600', trend:'+2', trendUp:true},
                    {title:ru?'Активных':'Faol', value:'12', sub:'(67%)', icon:CheckCircle2, iconBg:'bg-green-100', iconColor:'text-green-600'},
                    {title:ru?'Ср. эффективность':"O'rtacha samaradorlik", value:'78%', icon:Star, iconBg:'bg-amber-100', iconColor:'text-amber-600', trend:'+4%', trendUp:true},
                    {title:ru?'Используют студентов':'Foydalanayotgan', value:'64', sub:'(74%)', icon:Users, iconBg:'bg-blue-100', iconColor:'text-blue-600', trend:'+8', trendUp:true},
                ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Эффективность симуляций по неделям':"Simulyatsiyalar samaradorligi"}</h3>
                    <LineChart data={[68,72,76,74,78,80]} color="#22C55E" height={110} labels={['Нед.1','Нед.2','Нед.3','Нед.4','Нед.5','Нед.6']} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Типы симуляций':"Simulyatsiya turlari"}</h3>
                    <DonutChart total={18} label={ru?'всего':'jami'} data={[
                        {label:ru?'Симуляции':'Simulyatsiyalar', value:12, color:'#4F46E5'},
                        {label:ru?'Тренажёры':'Trenajerlar', value:4, color:'#22C55E'},
                        {label:ru?'Кейсы':'Keyslar', value:2, color:'#F59E0B'},
                    ]} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">{ru?'Топ симуляций по эффективности':'Top simulyatsiyalar'}</h3></div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/60 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">{ru?'Симуляция':'Simulyatsiya'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Тип':'Tur'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Студентов':'Talabalar'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Эффективность':'Samaradorlik'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[
                            {name:ru?'Гидравлические расчёты скважины':'Gidravlik hisoblashlar', type:ru?'Симуляция':'Simulyatsiya', students:28, eff:82},
                            {name:ru?'Расчёт производительности скважины':'Quduq unumdorligi', type:ru?'Симуляция':'Simulyatsiya', students:25, eff:76},
                            {name:ru?'Технологический процесс подготовки нефти':'Neftni tayyorlash', type:ru?'Симуляция':'Simulyatsiya', students:22, eff:79},
                            {name:ru?'Транспортировка нефти и газа':'Neft va gazni tashish', type:ru?'Тренажёр':'Trenajer', students:20, eff:75},
                        ].map((sim, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4 font-medium text-gray-800">{sim.name}</td>
                                <td className="px-4 py-4 text-center"><span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{sim.type}</span></td>
                                <td className="px-4 py-4 text-center text-gray-600">{sim.students}</td>
                                <td className="px-4 py-4 text-center"><span className={`font-bold ${sim.eff>=75?'text-green-600':'text-amber-600'}`}>{sim.eff}%</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );

    // ── TAB: TASKS ────────────────────────────────────────────────────────────
    const TasksTab = () => (
        <Section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {title:ru?'Всего заданий':'Jami topshiriqlar', value:'24', icon:ClipboardList, iconBg:'bg-indigo-100', iconColor:'text-indigo-600', trend:'+3', trendUp:true},
                    {title:ru?'Среднее выполнение':"O'rtacha bajarish", value:'91%', icon:CheckCircle2, iconBg:'bg-green-100', iconColor:'text-green-600', trend:'+4%', trendUp:true},
                    {title:ru?'Не сданы':'Topshirilmagan', value:'18', sub:ru?'Пропущено':'O\'tkazib yuborilgan', icon:XCircle, iconBg:'bg-red-100', iconColor:'text-red-500'},
                    {title:ru?'Средний балл':"O'rtacha ball", value:'74%', icon:Star, iconBg:'bg-amber-100', iconColor:'text-amber-600', trend:'+2%', trendUp:true},
                ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Выполнение заданий по неделям':"Haftalik bajarish"}</h3>
                    <MultiLineChart
                        series={[
                            {data:[82,80,85,88], color:'#4F46E5', label:ru?'Задания':'Topshiriqlar'},
                            {data:[72,75,78,76], color:'#22C55E', label:ru?'Тесты':'Testlar'},
                            {data:[60,65,68,70], color:'#F59E0B', label:ru?'Симуляции':'Simulyatsiyalar'},
                            {data:[40,45,42,48], color:'#EF4444', label:ru?'Проекты':'Loyihalar'},
                        ]}
                        height={120} labels={['Нед.1','Нед.2','Нед.3','Нед.4']}
                    />
                    <div className="flex flex-wrap gap-3 mt-3">
                        {[{c:'#4F46E5',l:ru?'Задания':'Topshiriqlar'},{c:'#22C55E',l:ru?'Тесты':'Testlar'},{c:'#F59E0B',l:ru?'Симуляции':'Simulyatsiyalar'},{c:'#EF4444',l:ru?'Проекты':'Loyihalar'}].map((x,i)=>(
                            <div key={i} className="flex items-center gap-1.5"><div className="w-3 h-2 rounded" style={{background:x.c}}></div><span className="text-xs text-gray-500">{x.l}</span></div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{ru?'Типы заданий':"Topshiriqlar turlari"}</h3>
                    <DonutChart total={24} label={ru?'заданий':'topshiriq'} data={[
                        {label:ru?'Тесты':'Testlar', value:9, color:'#4F46E5'},
                        {label:ru?'Практические':'Amaliy', value:6, color:'#22C55E'},
                        {label:ru?'Лабораторные':'Laboratoriya', value:4, color:'#F59E0B'},
                        {label:ru?'Проекты':'Loyihalar', value:3, color:'#8B5CF6'},
                        {label:ru?'Кейсы':'Keyslar', value:2, color:'#EF4444'},
                    ]} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">{ru?'Задания по курсам':'Kurslar bo\'yicha topshiriqlar'}</h3></div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/60 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">{ru?'Курс':'Kurs'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Заданий':'Topshiriqlar'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Выполнено':'Bajarilgan'}</th>
                            <th className="px-4 py-3 text-center font-semibold">{ru?'Ср. балл':"O'rtacha"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {topCourses.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-5 py-4 font-medium text-gray-800">{c.name}</td>
                                <td className="px-4 py-4 text-center text-gray-600">6</td>
                                <td className="px-4 py-4 text-center"><span className="font-bold text-green-600">91%</span></td>
                                <td className="px-4 py-4 text-center"><span className={`font-bold ${c.score>=70?'text-green-600':'text-amber-600'}`}>{c.score}%</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );

    // ── TAB: REPORTS ──────────────────────────────────────────────────────────
    const ReportsTab = () => (
        <Section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{ru?'Все отчёты':'Barcha hisobotlar'}</h3>
                        <button onClick={() => notify(ru?'Создание нового отчёта...':'Yangi hisobot yaratilmoqda...')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
                            <Plus className="w-3.5 h-3.5" />{ru?'Создать':'Yaratish'}
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[
                            ...recentReports,
                            {name:ru?'Анализ успеваемости I семестр':'I semestr tahlili', date:'20.05.2025, 10:00'},
                            {name:ru?'Сводный отчёт по модулям':'Modullar bo\'yicha hisobot', date:'18.05.2025, 16:30'},
                            {name:ru?'Динамика активности за месяц':'Oylik faollik dinamikasi', date:'15.05.2025, 09:15'},
                        ].map((r, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => notify(ru?`Скачивание: ${r.name}`:`Yuklanmoqda: ${r.name}`)}>
                                <div className="p-2.5 bg-indigo-50 rounded-lg flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{r.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{ru?'PDF':'PDF'}</span>
                                    <Download className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">{ru?'Создать отчёт':'Hisobot yaratish'}</h3>
                        <div className="space-y-2">
                            {[
                                {icon:GraduationCap, label:ru?'Отчёт по успеваемости':"O'zlashtirish hisoboti", color:'text-indigo-600 bg-indigo-50'},
                                {icon:Activity, label:ru?'Отчёт по активности':'Faollik hisoboti', color:'text-green-600 bg-green-50'},
                                {icon:BookOpen, label:ru?'Отчёт по курсам':'Kurslar hisoboti', color:'text-amber-600 bg-amber-50'},
                                {icon:Gamepad2, label:ru?'Анализ симуляций':'Simulyatsiyalar', color:'text-blue-600 bg-blue-50'},
                                {icon:AlertTriangle, label:ru?'Зона риска':'Xavf zonasi', color:'text-red-600 bg-red-50'},
                            ].map((a, i) => (
                                <button key={i} onClick={() => notify(ru?`Формируется: ${a.label}`:`Yaratilmoqda: ${a.label}`)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-gray-100`}>
                                    <div className={`p-2 rounded-lg ${a.color.split(' ')[1]}`}>
                                        <a.icon className={`w-4 h-4 ${a.color.split(' ')[0]}`} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{a.label}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 text-white">
                        <h3 className="font-bold mb-1">{ru?'Автоматические отчёты':'Avto hisobotlar'}</h3>
                        <p className="text-indigo-200 text-xs mb-4">{ru?'Настройте расписание отчётов':'Hisobot jadvalini sozlang'}</p>
                        <button onClick={() => notify(ru?'Настройка расписания...':'Jadval sozlanmoqda...')} className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors">
                            {ru?'Настроить расписание':'Jadval sozlash'}
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':    return <OverviewTab />;
            case 'performance': return <PerformanceTab />;
            case 'activity':    return <ActivityTab />;
            case 'courses':     return <CoursesTab />;
            case 'simulations': return <SimulationsTab />;
            case 'tasks':       return <TasksTab />;
            case 'reports':     return <ReportsTab />;
            default:            return <OverviewTab />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{ru?'Аналитика и отчёты':'Analitika va hisobotlar'}</h1>
                    <p className="text-sm text-gray-500 mt-1">{ru?'Академическая аналитика и мониторинг успеваемости студентов':"Talabalar o'zlashtirishi monitoringi"}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => notify(ru?'Экспорт данных...':'Ma\'lumotlar eksport qilinmoqda...')} className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                        <Download className="w-4 h-4" />{ru?'Экспорт данных':'Ma\'lumotlarni eksport'}
                    </button>
                    <button onClick={() => notify(ru?'Создание отчёта...':'Hisobot yaratilmoqda...')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm shadow-indigo-200">
                        <FileText className="w-4 h-4" />{ru?'Создать отчёт':'Hisobot yaratish'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-6">
                        {[
                            {value:'overview',    label:ru?'Обзор':'Umumiy'},
                            {value:'performance', label:ru?'Успеваемость':"O'zlashtirish"},
                            {value:'activity',    label:ru?'Активность':'Faollik'},
                            {value:'courses',     label:ru?'Курсы':'Kurslar'},
                            {value:'simulations', label:ru?'Симуляции':'Simulyatsiyalar'},
                            {value:'tasks',       label:ru?'Задания и тесты':'Topshiriqlar'},
                            {value:'reports',     label:ru?'Отчёты':'Hisobotlar'},
                        ].map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700 font-medium text-sm whitespace-nowrap">
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400" /><span>01.05.2025 – 24.05.2025</span>
                </div>
                {[ru?'Курс: Все':'Kurs: Barcha', ru?'Группа: Все':'Guruh: Barcha', ru?'Модуль: Все':'Modul: Barcha'].map((f, i) => (
                    <select key={i} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>{f}</option>
                    </select>
                ))}
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />{ru?'Сбросить':'Qayta tiklash'}
                </button>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
}
