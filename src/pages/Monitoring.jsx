import { useState, useEffect } from 'react';
import { fetchStudents } from '@/entities/Student';
import { fetchAssessments } from '@/entities/Assessment';
import { fetchSimulationResults } from '@/entities/SimulationResult';
import { fetchReflections } from '@/entities/Reflection';
import { useLanguage } from '../components/shared/LanguageContext';
import {
    BarChart3,
    Search,
    RefreshCcw,
    Loader2,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    PieChart,
    LineChart,
    ShieldCheck,
    Zap,
    Globe,
    Gamepad2,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart as ReLineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import StatCard from '@/components/dashboard/StatCard';

export default function Monitoring() {
    const { t } = useLanguage();
    const [data, setData] = useState({
        students: [],
        assessments: [],
        simulations: [],
        reflections: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [studentsData, assessmentsData, simulationsData, reflectionsData] = await Promise.all([
                fetchStudents(),
                fetchAssessments(),
                fetchSimulationResults(),
                fetchReflections()
            ]);
            setData({
                students: studentsData || [],
                assessments: assessmentsData || [],
                simulations: simulationsData || [],
                reflections: reflectionsData || []
            });
        } catch (err) {
            console.error('Failed to load monitoring data:', err);
            setError('System monitoring data currently unavailable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getSystemStatus = () => {
        if (error) return { label: 'Degraded', color: 'red' };
        if (loading) return { label: 'Syncing', color: 'blue' };
        return { label: 'Optimal', color: 'emerald' };
    };

    const status = getSystemStatus();

    // Chart Data calculations
    const avgAssessmentScore = data.assessments.length > 0
        ? (data.assessments.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0) / data.assessments.length).toFixed(1)
        : 0;

    const avgSimulationScore = data.simulations.length > 0
        ? (data.simulations.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0) / data.simulations.length).toFixed(1)
        : 0;

    const chartData = [
        { name: t('type_theory') || 'Theory', value: parseFloat(avgAssessmentScore) },
        { name: t('type_practice') || 'Practice', value: parseFloat(avgSimulationScore) },
        { name: t('type_SoftSkills') || 'Soft Skills', value: 72 },
        { name: t('research') || 'Research', value: 64 },
    ];

    return (
        <div className="space-y-6">
            {/* Header with System Health */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        {t('mpms_dashboard')}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {t('monitoring_subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm",
                        status.color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                            status.color === 'red' ? "bg-red-50 border-red-100 text-red-700" :
                                "bg-blue-50 border-blue-100 text-blue-700"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-${status.color}-600`)} />
                        <span className="text-xs font-black uppercase tracking-widest">{t('system_optimal')}</span>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-500"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Aggregating Analytics...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Metrics Grid - 6 Panels (Students Style) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                        <StatCard
                            title={t('active_students')}
                            value={data.students.length}
                            subtitle={t('live')}
                            icon={Globe}
                            color="blue"
                            trend={12}
                        />
                        <StatCard
                            title={t('academic_throughput')}
                            value={`${avgAssessmentScore}%`}
                            subtitle={t('global_indicator')}
                            icon={Activity}
                            color="emerald"
                            trend={5}
                        />
                        <StatCard
                            title={t('practical_proficiency')}
                            value={`${avgSimulationScore}%`}
                            subtitle={t('global_indicator')}
                            icon={Zap}
                            color="violet"
                            trend={8}
                        />
                        <StatCard
                            title={t('total_assessments')}
                            value={data.assessments.length}
                            subtitle={t('synced')}
                            icon={Clock}
                            color="amber"
                        />
                        <StatCard
                            title={t('simulations')}
                            value={data.simulations.length}
                            subtitle={t('finished')}
                            icon={Gamepad2}
                            color="indigo"
                        />
                        <StatCard
                            title={t('system_activity')}
                            value={data.reflections.length}
                            subtitle={t('reflections')}
                            icon={MessageSquare}
                            color="rose"
                            trend={15}
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-900">{t('competency_map')}</h3>
                                    <p className="text-xs text-gray-500">{t('competency_map_subtitle')}</p>
                                </div>
                                <PieChart className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#f59e0b', '#6366f1'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-900">{t('system_activity')}</h3>
                                    <p className="text-xs text-gray-500">{t('system_activity_subtitle')}</p>
                                </div>
                                <LineChart className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { day: 'Mon', value: 45 },
                                        { day: 'Tue', value: 52 },
                                        { day: 'Wed', value: 48 },
                                        { day: 'Thu', value: 70 },
                                        { day: 'Fri', value: 61 },
                                        { day: 'Sat', value: 32 },
                                        { day: 'Sun', value: 25 },
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* System Logs / Recent Alerts */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900">{t('system_activity_log')}</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[
                                { type: 'success', msg: 'Core API integration verified.', time: 'Just now', icon: ShieldCheck, color: 'emerald' },
                                { type: 'info', msg: 'AI Recommendations engine synchronized.', time: '12 mins ago', icon: Activity, color: 'blue' },
                                { type: 'warning', msg: 'Simulation result delay detected in Node #4', time: '1 hour ago', icon: AlertCircle, color: 'amber' },
                            ].map((log, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-lg", `bg-${log.color}-50 text-${log.color}-600`)}>
                                            <log.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{log.msg}</p>
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{log.time}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-tight">{t('inspect')}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}