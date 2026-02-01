import { useEffect, useState } from 'react';
import { fetchStudents } from '@/entities/Student';
import { fetchLearningModules } from '@/entities/LearningModule';
import { Users, BookOpen, Gamepad2, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        students: 0,
        modules: 0,
        simulations: 0,
        avgProgress: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            const [studentsData, modulesData] = await Promise.all([
                fetchStudents(),
                fetchLearningModules()
            ]);

            setStats({
                students: studentsData?.length || 0,
                modules: modulesData?.length || 0,
                simulations: 0,
                avgProgress: 75
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    const statCards = [
        { name: 'Total Students', value: stats.students, icon: Users, color: 'blue' },
        { name: 'Learning Modules', value: stats.modules, icon: BookOpen, color: 'green' },
        { name: 'Simulations', value: stats.simulations, icon: Gamepad2, color: 'purple' },
        { name: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, color: 'orange' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">FEIRM Pedagogik Tizim - Overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to FEIRM System</h2>
                <p className="text-gray-600 mb-4">
                    This is a demonstration of the FEIRM (Flexible Educational Individual Reflective Module)
                    pedagogical system. The system supports personalized learning trajectories, competency-based
                    assessment, and reflective learning practices.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Multilingual Support</h3>
                        <p className="text-sm text-blue-700">
                            Content available in Uzbek (Latin), Uzbek (Cyrillic), and Russian
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">AI-Powered Recommendations</h3>
                        <p className="text-sm text-green-700">
                            Personalized learning paths based on student competencies
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2">Simulation-Based Learning</h3>
                        <p className="text-sm text-purple-700">
                            Industry-relevant scenarios for practical skill development
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}