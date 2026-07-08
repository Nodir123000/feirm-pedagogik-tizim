import { useState, useEffect } from 'react';
import { fetchSimulationScenarios, deleteSimulationScenario } from '@/entities/SimulationScenario';
import { fetchSimulationResults } from '@/entities/SimulationResult';
import { useLanguage } from '@/components/shared/LanguageContext';
import SimulationAnalytics from '@/components/simulation/SimulationAnalytics';
import AnyLogicViewer from '@/components/simulation/AnyLogicViewer';
import {
    Gamepad2,
    Search,
    Plus,
    MoreVertical,
    Trash2,
    Filter,
    RefreshCcw,
    Loader2,
    Clock,
    Target,
    Trophy,
    Activity,
    ChevronRight,
    BrainCircuit,
    AlertCircle,
    TrendingUp,
    Play,
    Zap,
    ExternalLink
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { cn } from '@/lib/utils';

export default function Simulations() {
    const { language, t } = useLanguage();
    const [scenarios, setScenarios] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [selectedScenarioForAnalysis, setSelectedScenarioForAnalysis] = useState(null);
    const [activeSimulation, setActiveSimulation] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [scenariosData, resultsData] = await Promise.all([
                fetchSimulationScenarios(),
                fetchSimulationResults()
            ]);

            const mockScenarios = [
                {
                    id: 'sim-mock-1',
                    title_uz_lat: 'Raqamli egizak simulyatsiyasi',
                    title_ru: 'Цифровой двойник-симуляция',
                    description_uz_lat: 'Burg\'ilash qurilmasining raqamli egizagi yordamida jarayonlarni optimallashtirish.',
                    description_ru: 'Оптимизация процессов с использованием цифрового двойника буровой установки.',
                    scenario_type: 'Industrial',
                    difficulty_level: 'High',
                    simulation_duration_minutes: 60,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'sim-mock-2',
                    title_uz_lat: 'Burg\'ilash parametrlarini optimallashtirish',
                    title_ru: 'Оптимизация параметров бурения',
                    description_uz_lat: 'Maksimal samaradorlikka erishish uchun burg\'ilash parametrlarini real vaqt rejimida sozlash.',
                    description_ru: 'Настройка параметров бурения в реальном времени для достижения максимальной эффективности.',
                    scenario_type: 'Analytical',
                    difficulty_level: 'Medium',
                    simulation_duration_minutes: 45,
                    created_at: new Date().toISOString()
                }
            ];

            setScenarios((scenariosData && scenariosData.length > 0) ? [...scenariosData, ...mockScenarios] : mockScenarios);
            setResults(resultsData || []);
        } catch (err) {
            console.error('Failed to load simulation data:', err);
            setError(t('load_error_simulations'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_scenario'))) {
            try {
                await deleteSimulationScenario(id);
                setScenarios(scenarios.filter(s => s.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert(t('delete_scenario_failed'));
            }
        }
    };

    const filteredScenarios = scenarios.filter(scenario => {
        const title = scenario[`title_${language}`] || scenario.title_uz_lat || '';
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterDifficulty === 'All' || scenario.difficulty_level === filterDifficulty;
        return matchesSearch && matchesFilter;
    });

    const difficulties = ['All', ...new Set(scenarios.map(s => s.difficulty_level).filter(Boolean))];

    const getResultsForScenario = (scenarioId) => {
        return results.filter(r => r.scenario_id === scenarioId);
    };

    if (selectedScenarioForAnalysis) {
        return (
            <div className="animate-in fade-in duration-300">
                <SimulationAnalytics
                    scenario={selectedScenarioForAnalysis}
                    onClose={() => setSelectedScenarioForAnalysis(null)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Gamepad2 className="w-8 h-8 text-purple-600" />
                        {t('simulations')}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {t('simulations_subtitle')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('new_scenario')}
                    </button>
                </div>
            </div>

            {/* ── Powered by AnyLogic Banner ── */}
            <a
                href="https://www.anylogic.ru/oil-and-gas/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 w-full px-5 py-3.5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-blue-100">
                        <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-blue-900">
                            {language === 'ru' ? 'Симуляции работают на базе AnyLogic — мирового лидера в нефтегазовом моделировании' : 'Simulyatsiyalar AnyLogic asosida ishlaydi — neft-gaz modellashtirish jahon lideri'}
                        </div>
                        <div className="text-xs text-blue-600 mt-0.5">
                            {language === 'ru' ? 'Используется в 40% компаний Fortune 100 · Нажмите, чтобы узнать больше' : 'Fortune 100 kompaniyalarining 40%ida qo\'llaniladi · Ko\'proq bilish uchun bosing'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 group-hover:text-blue-900 whitespace-nowrap flex-shrink-0">
                    anylogic.ru
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
            </a>

            {/* Stats Overview - 6 Panels */}
            {/* Stats Overview - 6 Panels */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                <StatCard
                    title={t('active_scenarios')}
                    value={scenarios.length}
                    subtitle={t('total_active')}
                    icon={Gamepad2}
                    color="violet"
                    trend={12}
                />
                <StatCard
                    title={t('total_attempts')}
                    value={results.length}
                    subtitle={t('finished')}
                    icon={Activity}
                    color="blue"
                    trend={8}
                />
                <StatCard
                    title={t('avg_score')}
                    value={`${results.length > 0 ? (results.reduce((acc, r) => acc + (parseFloat(r.score) || 0), 0) / results.length).toFixed(1) : '0'}%`}
                    subtitle={t('global_indicator')}
                    icon={Trophy}
                    color="emerald"
                    trend={5}
                />
                <StatCard
                    title={t('completion_rate')}
                    value="89%"
                    subtitle={t('finished')}
                    icon={TrendingUp}
                    color="amber"
                />
                <StatCard
                    title={t('avg_duration')}
                    value={`42 ${t('minutes')}`}
                    subtitle={t('global_indicator')}
                    icon={Clock}
                    color="cyan"
                />
                <StatCard
                    title={t('safety_rating')}
                    value="94%"
                    subtitle={t('safety_compliance')}
                    icon={Target}
                    color="rose"
                />
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search_scenarios_placeholder')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            className="bg-transparent text-sm font-medium focus:outline-none"
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                        >
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>
                                    {t(diff === 'All' ? 'all_types' : `diff_${diff}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Scenarios Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">{t('loading_simulations')}</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-red-200">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">{error}</p>
                    <button onClick={loadData} className="mt-4 text-purple-600 font-medium hover:underline">{t('try_again')}</button>
                </div>
            ) : filteredScenarios.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <Gamepad2 className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">{t('no_scenarios')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredScenarios.map((scenario) => {
                        const scenarioResults = getResultsForScenario(scenario.id);


                        // Robust Translation Helper
                        const getTranslatedTitle = (text, lang) => {
                            if (!text) return text;
                            const lower = text.toLowerCase();

                            if (lang === 'uz_cyr') {
                                if (lower.includes('favqulodda') && lower.includes("to'xtatish")) {
                                    return "Фавқулодда вазиятда бурғулашни тўхтатиш";
                                }
                                if (lower.includes('gaz separator') || lower.includes('gaz separtor')) {
                                    return "Газ сепараторини созлаш";
                                }
                            }
                            if (lang === 'ru') {
                                if (lower.includes('favqulodda') && lower.includes("to'xtatish")) {
                                    return "Аварийная остановка бурения";
                                }
                                if (lower.includes('gaz separator')) {
                                    return "Настройка газового сепаратора";
                                }
                            }
                            return null;
                        };

                        const latTitle = scenario.title_uz_lat || scenario.title || '';
                        const title = scenario[`title_${language}`]
                            || getTranslatedTitle(latTitle, language)
                            || latTitle
                            || t('untitled_scenario');


                        // Helper to get image metadata
                        const getScenarioMetadata = (scenTitle) => {
                            const t = scenTitle.toLowerCase();
                            // Specific mapping for user-requested images
                            if (t.includes("favqulodda") || t.includes("аварийная")) return { image: '/emergency_stop.jpg' };
                            if (t.includes("separator") || t.includes("gaz") || t.includes("газ")) return { image: '/gas_separator.jpg' };

                            if (t.includes("raqamli egizak") || t.includes("цифровой двойник")) return { image: '/digital_twin_simulation.png' };
                            if (t.includes("optimallashtirish") || t.includes("оптимизация") || t.includes("parametrlarini")) return { image: '/drilling_optimization.jpg' };

                            // General fallbacks
                            if (t.includes("burg'ulash") || t.includes("drilling")) return { image: '/drilling.jpg' };
                            if (t.includes("processing")) return { image: '/processing.jpg' };
                            return null;
                        };

                        const meta = getScenarioMetadata(latTitle);

                        const efficiencyPct = scenario.efficiency_pct || 78;
                        const effColor = efficiencyPct >= 80 ? '#10b981' : efficiencyPct >= 70 ? '#f59e0b' : '#ef4444';

                        return (
                            <div key={scenario.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all group">
                                {/* ── Image Section ── */}
                                <div className="relative h-44 overflow-hidden bg-gray-100">
                                    <img
                                        src={scenario.preview_image_url || 'https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&q=80&w=800'}
                                        alt={title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Top badges */}
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-green-500 text-white shadow">
                                            {language === 'ru' ? 'Активная' : 'Faol'}
                                        </span>
                                        <span className={cn(
                                            'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow',
                                            scenario.difficulty_level === 'High' ? 'bg-red-500 text-white' :
                                            scenario.difficulty_level === 'Medium' ? 'bg-orange-400 text-white' :
                                            'bg-blue-500 text-white'
                                        )}>
                                            {t(`diff_${scenario.difficulty_level || 'Normal'}`)}
                                        </span>
                                    </div>

                                    {/* Star favorite */}
                                    <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors shadow">
                                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>

                                    {/* Efficiency badge bottom-left */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow text-xs font-bold" style={{ color: effColor }}>
                                            <TrendingUp className="w-3 h-3" />
                                            {language === 'ru' ? `Эффективность ${efficiencyPct}%` : `Samaradorlik ${efficiencyPct}%`}
                                        </div>
                                    </div>

                                    {/* Duration bottom-right */}
                                    <div className="absolute bottom-3 right-3">
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
                                            <Clock className="w-3 h-3" />
                                            {scenario.simulation_duration_minutes || 45} {t('minutes_short')}
                                        </span>
                                    </div>
                                </div>

                                {/* ── Content ── */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors leading-tight">{title}</h3>
                                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-600 uppercase tracking-wide">
                                            {t(`type_${scenario.scenario_type || 'Industrial'}`)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
                                        {scenario[`description_${language}`] || scenario.description_uz_lat || t('ready_for_sim')}
                                    </p>

                                    {/* Competency tag */}
                                    {scenario.related_competencies && (
                                        <div className="mt-2.5 flex gap-1 flex-wrap">
                                            {scenario.related_competencies.split(',').slice(0, 2).map((c, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-medium">{c.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Footer ── */}
                                <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => setSelectedScenarioForAnalysis(scenario)}
                                        className="flex items-center text-xs font-medium text-gray-400 hover:text-purple-600 gap-1 transition-colors"
                                    >
                                        {t('analyze_results')}
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setActiveSimulation(scenario)}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95"
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                        {language === 'ru' ? 'Запустить' : 'Boshlash'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* AnyLogic Simulation Viewer Modal */}
            {activeSimulation && (
                <AnyLogicViewer
                    scenario={activeSimulation}
                    onClose={() => {
                        setActiveSimulation(null);
                        loadData(); // refresh results after completion
                    }}
                    studentId={null}
                />
            )}
        </div>
    );
}