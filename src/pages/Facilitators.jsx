import { useState, useEffect } from 'react';
import { fetchFacilitators, deleteFacilitator } from '@/entities/Facilitator';
import {
    UserCog,
    Search,
    Plus,
    Trash2,
    Filter,
    RefreshCcw,
    Loader2,
    Mail,
    MapPin,
    Briefcase,
    GraduationCap,
    Users,
    ChevronRight,
    UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Facilitators() {
    const [facilitators, setFacilitators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [language, setLanguage] = useState('uz_lat');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFacilitators();
            setFacilitators(data || []);
        } catch (err) {
            console.error('Failed to load facilitators:', err);
            setError('Could not load facilitators.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Remove this facilitator from the system?')) {
            try {
                await deleteFacilitator(id);
                setFacilitators(facilitators.filter(f => f.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete.');
            }
        }
    };

    const filteredFacilitators = facilitators.filter(facilitator => {
        const matchesSearch = facilitator.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterDept === 'All' || facilitator.department === filterDept;
        return matchesSearch && matchesFilter;
    });

    const departments = ['All', ...new Set(facilitators.map(f => f.department).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <UserCog className="w-8 h-8 text-orange-600" />
                        Facilitators
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage instructors, assign learning groups, and monitor faculty expertise.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Facilitator
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            className="bg-transparent text-sm font-medium focus:outline-none"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
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

            {/* Facilitator Cards */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Fetching faculty profiles...</p>
                </div>
            ) : filteredFacilitators.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <UserCog className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">No facilitators found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFacilitators.map((facilitator) => (
                        <div key={facilitator.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:border-orange-200 transition-all group overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 border-2 border-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                        {facilitator.avatar_url ? (
                                            <img src={facilitator.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            <UserCircle className="w-8 h-8" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight">{facilitator.full_name}</h3>
                                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{facilitator.role_type || 'Professor'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{facilitator.department || 'General Department'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <GraduationCap className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{facilitator.specializations || 'Academic Expert'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{facilitator.assigned_groups || '0'} Assigned Groups</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-3 italic mb-4">
                                    "{facilitator[`bio_${language}`] || facilitator.bio_uz_lat || 'Educator committed to excellence in pedagogical innovation.'}"
                                </p>
                            </div>

                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-orange-600 border border-transparent hover:border-orange-100 transition-all">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-orange-600 border border-transparent hover:border-orange-100 transition-all">
                                        <MapPin className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDelete(facilitator.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors gap-1 uppercase tracking-tight">
                                        Profile
                                        <ChevronRight className="w-4 h-4" />
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