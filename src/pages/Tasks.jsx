import { useState } from 'react';
import { useLanguage } from '@/components/shared/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
    ClipboardList,
    CheckCircle2,
    Hourglass,
    CalendarDays,
    Star,
    Search,
    Plus,
    X,
    MoreVertical,
    BarChart,
    Edit3,
    ArrowRight,
    FileText,
    Download,
    RefreshCcw,
    FlaskConical,
    Briefcase,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Type,
    Users
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function Tasks() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [filterCourse, setFilterCourse] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSemester, setFilterSemester] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createTaskType, setCreateTaskType] = useState('Test');
    const itemsPerPage = 6;

    const handleAction = (actionName) => {
        toast({
            title: language === 'ru' ? "Уведомление" : "Xabarnoma",
            description: language === 'ru' ? `Функция "${actionName}" находится в разработке.` : `"${actionName}" funksiyasi ishlab chiqilmoqda.`,
        });
    };

    const stats = [
        {
            title: t('total_tasks'),
            value: '25',
            subtitle: t('in_all_courses'),
            icon: ClipboardList,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            ringColor: 'ring-indigo-100'
        },
        {
            title: t('published'),
            value: '18',
            pct: '(72%)',
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            ringColor: 'ring-green-100'
        },
        {
            title: t('drafts'),
            value: '5',
            pct: '(20%)',
            icon: Hourglass,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            ringColor: 'ring-blue-100'
        },
        {
            title: t('scheduled'),
            value: '2',
            pct: '(8%)',
            icon: CalendarDays,
            color: 'text-rose-500',
            bgColor: 'bg-rose-50',
            ringColor: 'ring-rose-100'
        },
        {
            title: t('avg_score_label'),
            value: '72%',
            subtitle: t('all_tasks'),
            icon: Star,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50',
            ringColor: 'ring-amber-100'
        }
    ];

    const mockTasks = [
        {
            id: 1,
            title: 'Тест по теме: Бурение скважин',
            title_uz: "Quduq burg'ulash mavzusi bo'yicha test",
            subtitle: 'Проверочный тест',
            subtitle_uz: 'Tekshirish testi',
            icon: ClipboardList,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50',
            type: 'Test',
            typeColor: 'text-blue-600 bg-blue-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-1',
            deadline: '09.06.2025\n10:00',
            assigned: 28,
            submitted: 26,
            submittedPct: 93,
            avgScore: 78,
            status: 'Published',
            statusColor: 'text-green-700 bg-green-50'
        },
        {
            id: 2,
            title: 'Расчёт производительности скважины',
            title_uz: "Quduq unumdorligini hisoblash",
            subtitle: 'Практическое задание',
            subtitle_uz: 'Amaliy topshiriq',
            icon: FileText,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-50',
            type: 'Practical',
            typeColor: 'text-emerald-600 bg-emerald-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-1',
            deadline: '10.06.2025\n11:00',
            assigned: 28,
            submitted: 22,
            submittedPct: 79,
            avgScore: 71,
            status: 'Published',
            statusColor: 'text-green-700 bg-green-50'
        },
        {
            id: 3,
            title: 'Лабораторная работа №3. Определение свойств нефти',
            title_uz: "3-laboratoriya ishi. Neft xususiyatlarini aniqlash",
            subtitle: 'Лабораторная работа',
            subtitle_uz: 'Laboratoriya ishi',
            icon: FlaskConical,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50',
            type: 'Lab',
            typeColor: 'text-amber-600 bg-amber-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-2',
            deadline: '11.06.2025\n16:00',
            assigned: 30,
            submitted: 28,
            submittedPct: 93,
            avgScore: 74,
            status: 'Published',
            statusColor: 'text-green-700 bg-green-50'
        },
        {
            id: 4,
            title: 'Проект: Месторождение Бухара',
            title_uz: "Loyiha: Buxoro koni",
            subtitle: 'Индивидуальный проект',
            subtitle_uz: 'Yakka tartibdagi loyiha',
            icon: Briefcase,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-50',
            type: 'Project',
            typeColor: 'text-purple-600 bg-purple-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-2',
            deadline: '16.06.2025\n23:59',
            assigned: 30,
            submitted: 18,
            submittedPct: 60,
            avgScore: 68,
            status: 'Published',
            statusColor: 'text-green-700 bg-green-50'
        },
        {
            id: 5,
            title: 'Тест по теме: Подготовка нефти',
            title_uz: "Neftni tayyorlash mavzusi bo'yicha test",
            subtitle: 'Проверочный тест',
            subtitle_uz: 'Tekshirish testi',
            icon: HelpCircle,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50',
            type: 'Test',
            typeColor: 'text-blue-600 bg-blue-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-3',
            deadline: '18.06.2025\n10:00',
            assigned: 28,
            submitted: 0,
            submittedPct: 0,
            avgScore: null,
            status: 'Planned',
            statusColor: 'text-blue-600 bg-blue-50'
        },
        {
            id: 6,
            title: 'Кейс-стади: Аварийные ситуации на буровой установке',
            title_uz: "Keys-stadi: Burg'ulash uskunasida avariya holatlari",
            subtitle: 'Кейс-задание',
            subtitle_uz: 'Keys-topshiriq',
            icon: FileText,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50',
            type: 'Case',
            typeColor: 'text-amber-600 bg-amber-50',
            course: 'Основы нефтегазовой технологии',
            course_uz: "Neft-gaz texnologiyalari asoslari",
            group: 'НГТ-21-3',
            deadline: '20.06.2025\n18:00',
            assigned: 28,
            submitted: 0,
            submittedPct: 0,
            avgScore: null,
            status: 'Planned',
            statusColor: 'text-blue-600 bg-blue-50'
        },
        {
            id: 7,
            title: 'Тест по оборудованию устья скважины',
            title_uz: "Quduq uskunalarini tekshirish testi",
            subtitle: 'Проверочный тест',
            subtitle_uz: 'Tekshirish testi',
            icon: HelpCircle,
            iconColor: 'text-gray-500',
            iconBg: 'bg-gray-100',
            type: 'Test',
            typeColor: 'text-gray-600 bg-gray-100',
            course: 'Оборудование нефтегазовых промыслов',
            course_uz: "Neft-gaz konlari uskunalari",
            group: '-',
            deadline: '-',
            assigned: 0,
            submitted: 0,
            submittedPct: 0,
            avgScore: null,
            status: 'Draft',
            statusColor: 'text-gray-600 bg-gray-100'
        }
    ];

    const getStatusText = (status) => {
        if (status === 'Published') return language === 'ru' ? 'Опубликовано' : 'Nashr qilingan';
        if (status === 'Planned') return language === 'ru' ? 'Запланировано' : 'Rejalashtirilgan';
        if (status === 'Draft') return language === 'ru' ? 'Черновик' : 'Qoralama';
        return status;
    };

    const getTypeText = (type) => {
        const typesRu = {
            'Test': 'Тест',
            'Practical': 'Практическое',
            'Lab': 'Лабораторная',
            'Project': 'Проект',
            'Case': 'Кейс'
        };
        const typesUz = {
            'Test': 'Test',
            'Practical': 'Amaliy',
            'Lab': 'Laboratoriya',
            'Project': 'Loyiha',
            'Case': 'Keys'
        };
        return language === 'ru' ? typesRu[type] : typesUz[type];
    };

    // Filter Logic
    const filteredTasks = mockTasks.filter(task => {
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesTitle = task.title.toLowerCase().includes(term) || task.title_uz.toLowerCase().includes(term);
            if (!matchesTitle) return false;
        }
        
        // Tab filter
        if (activeTab === 'tests' && task.type !== 'Test') return false;
        if (activeTab === 'practical' && task.type !== 'Practical') return false;
        if (activeTab === 'projects' && task.type !== 'Project') return false;
        if (activeTab === 'labs' && task.type !== 'Lab') return false;
        if (activeTab === 'drafts' && task.status !== 'Draft') return false;

        // Select filters
        if (filterCourse !== 'all' && task.course !== filterCourse) return false;
        if (filterType !== 'all' && task.type !== filterType) return false;
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;

        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCourse('all');
        setFilterType('all');
        setFilterStatus('all');
        setFilterSemester('all');
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {t('tasks_title')}
                </h1>
                <button 
                    onClick={() => { setCreateTaskType('Test'); setIsCreateModalOpen(true); }}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('create_task_or_test')}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }} className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-6">
                        <TabsTrigger
                            value="all"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('all_tasks')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="tests"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('tests')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="practical"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('practical_tasks')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="projects"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('projects')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="labs"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('lab_works')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="drafts"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
                        >
                            {t('drafts')}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{stat.title}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                {stat.pct && <span className="text-sm font-semibold text-gray-500">{stat.pct}</span>}
                            </div>
                            {stat.subtitle && (
                                <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                            )}
                        </div>
                        <div className={`p-2 rounded-lg ${stat.bgColor} ring-4 ${stat.ringColor}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Layout Grid (Main Table + Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Main Table Area */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Filters Row */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search_tasks')}
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                            {searchTerm && (
                                <button onClick={() => {setSearchTerm(''); setCurrentPage(1);}} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        
                        <select 
                            value={filterCourse}
                            onChange={e => {setFilterCourse(e.target.value); setCurrentPage(1);}}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2">
                            <option value="all">{t('course_all')}</option>
                            <option value="Основы нефтегазовой технологии">{language === 'ru' ? 'Основы нефтегазовой технологии' : "Neft-gaz texnologiyalari asoslari"}</option>
                            <option value="Оборудование нефтегазовых промыслов">{language === 'ru' ? 'Оборудование нефтегазовых промыслов' : "Neft-gaz konlari uskunalari"}</option>
                        </select>
                        <select 
                            value={filterType}
                            onChange={e => {setFilterType(e.target.value); setCurrentPage(1);}}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2">
                            <option value="all">{t('type_all')}</option>
                            <option value="Test">{getTypeText('Test')}</option>
                            <option value="Practical">{getTypeText('Practical')}</option>
                            <option value="Lab">{getTypeText('Lab')}</option>
                            <option value="Project">{getTypeText('Project')}</option>
                            <option value="Case">{getTypeText('Case')}</option>
                        </select>
                        <select 
                            value={filterStatus}
                            onChange={e => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2">
                            <option value="all">{t('status_all')}</option>
                            <option value="Published">{getStatusText('Published')}</option>
                            <option value="Planned">{getStatusText('Planned')}</option>
                            <option value="Draft">{getStatusText('Draft')}</option>
                        </select>
                        <select 
                            value={filterSemester}
                            onChange={e => {setFilterSemester(e.target.value); setCurrentPage(1);}}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2">
                            <option value="all">{t('semester_all')}</option>
                            <option value="5">5 {language === 'ru' ? 'семестр' : 'semestr'}</option>
                            <option value="6">6 {language === 'ru' ? 'семестр' : 'semestr'}</option>
                        </select>
                        
                        <button 
                            onClick={resetFilters}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">
                            <RefreshCcw className="w-3.5 h-3.5" />
                            {t('reset_filters')}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">{t('task_name')}</th>
                                        <th className="px-4 py-4 font-semibold">{t('type')}</th>
                                        <th className="px-4 py-4 font-semibold">{t('course')} / {t('group')}</th>
                                        <th className="px-4 py-4 font-semibold">{t('deadline')}</th>
                                        <th className="px-4 py-4 font-semibold">{t('assigned')}</th>
                                        <th className="px-4 py-4 font-semibold text-center">{t('submitted')}</th>
                                        <th className="px-4 py-4 font-semibold text-center">{t('avg_score_label')}</th>
                                        <th className="px-4 py-4 font-semibold">{t('status')}</th>
                                        <th className="px-4 py-4 font-semibold text-center">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedTasks.length > 0 ? paginatedTasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${task.iconBg} shrink-0 mt-0.5`}>
                                                        <task.icon className={`w-4 h-4 ${task.iconColor}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 mb-0.5 leading-snug">
                                                            {language === 'ru' ? task.title : task.title_uz}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {language === 'ru' ? task.subtitle : task.subtitle_uz}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${task.typeColor}`}>
                                                    {getTypeText(task.type)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-[13px] font-medium text-gray-900 leading-tight line-clamp-1" title={language === 'ru' ? task.course : task.course_uz}>
                                                    {language === 'ru' ? task.course : task.course_uz}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{task.group}</p>
                                            </td>
                                            <td className="px-4 py-4 whitespace-pre-line text-[13px] text-gray-600 font-medium">
                                                {task.deadline}
                                            </td>
                                            <td className="px-4 py-4 text-center font-medium text-gray-900">
                                                {task.assigned}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-gray-900">{task.submitted}</span>
                                                    {task.submittedPct > 0 && (
                                                        <span className="text-[10px] text-gray-500">({task.submittedPct}%)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {task.avgScore ? (
                                                    <span className={`font-bold ${task.avgScore > 75 ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {task.avgScore}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap ${task.statusColor}`}>
                                                    {getStatusText(task.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleAction('Аналитика / Analitika')} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Аналитика">
                                                        <BarChart className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction('Редактировать / Tahrirlash')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Редактировать">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction('Больше / Ko\'proq')} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="Больше">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="px-5 py-8 text-center text-gray-500">
                                                {language === 'ru' ? 'Нет заданий, соответствующих вашим фильтрам.' : "Filtrlaringizga mos topshiriqlar yo'q."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination footer */}
                        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <span className="text-sm text-gray-500">
                                {language === 'ru' ? 
                                    `Показано ${filteredTasks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–${Math.min(currentPage * itemsPerPage, filteredTasks.length)} из ${filteredTasks.length} заданий` : 
                                    `${filteredTasks.length} ta topshiriqdan ${filteredTasks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, filteredTasks.length)} ko'rsatilmoqda`}
                            </span>
                            
                            {totalPages > 1 && (
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-white hover:text-gray-700 border border-transparent hover:border-gray-200 disabled:opacity-50 transition-all">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-8 h-8 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                                                currentPage === i + 1 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'text-gray-600 hover:bg-white hover:border-gray-200 border border-transparent'
                                            }`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Widget: Task Calendar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">{t('task_calendar')}</h3>
                            <button 
                                onClick={() => handleAction('Смотреть весь календарь / Barcha taqvim')}
                                className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700">
                                {t('see_all')}
                            </button>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-800">
                                {language === 'ru' ? 'Сегодня, 24.05.2025' : 'Bugun, 24.05.2025'}
                            </p>
                            <span className="text-xs text-gray-500">{language === 'ru' ? '2 задания' : '2 topshiriq'}</span>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => handleAction('Просмотр задания')}>
                                <div className="mt-0.5">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900 leading-tight mb-1">
                                        {language === 'ru' ? 'Расчёт производительности скважины' : 'Quduq unumdorligini hisoblash'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Срок сдачи: 11:00</span>
                                        <span className="font-medium text-gray-700">НГТ-21-1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleAction('Просмотр теста')}>
                                <div className="mt-0.5">
                                    <ClipboardList className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900 leading-tight mb-1">
                                        {language === 'ru' ? 'Тест по теме: Бурение скважин' : "Quduq burg'ulash mavzusi bo'yicha test"}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Срок сдачи: 10:00</span>
                                        <span className="font-medium text-gray-700">НГТ-21-1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAction('Все задания на сегодня')}
                            className="w-full mt-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center">
                            {language === 'ru' ? 'Все задания на сегодня →' : 'Bugungi barcha topshiriqlar →'}
                        </button>
                    </div>

                    {/* Widget: Task Types Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">{t('task_types')}</h3>
                        <div className="flex items-center justify-center mb-6">
                            {/* Simple CSS Donut representation */}
                            <div className="relative w-32 h-32 rounded-full flex items-center justify-center"
                                 style={{
                                     background: 'conic-gradient(#3b82f6 0% 38%, #10b981 38% 63%, #f59e0b 63% 80%, #8b5cf6 80% 92%, #eab308 92% 100%)',
                                     borderRadius: '50%'
                                 }}>
                                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center z-10 absolute shadow-inner">
                                    <span className="text-2xl font-bold text-gray-900">25</span>
                                    <span className="text-[10px] text-gray-500 font-medium uppercase">{t('total_tasks')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => { setActiveTab('tests'); }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-600">{t('tests')}</span>
                                </div>
                                <span className="font-medium text-gray-900">10 <span className="text-gray-400 text-xs font-normal">(40%)</span></span>
                            </div>
                            <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => { setActiveTab('practical'); }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-600">{t('practical_tasks')}</span>
                                </div>
                                <span className="font-medium text-gray-900">6 <span className="text-gray-400 text-xs font-normal">(24%)</span></span>
                            </div>
                            <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => { setActiveTab('labs'); }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    <span className="text-gray-600">{t('lab_works')}</span>
                                </div>
                                <span className="font-medium text-gray-900">4 <span className="text-gray-400 text-xs font-normal">(16%)</span></span>
                            </div>
                            <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => { setActiveTab('projects'); }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                    <span className="text-gray-600">{t('projects')}</span>
                                </div>
                                <span className="font-medium text-gray-900">3 <span className="text-gray-400 text-xs font-normal">(12%)</span></span>
                            </div>
                            <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" onClick={() => { setFilterType('Case'); }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <span className="text-gray-600">{language === 'ru' ? 'Кейсы' : 'Keyslar'}</span>
                                </div>
                                <span className="font-medium text-gray-900">2 <span className="text-gray-400 text-xs font-normal">(8%)</span></span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveTab('all')}
                            className="w-full mt-4 py-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 border-t border-gray-100 text-center flex justify-center items-center gap-1">
                            {language === 'ru' ? 'Все задания →' : 'Barcha topshiriqlar →'}
                        </button>
                    </div>

                    {/* Widget: Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-3">{t('quick_actions')}</h3>
                        <div className="space-y-1">
                            <button onClick={() => { setCreateTaskType('Test'); setIsCreateModalOpen(true); }} className="w-full flex items-center gap-3 p-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left group">
                                <CheckCircle2 className="w-4 h-4 text-green-500 group-hover:text-indigo-600" />
                                <span className="font-medium">{t('create_test')}</span>
                            </button>
                            <button onClick={() => { setCreateTaskType('Practical'); setIsCreateModalOpen(true); }} className="w-full flex items-center gap-3 p-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left group">
                                <FileText className="w-4 h-4 text-blue-500 group-hover:text-indigo-600" />
                                <span className="font-medium">{t('create_practical')}</span>
                            </button>
                            <button onClick={() => { setCreateTaskType('Project'); setIsCreateModalOpen(true); }} className="w-full flex items-center gap-3 p-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left group">
                                <Briefcase className="w-4 h-4 text-purple-500 group-hover:text-indigo-600" />
                                <span className="font-medium">{t('create_project')}</span>
                            </button>
                            <button onClick={() => { setCreateTaskType('Lab'); setIsCreateModalOpen(true); }} className="w-full flex items-center gap-3 p-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left group">
                                <FlaskConical className="w-4 h-4 text-amber-500 group-hover:text-indigo-600" />
                                <span className="font-medium">{t('create_lab')}</span>
                            </button>
                            <button onClick={() => handleAction(t('import_tasks'))} className="w-full flex items-center gap-3 p-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left border-t border-gray-100 mt-2 pt-3 group">
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                                <span className="font-medium">{t('import_tasks')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Widget: Recent Drafts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">{t('recent_drafts')}</h3>
                            <button onClick={() => setActiveTab('drafts')} className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700">
                                {language === 'ru' ? 'Все черновики →' : 'Barcha qoralamalar →'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start group cursor-pointer" onClick={() => handleAction('Редактировать черновик 1')}>
                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-indigo-200 transition-colors shrink-0">
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {language === 'ru' ? 'Тест по оборудованию устья скважины' : 'Quduq uskunalarini tekshirish testi'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {language === 'ru' ? 'Обновлено: 23.05.2025' : 'Yangilangan: 23.05.2025'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start group cursor-pointer" onClick={() => handleAction('Редактировать черновик 2')}>
                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-indigo-200 transition-colors shrink-0">
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {language === 'ru' ? 'Практическая работа: Гидравлические расчёты' : 'Amaliy ish: Gidravlik hisoblashlar'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {language === 'ru' ? 'Обновлено: 22.05.2025' : 'Yangilangan: 22.05.2025'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Create Task Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{language === 'ru' ? 'Создать задание или тест' : 'Topshiriq yoki test yaratish'}</DialogTitle>
                        <DialogDescription>
                            {language === 'ru' ? 'Заполните основные данные нового задания.' : 'Yangi topshiriqning asosiy ma\'lumotlarini to\'ldiring.'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium text-gray-700">
                                {language === 'ru' ? 'Тип задания' : 'Topshiriq turi'}
                            </label>
                            <div className="col-span-3">
                                <select 
                                    value={createTaskType}
                                    onChange={e => setCreateTaskType(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                                >
                                    <option value="Test">{getTypeText('Test')}</option>
                                    <option value="Practical">{getTypeText('Practical')}</option>
                                    <option value="Lab">{getTypeText('Lab')}</option>
                                    <option value="Project">{getTypeText('Project')}</option>
                                    <option value="Case">{getTypeText('Case')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium text-gray-700">
                                {t('task_name')}
                            </label>
                            <div className="col-span-3">
                                <input 
                                    type="text" 
                                    placeholder={language === 'ru' ? 'Введите название...' : 'Nomini kiriting...'}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium text-gray-700">
                                {t('course')}
                            </label>
                            <div className="col-span-3">
                                <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
                                    <option>{language === 'ru' ? 'Выберите курс...' : 'Kursni tanlang...'}</option>
                                    <option>Основы нефтегазовой технологии</option>
                                    <option>Оборудование нефтегазовых промыслов</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium text-gray-700">
                                {t('deadline')}
                            </label>
                            <div className="col-span-3">
                                <input 
                                    type="datetime-local" 
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <button 
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                            {language === 'ru' ? 'Отмена' : 'Bekor qilish'}
                        </button>
                        <button 
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                toast({
                                    title: language === 'ru' ? "Успешно" : "Muvaffaqiyatli",
                                    description: language === 'ru' ? "Задание успешно создано (демо)." : "Topshiriq muvaffaqiyatli yaratildi (demo).",
                                });
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            {language === 'ru' ? 'Сохранить' : 'Saqlash'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
