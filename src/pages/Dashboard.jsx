import { useEffect, useState } from 'react';
import { fetchStudents } from '@/entities/Student';
import { fetchLearningModules } from '@/entities/LearningModule';
import { fetchSimulationScenarios } from '@/entities/SimulationScenario';
import { fetchReflections } from '@/entities/Reflection';
import {
    Users,
    BookOpen,
    Gamepad2,
    TrendingUp,
    Sparkles,
    Brain,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import FEIRMFlowDiagram from '@/components/dashboard/FEIRMFlowDiagram';
import CompetencyRadar from '@/components/dashboard/CompetencyRadar';
import { useLanguage } from '@/components/shared/LanguageContext';

export default function Dashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        students: 0,
        activeStudents: 0,
        modules: 0,
        activeModules: 0,
        simulations: 0,
        complexScenarios: 0,
        avgProgress: 0,
        reflections: 0,
        pendingReflections: 0,
        atRiskStudents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            const [studentsData, modulesData, simulationsData, reflectionsData] = await Promise.all([
                fetchStudents(),
                fetchLearningModules(),
                fetchSimulationScenarios(),
                fetchReflections()
            ]);

            const students = studentsData || [];
            const modules = modulesData || [];
            const simulations = simulationsData || [];
            const reflections = reflectionsData || [];

            const avgProg = students.length
                ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length)
                : 0;

            const atRisk = students.filter(s => (s.progress || 0) < 50).length;

            setStats({
                students: students.length,
                activeStudents: Math.round(students.length * 0.85), // Client-side calculation/mock
                modules: modules.length,
                activeModules: modules.filter(m => m.is_active).length,
                simulations: simulations.length,
                complexScenarios: simulations.filter(s => s.difficulty_level === 'Hard').length,
                avgProgress: avgProg,
                reflections: reflections.length,
                pendingReflections: 2, // Mock for now
                atRiskStudents: atRisk
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-medium text-gray-600">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-100">
                        <Sparkles className="w-3 h-3" />
                        {t('hero_badge')}
                    </div>

                    <div className="space-y-2 max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {t('feirm_title')}
                        </h1>
                        <p className="text-blue-100/80 text-lg">
                            {t('feirm_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        {/* Card 1: Facilitator */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                            <Users className="w-6 h-6 text-blue-300 mb-2" />
                            <h3 className="font-semibold text-white">{t('hero_facilitator')}</h3>
                            <p className="text-xs text-blue-100/70 mt-1">{t('hero_facilitator_desc')}</p>
                        </div>

                        {/* Card 2: Simulation */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                            <Sparkles className="w-6 h-6 text-indigo-300 mb-2" />
                            <h3 className="font-semibold text-white">{t('hero_simulation')}</h3>
                            <p className="text-xs text-blue-100/70 mt-1">{t('hero_simulation_desc')}</p>
                        </div>

                        {/* Card 3: Trajectories */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                            <TrendingUp className="w-6 h-6 text-amber-300 mb-2" />
                            <h3 className="font-semibold text-white">{t('hero_trajectories')}</h3>
                            <p className="text-xs text-blue-100/70 mt-1">{t('hero_trajectories_desc')}</p>
                        </div>

                        {/* Card 4: Monitoring */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                            <Brain className="w-6 h-6 text-emerald-300 mb-2" />
                            <h3 className="font-semibold text-white">{t('hero_monitoring')}</h3>
                            <p className="text-xs text-blue-100/70 mt-1">{t('hero_monitoring_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - 6 Panels */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard
                    title={t('total_students')}
                    value={stats.students}
                    subtitle={`${stats.activeStudents} ${t('active')}`}
                    icon={Users}
                    color="blue"
                    trend={12}
                />
                <StatCard
                    title={t('active_modules')}
                    value={stats.modules}
                    subtitle={`${stats.activeModules} ${t('active')}`}
                    icon={BookOpen}
                    color="emerald"
                    trend={5}
                />
                <StatCard
                    title={t('simulations')}
                    value={stats.simulations}
                    subtitle={`${stats.complexScenarios} ${t('hard_level')}`}
                    icon={Gamepad2}
                    color="violet"
                />
                <StatCard
                    title={t('average_progress')}
                    value={`${stats.avgProgress}%`}
                    subtitle={t('global_indicator')}
                    icon={TrendingUp}
                    color="amber"
                    trend={8}
                />
                <StatCard
                    title={t('reflections')}
                    value={stats.reflections}
                    subtitle={`${stats.pendingReflections} ${t('pending_review')}`}
                    icon={MessageSquare}
                    color="cyan"
                />
                <StatCard
                    title={t('attention_required')}
                    value={stats.atRiskStudents}
                    subtitle={t('at_risk_students')}
                    icon={AlertTriangle}
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Analytics */}
                <ProgressChart title={t('progress_tracking')} />
                <CompetencyRadar />
            </div>

            {/* FEIRM Flow Diagram */}
            <FEIRMFlowDiagram />

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 mr-2 text-yellow-300" />
                            {t('ai_insights')}
                        </div>
                        <h2 className="text-2xl font-bold">{t('optimizing_paths')}</h2>
                        <p className="text-indigo-100 leading-relaxed">
                            {t('insight_text')}
                        </p>
                        <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            {t('generate_recommendations')}
                        </button>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl absolute -top-10 -right-10"></div>
                        <Sparkles className="w-24 h-24 text-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
