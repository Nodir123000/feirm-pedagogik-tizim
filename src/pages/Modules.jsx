import { useState, useEffect } from 'react';
import { fetchLearningModules, deleteLearningModule } from '@/entities/LearningModule';
import {
    BookOpen,
    Search,
    Plus,
    MoreVertical,
    Trash2,
    Globe,
    Filter,
    RefreshCcw,
    Loader2,
    Clock,
    BarChart,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modules() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [language, setLanguage] = useState('uz_lat'); // Default language

    const loadModules = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLearningModules();
            setModules(data || []);
        } catch (err) {
            console.error('Failed to load modules:', err);
            setError('Could not load learning modules. Please ensure the API is reachable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadModules();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            try {
                await deleteLearningModule(id);
                setModules(modules.filter(m => m.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete module.');
            }
        }
    };

    const filteredModules = modules.filter(module => {
        const title = module[`title_${language}`] || module.title_uz_lat || '';
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || module.module_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const types = ['All', ...new Set(modules.map(m => m.module_type).filter(Boolean))];

    const languages = [
        { code: 'uz_lat', name: 'O\'zbek (Lotin)' },
        { code: 'uz_cyr', name: 'Ўзбек (Кирилл)' },
        { code: 'ru', name: 'Русский' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-green-600" />
                        Learning Modules
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Comprehensive catalogue of learning modules with multilingual support.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    language === lang.code
                                        ? "bg-green-600 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {lang.code.toUpperCase().replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Module
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            className="bg-transparent text-sm font-medium focus:outline-none"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={loadModules}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                        title="Refresh"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Main Content: Cards Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Fetching learning modules...</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
                        <RefreshCcw className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-900 font-semibold">{error}</p>
                    <button
                        onClick={loadModules}
                        className="mt-4 text-green-600 hover:underline font-medium"
                    >
                        Try again
                    </button>
                </div>
            ) : filteredModules.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold">No modules found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => {
                        const title = module[`title_${language}`] || module.title_uz_lat || 'Untitled Module';
                        const description = module[`description_${language}`] || module.description_uz_lat || 'No description available for this language.';

                        return (
                            <div key={module.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                                <div className="relative h-40 bg-gray-100">
                                    {module.thumbnail_url ? (
                                        <img src={module.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 opacity-80">
                                            <BookOpen className="w-12 h-12 text-white opacity-40" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-white/90 text-green-700 shadow-sm">
                                            {module.module_type || 'Module'}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 bg-white/90 rounded-md shadow-sm hover:bg-white text-gray-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                        {description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {module.duration_hours || 'N/A'} hrs
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <BarChart className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {module.difficulty_level || 'Beginner'}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-gray-50 flex items-center justify-between group/btn">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {module.total_lessons || 10} Lessons
                                    </span>
                                    <button className="flex items-center text-xs font-bold text-green-600 hover:text-green-700 transition-colors uppercase gap-1">
                                        Details
                                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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