import { useState, useEffect } from 'react';
import { fetchSimulationScenarios, deleteSimulationScenario } from '@/entities/SimulationScenario';
import { fetchSimulationResults } from '@/entities/SimulationResult';
import { useLanguage } from '@/components/shared/LanguageContext';
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
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Simulations() {
    const { language } = useLanguage();
    const [scenarios, setScenarios] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [scenariosData, resultsData] = await Promise.all([
                fetchSimulationScenarios(),
                fetchSimulationResults()
            ]);
            setScenarios(scenariosData || []);
            setResults(resultsData || []);
        } catch (err) {
            console.error('Failed to load simulation data:', err);
            setError('Could not load simulation scenarios or results.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scenario?')) {
            try {
                await deleteSimulationScenario(id);
                setScenarios(scenarios.filter(s => s.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete scenario.');
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Gamepad2 className="w-8 h-8 text-purple-600" />
                        Simulations
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Interactive industry scenarios and AI-powered performance analytics.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        New Scenario
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <Gamepad2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Scenarios</p>
                        <p className="text-2xl font-bold text-gray-900">{scenarios.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Attempts</p>
                        <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {results.length > 0
                                ? (results.reduce((acc, r) => acc + (parseFloat(r.score) || 0), 0) / results.length).toFixed(1)
                                : 'N/A'
                            }%
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search scenarios..."
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
                                <option key={diff} value={diff}>{diff}</option>
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
                    <p className="text-gray-500 font-medium animate-pulse">Loading simulation data...</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-red-200">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">{error}</p>
                    <button onClick={loadData} className="mt-4 text-purple-600 font-medium hover:underline">Retry</button>
                </div>
            ) : filteredScenarios.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <Gamepad2 className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">No scenarios matching criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredScenarios.map((scenario) => {
                        const scenarioResults = getResultsForScenario(scenario.id);
                        const title = scenario[`title_${language}`] || scenario.title_uz_lat || 'Untitled Scenario';

                        return (
                            <div key={scenario.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:border-purple-200 transition-all group">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                                                <p className="text-xs text-gray-500 font-medium">{scenario.scenario_type || 'Industrial'}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-2 px-1.5 rounded-md text-[10px] font-bold uppercase",
                                            scenario.difficulty_level === 'High' ? "bg-red-50 text-red-600" :
                                                scenario.difficulty_level === 'Medium' ? "bg-orange-50 text-orange-600" :
                                                    "bg-blue-50 text-blue-600"
                                        )}>
                                            {scenario.difficulty_level || 'Normal'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                                        {scenario[`description_${language}`] || scenario.description_uz_lat || 'Ready for simulation exercise.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{scenario.simulation_duration_minutes || 45} mins</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <BrainCircuit className="w-3.5 h-3.5 text-gray-400" />
                                            <span>AI Integrated</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                {i}
                                            </div>
                                        ))}
                                        {scenarioResults.length > 3 && (
                                            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                +{scenarioResults.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <button className="flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 gap-1 uppercase tracking-tight">
                                        Analyze Results
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}