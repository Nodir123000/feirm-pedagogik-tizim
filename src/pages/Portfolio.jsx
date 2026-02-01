import { useState, useEffect } from 'react';
import { fetchPortfolioItems, deletePortfolioItem } from '@/entities/PortfolioItem';
import { fetchStudents } from '@/entities/Student';
import {
    FolderOpen,
    Search,
    Plus,
    Trash2,
    Filter,
    RefreshCcw,
    Loader2,
    FileText,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    Eye,
    Download,
    ExternalLink,
    Lock,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Portfolio() {
    const [items, setItems] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [language, setLanguage] = useState('uz_lat');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [portfolioData, studentsData] = await Promise.all([
                fetchPortfolioItems(),
                fetchStudents()
            ]);
            setItems(portfolioData || []);
            setStudents(studentsData || []);
        } catch (err) {
            console.error('Failed to load portfolio items:', err);
            setError('Could not load portfolio data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Remove this item from the portfolio?')) {
            try {
                await deletePortfolioItem(id);
                setItems(items.filter(i => i.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete item.');
            }
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.full_name : 'Unknown Student';
    };

    const getItemIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'image': return <ImageIcon className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'link': return <LinkIcon className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const filteredItems = items.filter(item => {
        const title = item[`title_${language}`] || item.title_uz_lat || '';
        const studentName = getStudentName(item.student_id);
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || item.item_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const types = ['All', ...new Set(items.map(i => i.item_type).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FolderOpen className="w-8 h-8 text-blue-600" />
                        Portfolios
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Showcase of student achievements, research work, and simulation breakthroughs.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or student..."
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

            {/* Portfolio Items Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium font-bold uppercase tracking-widest text-[10px]">Curation in progress...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">Empty portfolio</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-all group overflow-hidden border-b-4 border-b-blue-500">
                            <div className="relative h-48 bg-gray-900 overflow-hidden">
                                {item.file_url ? (
                                    <img src={item.file_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                                        <FolderOpen className="w-16 h-16 text-white opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
                                        {getItemIcon(item.item_type)}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className={cn(
                                        "p-1.5 rounded-full",
                                        item.visibility === 'Public' ? "bg-emerald-500" : "bg-amber-500"
                                    )}>
                                        {item.visibility === 'Public' ? <Globe className="w-3.5 h-3.5 text-white" /> : <Lock className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
                                    <h3 className="text-white font-black leading-tight mb-1">{item[`title_${language}`] || item.title_uz_lat || 'Research Paper'}</h3>
                                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider">{getStudentName(item.student_id)}</p>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed font-medium">
                                    {item.description || 'No detailed description provided for this portfolio entry.'}
                                </p>
                                <div className="mt-auto flex flex-wrap gap-2 mb-4">
                                    {(item.competencies_demonstrated || 'Critical Thinking, Digital Literacy').split(',').map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold text-gray-500 rounded uppercase tracking-tighter">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Download">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="External link">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}