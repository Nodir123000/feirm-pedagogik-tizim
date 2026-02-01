import { useState, useEffect } from 'react';
import { fetchSimulationScenarios } from '@/entities/SimulationScenario';
import { fetchAssessments } from '@/entities/Assessment';
import {
    Puzzle,
    Search,
    RefreshCcw,
    Loader2,
    Target,
    Zap,
    Layers,
    FileCode,
    ArrowRight,
    Sparkles,
    Link,
    Table as TableIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SBCM() {
    const [scenarios, setScenarios] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [scenariosData, assessmentsData] = await Promise.all([
                fetchSimulationScenarios(),
                fetchAssessments()
            ]);
            setScenarios(scenariosData || []);
            setAssessments(assessmentsData || []);
        } catch (err) {
            console.error('Failed to load SBCM data:', err);
            setError('Scenario competency mapping data unavailable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Puzzle className="w-8 h-8 text-indigo-600" />
                        SBCM Mapping
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Scenario-Based Competency Management: Linking practical simulations to core professional standards.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                    <Link className="w-4 h-4 mr-2" />
                    Map New Unit
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Resolving competency links...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mapping Table / Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Competency Matrix</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-indigo-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Industrial Linkage</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Scenario</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mapped Competency</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {scenarios.map((scenario, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                            <FileCode className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900">{scenario.title_uz_lat || 'Unit Scenario'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(scenario.related_competencies || 'Technical, Analytical').split(',').map(tag => (
                                                            <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-600 rounded uppercase">
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-tight">Verified</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold">AI Core Mapper</h3>
                            </div>
                            <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                                Our AI engine automatically matches simulation parameters to professional competency frameworks.
                            </p>
                            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                                Run Auto-Map
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Coverage</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Technical', val: 88 },
                                    { label: 'Soft Skills', val: 72 },
                                    { label: 'Ethics', val: 45 },
                                    { label: 'AI Literacy', val: 92 },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <span>{item.label}</span>
                                            <span className="text-gray-900">{item.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${item.val}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}