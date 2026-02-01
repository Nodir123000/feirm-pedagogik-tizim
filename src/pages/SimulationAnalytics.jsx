import { useState, useEffect } from 'react';
import { fetchSimulationResults } from '@/entities/SimulationResult';
import { fetchSimulationScenarios } from '@/entities/SimulationScenario';
import { fetchStudents } from '@/entities/Student';
import {
    BarChart3,
    TrendingUp,
    Activity,
    Target,
    Users,
    Award,
    RefreshCcw,
    Loader2,
    PieChart as PieChartIcon,
    Filter,
    Search,
    ChevronRight,
    TrendingDown,
    Timer
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
    PieChart,
    Pie,
    LineChart,
    Line,
    Legend
} from 'recharts';

export default function SimulationAnalytics() {
    const [results, setResults] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [resultsData, scenariosData, studentsData] = await Promise.all([
                fetchSimulationResults(),
                fetchSimulationScenarios(),
                fetchStudents()
            ]);
            setResults(resultsData || []);
            setScenarios(scenariosData || []);
            setStudents(studentsData || []);
        } catch (err) {
            console.error('Failed to load analytics data:', err);
            setError('Could not load simulation analytics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Data processing for charts
    const successCount = results.filter(r => r.success_criteria_met).length;
    const failCount = results.length - successCount;

    const pieData = [
        { name: 'Success', value: successCount, color: '#10b981' },
        { name: 'Needs Retake', value: failCount, color: '#ef4444' }
    ];

    const avgScore = results.length > 0
        ? (results.reduce((acc, r) => acc + (parseFloat(r.score) || 0), 0) / results.length).toFixed(1)
        : 0;

    const avgTime = results.length > 0
        ? (results.reduce((acc, r) => acc + (parseFloat(r.completion_time_minutes) || 0), 0) / results.length).toFixed(1)
        : 0;

    const getStudentName = (id) => students.find(s => s.id === id)?.full_name || 'Anonymous';
    const getScenarioTitle = (id) => scenarios.find(s => s.id === id)?.title_uz_lat || 'Unknown Scenario';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-8 h-8 text-emerald-600" />
                        Simulation Analytics
                    </h1>
                    <p className="mt-1 text-gray-600">
                        In-depth performance data across all industrial simulation exercises and AI assessments.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold text-gray-600"
                >
                    <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    Refresh Data
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Simulation Intel...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4">
                                <Target className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Average Proficiency</p>
                            <p className="text-2xl font-black text-gray-900">{avgScore}%</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4">
                                <Award className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Success Rate</p>
                            <p className="text-2xl font-black text-gray-900">{results.length > 0 ? ((successCount / results.length) * 100).toFixed(0) : 0}%</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg w-fit mb-4">
                                <Timer className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Avg Completion</p>
                            <p className="text-2xl font-black text-gray-900">{avgTime}m</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit mb-4">
                                <Users className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Total Attempts</p>
                            <p className="text-2xl font-black text-gray-900">{results.length}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6">Recent Attempt Scores</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results.slice(0, 10).reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            hide
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, fill: '#10b981' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-6">Success Distribution</h3>
                            <div className="flex-1 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                {pieData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-xs font-bold text-gray-500 uppercase">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent History Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Attempt History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Scenario</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Insights</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {results.slice(0, 10).map((res) => (
                                        <tr key={res.id} className="hover:bg-gray-50 transition-all">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-gray-900">{getStudentName(res.student_id)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getScenarioTitle(res.scenario_id)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-sm font-black",
                                                        parseFloat(res.score) >= 70 ? "text-emerald-600" : "text-amber-600"
                                                    )}>
                                                        {res.score}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                                                {res.completion_time_minutes}m
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}