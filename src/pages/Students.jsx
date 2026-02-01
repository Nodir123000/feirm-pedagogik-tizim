import { useState, useEffect } from 'react';
import { fetchStudents } from '@/entities/Student';
import {
    Users,
    Search,
    Plus,
    Filter,
    RefreshCcw,
    Loader2,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/shared/LanguageContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const specializationColors = {
    drilling: 'bg-blue-100 text-blue-700',
    production: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-amber-100 text-amber-700',
    transportation: 'bg-violet-100 text-violet-700',
    geology: 'bg-rose-100 text-rose-700',
};

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

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    };

    const calculateAvgProgress = (student) => {
        return Math.round(
            ((student.professional_competency || 0) +
                (student.meta_competency || 0) +
                (student.motivation_level || 0) +
                (student.reflective_skills || 0)) / 4
        );
    };

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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Student</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Specialization</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead className="text-right">Competencies</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => {
                                const avgProgress = calculateAvgProgress(student);
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={student.avatar_url} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                        {getInitials(student.full_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{student.full_name}</span>
                                                    <span className="text-xs text-gray-500">{student.student_id ? `ID: ${student.student_id}` : 'No ID'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-gray-700">{student.student_group}</span>
                                        </TableCell>
                                        <TableCell>
                                            {student.specialization && (
                                                <Badge className={cn("font-normal", specializationColors[student.specialization])}>
                                                    {t(student.specialization) || student.specialization}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="w-[200px]">
                                            <div className="grid gap-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Overall</span>
                                                    <span className="font-medium text-gray-900">{avgProgress}%</span>
                                                </div>
                                                <Progress value={avgProgress} className="h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="text-xs">
                                                    <span className="text-gray-500 mr-2">Prof.</span>
                                                    <span className="font-medium text-blue-600">{student.professional_competency || 0}%</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500 mr-2">Meta</span>
                                                    <span className="font-medium text-emerald-600">{student.meta_competency || 0}%</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">Delete Student</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
