import { useState, useEffect } from 'react';
import { fetchTrajectories, deleteTrajectory } from '@/entities/Trajectory';
import { fetchStudents } from '@/entities/Student';
import {
    Route as RouteIcon,
    Search,
    Plus,
    MoreVertical,
    Trash2,
    Filter,
    RefreshCcw,
    Loader2,
    Sparkles,
    CheckCircle2,
    Circle,
    ChevronRight,
    TrendingUp,
    Brain,
    Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Trajectories() {
    const [trajectories, setTrajectories] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('All');
    const [language, setLanguage] = useState('uz_lat');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [trajectoriesData, studentsData] = await Promise.all([
                fetchTrajectories(),
                fetchStudents()
            ]);
            setTrajectories(trajectoriesData || []);
            setStudents(studentsData || []);
        } catch (err) {
            console.error('Failed to load trajectories data:', err);
            setError('Could not load trajectories or students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this trajectory?')) {
            try {
                await deleteTrajectory(id);
                setTrajectories(trajectories.filter(t => t.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete trajectory.');
            }
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.full_name : 'Unknown Student';
    };

    const filteredTrajectories = trajectories.filter(trajectory => {
        const name = trajectory[`trajectory_name_${language}`] || trajectory.trajectory_name_uz_lat || '';
        const studentName = getStudentName(trajectory.student_id);
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterActive === 'All' ||
            (filterActive === 'Active' && trajectory.is_active === true) ||
            (filterActive === 'Inactive' && trajectory.is_active === false);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <RouteIcon className="w-8 h-8 text-indigo-600" />
                        Learning Trajectories
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Personalized learning paths with AI-driven milestones and success tracking.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Path
                    </button>
                </div>
            </div>

            {/* Trajectory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Paths', value: trajectories.filter(t => t.is_active).length, icon: RouteIcon, color: 'indigo' },
                    { label: 'Avg Progress', value: '68%', icon: TrendingUp, color: 'emerald' },
                    { label: 'AI Recs', value: '24', icon: Brain, color: 'purple' },
                    { label: 'Milestones', value: '128', icon: Flag, color: 'blue' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <stat.icon className={cn("w-5 h-5", `text-${stat.color}-500`)} />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by path name or student..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive Only</option>
                    </select>
                    <button
                        onClick={loadData}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Trajectories Timeline/List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Calculating learning paths...</p>
                </div>
            ) : filteredTrajectories.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <RouteIcon className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">No trajectories found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTrajectories.map((trajectory) => {
                        const name = trajectory[`trajectory_name_${language}`] || trajectory.trajectory_name_uz_lat || 'Unnamed Path';
                        const progress = trajectory.progress_percentage || 0;
                        const studentName = getStudentName(trajectory.student_id);

                        return (
                            <div key={trajectory.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-indigo-200 transition-all group">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                {name}
                                            </h3>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                trajectory.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                                            )}>
                                                {trajectory.is_active ? 'Active' : 'Paused'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-4">
                                            <Circle className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                                            Assigned to: <span className="text-gray-900 font-bold">{studentName}</span>
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-black text-indigo-600">{progress}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-gray-100">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current Stage</p>
                                            <p className="text-sm font-bold text-gray-900">{trajectory.current_stage || 'Foundation'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">AI Recommendations</p>
                                            <div className="flex items-center justify-center gap-1 text-purple-600 font-black">
                                                <Brain className="w-4 h-4" />
                                                <span>3</span>
                                            </div>
                                        </div>
                                        <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trajectory.id)}
                                            className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}