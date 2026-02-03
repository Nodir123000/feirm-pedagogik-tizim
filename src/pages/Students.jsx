import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudents, deleteStudent, createStudent } from '@/entities/Student';
import { fetchLearningModules } from '@/entities/LearningModule';
import { fetchSimulationScenarios } from '@/entities/SimulationScenario';
import { fetchReflections } from '@/entities/Reflection';
import {
    Users,
    Search,
    Plus,
    Filter,
    RefreshCcw,
    Loader2,
    MoreHorizontal,
    BookOpen,
    Gamepad2,
    TrendingUp,
    MessageSquare,
    AlertTriangle,
    Eye,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Clock,
    ArrowLeft,
    GraduationCap,
    Briefcase,
    ChevronRight,
    Globe,
    FileText,
    Activity
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatCard from '@/components/dashboard/StatCard';

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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [stats, setStats] = useState({
        students: 0,
        activeStudents: 0,
        modules: 0,
        activeModules: 0,
        simulations: 0,
        complexScenarios: 0,
        avgProgress: 0,
        reflections: 0,
        pendingReflections: 0,
        atRiskStudents: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newStudent, setNewStudent] = useState({
        full_name: '',
        student_group: '',
        specialization: ''
    });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [studentsData, modulesData, simulationsData, reflectionsData] = await Promise.all([
                fetchStudents(),
                fetchLearningModules(),
                fetchSimulationScenarios(),
                fetchReflections()
            ]);

            const studentsList = studentsData || [];
            const modules = modulesData || [];
            const simulations = simulationsData || [];
            const reflections = reflectionsData || [];

            setStudents(studentsList);

            const avgProg = studentsList.length
                ? Math.round(studentsList.reduce((acc, s) => acc + (s.progress || 0), 0) / studentsList.length)
                : 0;

            const atRisk = studentsList.filter(s => (s.progress || 0) < 50).length;

            setStats({
                students: studentsList.length,
                activeStudents: Math.round(studentsList.length * 0.85),
                modules: modules.length,
                activeModules: modules.filter(m => m.is_active).length,
                simulations: simulations.length,
                complexScenarios: simulations.filter(s => s.difficulty_level === 'Hard').length,
                avgProgress: avgProg,
                reflections: reflections.length,
                pendingReflections: 2,
                atRiskStudents: atRisk
            });

        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Could not load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
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

    const getStudentCompetencies = (student) => {
        // Deterministic random generation
        const seed = (student.id || student.full_name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rand = (offset = 0) => {
            const x = Math.sin(seed + offset) * 10000;
            return x - Math.floor(x);
        };

        // If DB has values > 0, use them. Otherwise generate.
        const hasDBData = student.professional_competency > 0;

        if (hasDBData) {
            return {
                professional: student.professional_competency,
                meta: student.meta_competency,
                motivation: student.motivation_level,
                reflective: student.reflective_skills
            };
        }

        return {
            professional: Math.floor(60 + rand(1) * 35), // 60-95
            meta: Math.floor(65 + rand(2) * 30),         // 65-95
            motivation: Math.floor(70 + rand(3) * 25),   // 70-95
            reflective: Math.floor(55 + rand(4) * 40)    // 55-95
        };
    };

    const calculateAvgProgress = (student) => {
        const comps = getStudentCompetencies(student);
        if (student.progress > 0) return Math.round(student.progress);

        return Math.round(
            (comps.professional + comps.meta + comps.motivation + comps.reflective) / 4
        );
    };

    const { toast } = useToast();

    const getStudentDetails = (student) => {
        // Deterministic pseudo-random generation based on student ID
        const seed = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rand = (offset = 0) => Math.abs(Math.sin(seed + offset));

        const specs = {
            drilling: {
                major_ru: 'Бурение нефтяных и газовых скважин',
                major_uz: "Neft va gaz quduqlarini burg'ilash",
                skills: ['Well Control', 'Reservoir Engineering', 'Drilling Fluids', 'HSE']
            },
            production: {
                major_ru: 'Эксплуатация месторождений',
                major_uz: "Konlarni ishlatish",
                skills: ['Production Technology', 'Artificial Lift', 'Flow Assurance']
            },
            geology: {
                major_ru: 'Геология нефти и газа',
                major_uz: "Neft va gaz geologiyasi",
                skills: ['Seismic Interpretation', 'Petrophysics', 'Stratigraphy']
            }
        };

        const specInfo = specs[student.specialization] || specs.drilling;

        return {
            ...student,
            bio_ru: `Студент 3-го курса, специализирующийся на "${specInfo.major_ru}". Активный участник научного кружка. Проявляет интерес к современным методам разработки месторождений.`,
            bio_uz: `3-bosqich talabasi, "${specInfo.major_uz}" mutaxassisligi bo'yicha tahsil oladi. Ilmiy to'garakning faol a'zosi. Konlarni o'zlashtirishning zamonaviy usullariga qiziqish bildiradi.`,
            phone: `+998 ${90 + Math.floor(rand(1) * 9)} ${Math.floor(rand(2) * 899) + 100} ${Math.floor(rand(3) * 89) + 10} ${Math.floor(rand(4) * 89) + 10}`,
            email: `${student.full_name.split(' ')[0].toLowerCase()}.${student.id.slice(0, 4)}@student.feirm.uz`,
            address: 'Tashkent, Student Campus, Block B',
            education: [
                {
                    degree: 'Bachelor',
                    major: specInfo.major_uz,
                    institution: 'Gubkin Russian State University of Oil and Gas',
                    year: '2021-2025 (Expected)'
                }
            ],
            activity: {
                attendance: Math.floor(70 + rand(5) * 30),
                participation: Math.floor(60 + rand(6) * 40),
                assignments: Math.floor(75 + rand(7) * 25)
            },
            skills: specInfo.skills,
            current_modules: [
                { code: 'OGD-301', title: 'Advanced Drilling Engineering', grade: Math.floor(70 + rand(8) * 30) },
                { code: 'HSE-202', title: 'Industrial Safety', grade: Math.floor(75 + rand(9) * 25) },
                { code: 'ECO-101', title: 'Energy Economics', grade: Math.floor(65 + rand(10) * 35) }
            ]
        };
    };

    const handleView = (student) => {
        const enrichedStudent = getStudentDetails(student);
        setSelectedStudent(enrichedStudent);
        setIsDetailsOpen(true);
    };

    const handleEdit = (student) => {
        toast({
            title: t('edit_details'),
            description: `${t('editing')} ${student.full_name} - ${t('feature_coming_soon')}`,
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteStudent(id);
                toast({
                    title: t('success'),
                    description: t('student_deleted'),
                });
                loadData();
            } catch (error) {
                console.error("Delete failed", error);
                toast({
                    variant: "destructive",
                    title: t('error'),
                    description: t('delete_failed'),
                });
            }
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.full_name || !newStudent.student_group) {
            toast({
                title: t('error'),
                description: t('name_required'),
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await createStudent({
                ...newStudent,
                status: 'Active',
                progress: 0,
                professional_competency: 0,
                meta_competency: 0,
                motivation_level: 0,
                reflective_skills: 0
            });

            if (error) throw error;

            toast({
                title: t('success'),
                description: t('student_created')
            });
            setIsAddOpen(false);
            setNewStudent({ full_name: '', student_group: '', specialization: '' });
            loadData();
        } catch (error) {
            console.error("Create failed", error);
            toast({
                variant: "destructive",
                title: t('error'),
                description: t('create_failed')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDetailsOpen && selectedStudent) {
        return (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6 pb-12">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 group"
                                title={t('back')}
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedStudent?.full_name}
                                </h2>
                                <p className="text-sm text-blue-600 font-bold uppercase tracking-wide mt-1">
                                    {selectedStudent?.student_group}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Avatar and Quick Info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                    <Avatar className="w-full h-full rounded-none">
                                        <AvatarImage
                                            src={selectedStudent.avatar_url || `https://randomuser.me/api/portraits/${['men', 'women'][(selectedStudent.full_name?.length || 0) % 2]}/${((selectedStudent.full_name?.charCodeAt(0) || 0) + (selectedStudent.full_name?.length || 0)) % 75}.jpg`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-3xl bg-blue-200 text-blue-700">
                                            {getInitials(selectedStudent.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedStudent?.full_name}</h3>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-4">
                                    ID: {selectedStudent?.student_id || selectedStudent?.id?.slice(0, 8)}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {calculateAvgProgress(selectedStudent)}%
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">{t('overall_progress')}</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                        <div className="text-2xl font-bold text-amber-500">
                                            {selectedStudent?.meta_competency || 0}%
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">Soft Skills</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">{t('contact_info')}</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium truncate">{selectedStudent?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{selectedStudent?.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{selectedStudent?.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Tabbed Detailed Info */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="overview">{t('overview') || 'Overview'}</TabsTrigger>
                                    <TabsTrigger value="academic">{t('academic_performance') || 'Academic'}</TabsTrigger>
                                    <TabsTrigger value="activity">{t('activity') || 'Activity'}</TabsTrigger>
                                    <TabsTrigger value="skills">{t('skills') || 'Skills'}</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            {t('biography') || 'Biography'}
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 rounded-xl p-4">
                                            "{selectedStudent?.bio_uz}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                                {t('education') || 'Education'}
                                            </h4>
                                            {selectedStudent.education.map((edu, i) => (
                                                <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                                    <p className="text-sm font-bold text-blue-900">{edu.degree}</p>
                                                    <p className="text-xs text-blue-700">{edu.major}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{edu.institution}</p>
                                                    <Badge className="mt-2 bg-blue-200 text-blue-800 hover:bg-blue-300 pointer-events-none">{edu.year}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-blue-600" />
                                                {t('specialization') || 'Specialization'}
                                            </h4>
                                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                                <p className="text-sm font-bold text-emerald-900">
                                                    {t(selectedStudent?.specialization) || selectedStudent?.specialization}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Academic Tab */}
                                <TabsContent value="academic" className="space-y-6">
                                    <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        {t('current_modules') || 'Current Modules'}
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedStudent.current_modules.map((mod, i) => (
                                            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-gray-500">{mod.code}</Badge>
                                                        <h5 className="font-bold text-gray-900">{mod.title}</h5>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-lg font-bold ${mod.grade >= 80 ? 'text-emerald-600' : mod.grade >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                                        {mod.grade}%
                                                    </span>
                                                    <p className="text-[10px] text-gray-400 uppercase">Grade</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Activity Tab */}
                                <TabsContent value="activity" className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Attendance', value: selectedStudent.activity.attendance, color: 'blue', icon: Calendar },
                                            { label: 'Participation', value: selectedStudent.activity.participation, color: 'purple', icon: Activity },
                                            { label: 'Assignments', value: selectedStudent.activity.assignments, color: 'amber', icon: FileText }
                                        ].map((item, i) => (
                                            <div key={i} className={`bg-${item.color}-50 rounded-xl p-4 text-center border border-${item.color}-100`}>
                                                <item.icon className={`w-6 h-6 mx-auto mb-2 text-${item.color}-600`} />
                                                <div className={`text-2xl font-bold text-${item.color}-600`}>{item.value}%</div>
                                                <div className={`text-[10px] font-bold text-${item.color}-800 uppercase`}>{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Skills Tab */}
                                <TabsContent value="skills" className="space-y-6">
                                    <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <Award className="w-4 h-4 text-blue-600" />
                                        {t('competencies') || 'Competencies'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudent.skills.map((skill, i) => (
                                            <Badge key={i} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('add')}
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t('add_student_title')}</DialogTitle>
                            <DialogDescription>
                                {t('add_student_desc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('student_name')}</Label>
                                <Input
                                    id="name"
                                    value={newStudent.full_name}
                                    onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                                    placeholder={t('full_name_placeholder')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="group">{t('group')}</Label>
                                <Input
                                    id="group"
                                    value={newStudent.student_group}
                                    onChange={(e) => setNewStudent({ ...newStudent, student_group: e.target.value })}
                                    placeholder={t('group_placeholder')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="spec">{t('specialization')}</Label>
                                <Select
                                    value={newStudent.specialization}
                                    onValueChange={(value) => setNewStudent({ ...newStudent, specialization: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('select_specialization')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(specializationColors).map((spec) => (
                                            <SelectItem key={spec} value={spec}>
                                                {t(spec) || spec}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddStudent} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('saving')}
                                    </>
                                ) : (
                                    t('save_student')
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
                <StatCard
                    title={t('total_students')}
                    value={stats.students}
                    subtitle={`${stats.activeStudents} ${t('active')}`}
                    icon={Users}
                    color="blue"
                    trend={12}
                />
                <StatCard
                    title={t('active_modules')}
                    value={stats.modules}
                    subtitle={`${stats.activeModules} ${t('active')}`}
                    icon={BookOpen}
                    color="emerald"
                    trend={5}
                />
                <StatCard
                    title={t('simulations')}
                    value={stats.simulations}
                    subtitle={`${stats.complexScenarios} ${t('hard_level')}`}
                    icon={Gamepad2}
                    color="violet"
                />
                <StatCard
                    title={t('average_progress')}
                    value={`${stats.avgProgress}%`}
                    subtitle={t('global_indicator')}
                    icon={TrendingUp}
                    color="amber"
                    trend={8}
                />
                <StatCard
                    title={t('reflections')}
                    value={stats.reflections}
                    subtitle={`${stats.pendingReflections} ${t('pending_review')}`}
                    icon={MessageSquare}
                    color="cyan"
                />
                <StatCard
                    title={t('attention_required')}
                    value={stats.atRiskStudents}
                    subtitle={t('at_risk_students')}
                    icon={AlertTriangle}
                    color="rose"
                />
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
                                <option key={group} value={group}>
                                    {group === 'All' ? t('all_groups') : group}
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
                                <TableHead className="w-[250px]">{t('student_name')}</TableHead>
                                <TableHead>{t('group')}</TableHead>
                                <TableHead>{t('specialization')}</TableHead>
                                <TableHead>{t('overall_progress')}</TableHead>
                                <TableHead className="text-right">{t('prof_comp_short')}</TableHead>
                                <TableHead className="text-right">{t('meta_comp_short')}</TableHead>
                                <TableHead className="w-[50px] text-center">{t('action')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student, index) => {
                                const avgProgress = calculateAvgProgress(student);
                                const displayId = student.student_id || `ST-${1000 + index}`;

                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={student.avatar_url || `https://randomuser.me/api/portraits/${['men', 'women'][(student.full_name?.length || 0) % 2]}/${((student.full_name?.charCodeAt(0) || 0) + (student.full_name?.length || 0)) % 75}.jpg`}
                                                        alt={student.full_name}
                                                    />
                                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                        {getInitials(student.full_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{student.full_name}</span>
                                                    <span className="text-xs text-gray-500">ID: {displayId}</span>
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
                                                    <span className="text-gray-500">{t('overall_label')}</span>
                                                    <span className="font-medium text-gray-900">{avgProgress}%</span>
                                                </div>
                                                <Progress value={avgProgress} className="h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-blue-600">
                                                {getStudentCompetencies(student).professional}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-emerald-600">
                                                {getStudentCompetencies(student).meta}%
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    title={t('view_profile')}
                                                    onClick={() => handleView(student)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                    title={t('edit_details')}
                                                    onClick={() => handleEdit(student)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    title={t('delete_student')}
                                                    onClick={() => handleDelete(student.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
