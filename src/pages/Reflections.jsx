import { useState, useEffect } from 'react';
import { fetchReflections, deleteReflection } from '@/entities/Reflection';
import { fetchStudents } from '@/entities/Student';
import { fetchLearningModules } from '@/entities/LearningModule';
import {
    MessageSquare,
    Search,
    Plus,
    Trash2,
    Filter,
    RefreshCcw,
    Loader2,
    Smile,
    Meh,
    Frown,
    Trophy,
    Target,
    Lightbulb,
    ArrowRight,
    Share2,
    User,
    Book
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Reflections() {
    const [reflections, setReflections] = useState([]);
    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [reflectionsData, studentsData, modulesData] = await Promise.all([
                fetchReflections(),
                fetchStudents(),
                fetchLearningModules()
            ]);
            setReflections(reflectionsData || []);
            setStudents(studentsData || []);
            setModules(modulesData || []);
        } catch (err) {
            console.error('Failed to load reflections data:', err);
            setError('Could not load reflections.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this reflection entry?')) {
            try {
                await deleteReflection(id);
                setReflections(reflections.filter(r => r.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete.');
            }
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.full_name : 'Unknown Student';
    };

    const getModuleTitle = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        return module ? (module.title_uz_lat || module.title_ru || 'Untitled Module') : 'General Reflection';
    };

    const getMoodIcon = (rating) => {
        if (rating >= 4) return <Smile className="w-5 h-5 text-green-500" />;
        if (rating >= 3) return <Meh className="w-5 h-5 text-yellow-500" />;
        return <Frown className="w-5 h-5 text-red-500" />;
    };

    const filteredReflections = reflections.filter(reflection => {
        const studentName = getStudentName(reflection.student_id);
        const content = reflection.content || '';
        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || reflection.reflection_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const types = ['All', ...new Set(reflections.map(r => r.reflection_type).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                        Reflections
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Student insights, achievements, and reflective learning journey logs.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by student or content..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        onClick={loadData}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Reflections Feed */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Loading reflections...</p>
                </div>
            ) : filteredReflections.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">No reflections found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReflections.map((reflection) => (
                        <div key={reflection.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:border-blue-200 transition-all group overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 ring-2 ring-blue-100">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900">{getStudentName(reflection.student_id)}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{reflection.reflection_type || 'Weekly'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {reflection.is_shared && (
                                            <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400" title="Shared with community">
                                                <Share2 className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                        <div className="p-1.5 bg-gray-50 rounded-lg">
                                            {getMoodIcon(reflection.mood_rating)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            <Book className="w-3 h-3" /> Module
                                        </div>
                                        <p className="text-sm font-semibold text-blue-600">{getModuleTitle(reflection.module_id)}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-700 italic leading-relaxed">
                                            "{reflection.content || 'No content written yet...'}"
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase">
                                            <Trophy className="w-3 h-3" /> Achievement
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-1 font-medium">{reflection.achievements || 'N/A'}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold text-amber-600 uppercase">
                                            <Target className="w-3 h-3" /> Challenge
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-1 font-medium">{reflection.challenges || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Lightbulb className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-tight">AI insight included</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDelete(reflection.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center text-xs font-bold text-blue-600 hover:translate-x-0.5 transition-transform gap-1 uppercase">
                                        Full Log
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}