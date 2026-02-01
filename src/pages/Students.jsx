import { useState, useEffect } from 'react';
import { fetchStudents } from '@/entities/Student';
import {
    Users,
    Search,
    Plus,
    Filter,
    RefreshCcw,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StudentCard from '@/components/students/StudentCard';
import { useLanguage } from '@/components/shared/LanguageContext';

export default function Students() {
    const { t } = useLanguage();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    const loadStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStudents();
            setStudents(data || []);
        } catch (err) {
            console.error('Failed to load students:', err);
            setError('Could not load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterGroup === 'All' || student.student_group === filterGroup;
        return matchesSearch && matchesFilter;
    });

    const groups = ['All', ...new Set(students.map(s => s.student_group).filter(Boolean))];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-blue-600" />
                        {t('students')}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {t('feirm_subtitle')}
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add')}
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search')}
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
                            value={filterGroup}
                            onChange={(e) => setFilterGroup(e.target.value)}
                        >
                            {groups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={loadStudents}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">{t('loading')}</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">{t('no_data')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStudents.map((student, idx) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            index={idx}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}