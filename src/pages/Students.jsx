import { useState, useEffect } from 'react';
import { fetchStudents, deleteStudent } from '@/entities/Student';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Trash2,
    UserCircle,
    Filter,
    RefreshCcw,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Students() {
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
            setError('Could not load students. Please ensure the API is reachable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(id);
                setStudents(students.filter(s => s.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete student.');
            }
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterGroup === 'All' || student.group === filterGroup;
        return matchesSearch && matchesFilter;
    });

    const groups = ['All', ...new Set(students.map(s => s.group).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-blue-600" />
                        Students
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage student records, track performance, and individual trajectories.
                    </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name..."
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
                        title="Refresh"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-500 font-medium animate-pulse">Fetching students...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
                            <RefreshCcw className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-gray-900 font-semibold">{error}</p>
                        <button
                            onClick={loadStudents}
                            className="mt-4 text-blue-600 hover:underline font-medium"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                            <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-semibold">No students found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Group</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-50">
                                                    {student.avatar_url ? (
                                                        <img src={student.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        student.full_name?.charAt(0) || 'S'
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">{student.full_name}</div>
                                                    <div className="text-xs text-gray-500">{student.email || 'No email provided'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                {student.group || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.specialization || 'General Education'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${student.progress || (Math.random() * 100).toFixed(0)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600">
                                                    <UserCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            {!loading && !error && filteredStudents.length > 0 && (
                <div className="text-sm text-gray-500 font-medium bg-white px-6 py-3 rounded-lg border border-gray-100 shadow-sm inline-block">
                    Showing <span className="text-gray-900">{filteredStudents.length}</span> out of <span className="text-gray-900">{students.length}</span> students
                </div>
            )}
        </div>
    );
}