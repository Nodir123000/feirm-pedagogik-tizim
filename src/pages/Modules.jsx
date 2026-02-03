import { useState, useEffect } from 'react';
import { fetchLearningModules, deleteLearningModule, createLearningModule } from '@/entities/LearningModule';
import { useLanguage } from '@/components/shared/LanguageContext';
import { getMockModuleDetails } from '@/lib/mockModuleData';
import StatCard from '@/components/dashboard/StatCard';
import {
    Activity,
    BookOpen,
    Layers,
    TrendingUp,
    Star,
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
    ChevronRight,
    Languages,
    Target,

    ClipboardCheck,
    UserCheck,
    FileText,
    Info,
    Shield,
    MessageSquare,
    Book,
    Download,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Modules() {
    const { language, t } = useLanguage();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newModule, setNewModule] = useState({
        title_uz_lat: '',
        title_ru: '',
        title_uz_cyr: '',
        description_uz_lat: '',
        description_ru: '',
        module_type: 'Technical',
        total_hours: 40,
        difficulty_level: 'Beginner',
        pedagogical_data: {}
    });

    const loadModules = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLearningModules();
            setModules(data || []);
        } catch (err) {
            console.error('Failed to load modules:', err);
            setError(t('load_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadModules();
    }, []);

    const handleAddModule = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createLearningModule(newModule);
            await loadModules();
            setIsAddModalOpen(false);
            setNewModule({
                title_uz_lat: '',
                title_ru: '',
                title_uz_cyr: '',
                description_uz_lat: '',
                description_ru: '',
                module_type: 'Technical',
                total_hours: 40,
                difficulty_level: 'Beginner',
                pedagogical_data: {}
            });
        } catch (err) {
            console.error('Failed to add module:', err);
            alert(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_module'))) {
            try {
                await deleteLearningModule(id);
                setModules(modules.filter(m => m.id !== id));
            } catch (err) {
                console.error('Delete failed:', err);
                alert(t('delete_module_failed'));
            }
        }
    };

    const handleViewDetails = (module) => {
        setSelectedModule(module);
        setIsDetailsOpen(true);
    };

    const filteredModules = modules.filter(module => {
        const title = module[`title_${language}`] || module.title_uz_lat || '';
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || module.module_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const types = ['All', ...new Set(modules.map(m => m.module_type).filter(Boolean))];

    const getModuleMetadata = (module) => {
        if (!module) return null;
        const titleRu = module.title_ru || '';
        const titleUz = module.title_uz_lat || '';

        if (titleRu.includes('Геология') || titleUz.includes('Geologiya')) {
            return {
                image: '/geology.png',
                desc_ru: 'Образование и расположение нефтегазовых месторождений.',
                desc_uz: 'Neft va gaz konlarining shakllanishi va joylashishi.'
            };
        }
        if (titleRu.includes('бурения') || titleRu.includes('Techno') || titleUz.includes('Burg\'ulash')) {
            return {
                image: '/drilling.jpg',
                desc_ru: 'Изучение современных методов и оборудования для бурения.',
                desc_uz: "Burg'ulashning zamonaviy usullari va uskunalarini o'rganish."
            };
        }
        if (titleRu.includes('Промышленная безопасность') || titleUz.includes('Sanoat xavfsizligi')) {
            return {
                image: '/safety.jpg',
                desc_ru: 'Создание безопасной рабочей среды и управление рисками.',
                desc_uz: 'Xavfsiz ish muhitini yaratish va xatarlarni boshqarish.'
            };
        }
        if (titleRu.includes('Переработка газа') || titleUz.includes('Gazni qayta ishlash')) {
            return {
                image: '/processing.jpg',
                desc_ru: 'Процессы очистки и переработки природного газа',
                desc_uz: 'Tabiiy gazni tozalash va qayta ishlash jarayonlari.'
            };
        }
        if (titleRu.includes('Логистика') || titleUz.includes('Logistika')) {
            return {
                image: '/logistics.jpg',
                desc_ru: 'Оптимизация систем транспортировки энергетических ресурсов.',
                desc_uz: 'Energiya resurslarini tashish tizimlarini optimallashtirish.'
            };
        }
        if (titleRu.includes('цифрового') || titleUz.includes('Raqamli')) {
            return {
                image: '/digital.jpg',
                desc_ru: 'Применение IT-решений в управлении месторождениями.',
                desc_uz: "Konlarni boshqarishda IT-yechimlarini qo'llash."
            };
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {!isDetailsOpen ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-8 h-8 text-green-600" />
                                {t('learning_modules')}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {t('modules_subtitle')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t('add_module')}
                            </button>
                        </div>
                    </div>



                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                        <StatCard
                            title={t('modules')}
                            value={modules.length}
                            subtitle={t('active')}
                            icon={BookOpen}
                            color="violet"
                            trend={12}
                        />
                        <StatCard
                            title={t('total_lessons_count')}
                            value={modules.reduce((acc, m) => acc + (m.total_lessons || 0), 0)}
                            subtitle={t('all_types')} // Using 'all_types' as filler for now or 'total'
                            icon={Layers}
                            color="blue"
                            trend={8}
                        />
                        <StatCard
                            title={t('average_progress_pct')}
                            value="78%"
                            subtitle={t('global_indicator')}
                            icon={Activity}
                            color="emerald"
                            trend={5}
                        />
                        <StatCard
                            title={t('completion_rate')}
                            value="85%"
                            subtitle={t('finished')}
                            icon={TrendingUp}
                            color="amber"
                        />
                        <StatCard
                            title={t('total_hours')}
                            value={`320 ${t('hrs')}`}
                            subtitle={t('global_indicator')}
                            icon={Clock}
                            color="cyan"
                        />
                        <StatCard
                            title={t('student_satisfaction')}
                            value="4.8/5"
                            subtitle={t('feedback')} // feedback might need key check, or just use 'reviews'
                            icon={Star}
                            color="rose"
                        />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search_by_title')}
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
                                    {types.map(type => {
                                        const key = type === 'All' ? 'all_types' : `type_${type.replace(/\s/g, '')}`;
                                        return (
                                            <option key={type} value={type}>
                                                {t(key)}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button
                                onClick={loadModules}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                                title={t('refresh')}
                            >
                                <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    {
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                                <p className="text-gray-500 font-medium animate-pulse">{t('fetching_modules')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredModules.map((module) => {
                                    const meta = getModuleMetadata(module);

                                    return (
                                        <div key={module.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                                            <div className="relative h-44 bg-gray-100 group-hover:h-48 transition-all duration-500">
                                                {(module.thumbnail_url || meta) ? (
                                                    <img
                                                        src={meta ? meta.image : module.thumbnail_url}
                                                        alt=""
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 opacity-80">
                                                        <BookOpen className="w-12 h-12 text-white opacity-40 group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-white/90 text-green-700 shadow-sm">
                                                        {module.module_type || t('module')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{module[`title_${language}`] || module.title_uz_lat}</h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1 italic font-medium">
                                                    {meta
                                                        ? (language === 'ru' ? meta.desc_ru : meta.desc_uz)
                                                        : (module[`description_${language}`] || module.description_uz_lat)
                                                    }
                                                </p>
                                            </div>
                                            <div className="px-5 py-3 bg-gray-50 flex items-center justify-between group/btn">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    {module.total_lessons || 10} {t('lessons')}
                                                </span>
                                                <button
                                                    onClick={() => handleViewDetails(module)}
                                                    className="flex items-center text-xs font-bold text-green-600 hover:text-green-700 transition-colors uppercase gap-1"
                                                >
                                                    {t('details')}
                                                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                </div >
            ) : (
                <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6">
                    {/* Inline Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 group"
                                    title={t('back')}
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedModule[`title_${language}`] || selectedModule.title_uz_lat}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                            {selectedModule.module_type || t('module')}
                                        </Badge>
                                        <span className="text-sm text-gray-500 font-medium tracking-tight">• {t('module_details')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <FileText className="w-5 h-5 text-green-700" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex min-h-[600px]">
                        <Tabs defaultValue="overview" className="flex-1 flex" orientation="vertical">
                            {/* Sidebar */}
                            <div className="w-[320px] border-r bg-gray-50/50 p-6 flex flex-col gap-6 overflow-y-auto">
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <div className="relative mb-4 w-full">
                                        <div className="rounded-2xl overflow-hidden aspect-video shadow-md border-4 border-gray-50">
                                            {(() => {
                                                const meta = getModuleMetadata(selectedModule);
                                                return (selectedModule.thumbnail_url || (meta && meta.image)) ? (
                                                    <img
                                                        src={meta ? meta.image : selectedModule.thumbnail_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                                                        <BookOpen className="w-12 h-12 text-white/40" />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{selectedModule[`title_${language}`] || selectedModule.title_uz_lat}</h4>
                                    <Badge variant="secondary" className="mb-4 bg-green-50 text-green-700 border-green-100">
                                        {selectedModule.difficulty_level || t('beginner')}
                                    </Badge>
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="text-lg font-bold text-green-700">{selectedModule.duration_hours || 'N/A'}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{t('hrs')}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="text-lg font-bold text-emerald-700">{selectedModule.total_lessons || 10}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{t('lessons')}</div>
                                        </div>
                                    </div>
                                </div>

                                <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                                    {[
                                        { value: 'overview', icon: Info, label: 'overview', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                                        { value: 'objectives', icon: Target, label: 'learning_objectives', color: 'text-red-600', bgColor: 'bg-red-50' },
                                        { value: 'structure', icon: Layers, label: 'module_structure', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
                                        { value: 'assessment', icon: ClipboardCheck, label: 'assessment_evaluation', color: 'text-amber-600', bgColor: 'bg-amber-50' },
                                        { value: 'facilitator', icon: UserCheck, label: 'facilitator_activities', color: 'text-purple-600', bgColor: 'bg-purple-50' },
                                        { value: 'resources', icon: FileText, label: 'prerequisites_resources', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
                                        { value: 'analytics', icon: BarChart, label: 'analytics', color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
                                    ].map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="justify-start items-center gap-3 px-4 py-3 h-auto w-full bg-white border border-gray-100 rounded-xl transition-all hover:bg-gray-50 hover:shadow-sm data-[state=active]:bg-green-50/50 data-[state=active]:border-green-200 data-[state=active]:shadow-sm text-gray-600 data-[state=active]:text-green-800"
                                        >
                                            <div className={cn("p-1.5 rounded-lg", tab.bgColor)}>
                                                <tab.icon className={cn("w-4 h-4", tab.color)} />
                                            </div>
                                            <span className="font-bold text-xs tracking-tight">{t(tab.label)}</span>
                                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-full">
                                    {(() => {
                                        const realData = selectedModule.pedagogical_data || {};
                                        const mockData = getMockModuleDetails();
                                        const meta = getModuleMetadata(selectedModule);

                                        // Specific pedagogical data for known modules with SCIENTIFIC depth
                                        const getSpecificData = (title) => {
                                            if (!title) return null;
                                            const t = title.toLowerCase();
                                            const baseTemplate = {
                                                overview: {
                                                    context: { uz: "Sanoatdagi zamonaviy standartlar va texnologiyalarni o'rganish.", ru: "Изучение современных стандартов и технологий в отрасли." },
                                                    audience: { uz: "Barcha darajadagi muhandislar", ru: "Инженеры всех уровней" },
                                                    connection: { uz: "Kasbiy malaka oshirish va sertifikatlash", ru: "Повышение квалификации и сертификация" }
                                                },
                                                bloomLevels: [
                                                    { level: { uz: "Tushunish", ru: "Понимание" }, description: { uz: "Asosiy tushunchalarni izohlash", ru: "Объяснение ключевых понятий" } },
                                                    { level: { uz: "Qo'llash", ru: "Применение" }, description: { uz: "Bilimlarni amaliyotda qo'llash", ru: "Применение знаний на практике" } }
                                                ],
                                                // ... (keep short for unknown modules)
                                                lessons: [], formativeAssessment: [], summativeAssessment: [], facilitatorRole: [], resources: [], prerequisites: []
                                            };

                                            // 1. GEOLOGY (Bloom's Taxonomy Focus)
                                            if (t.includes('geologiya') || t.includes('геология')) {
                                                return {
                                                    overview: {
                                                        context: { uz: "Neft va gaz konlarini qidirish va razvedka qilishning zamonaviy usullari.", ru: "Современные методы поиска и разведки нефтяных и газовых месторождений." },
                                                        audience: { uz: "Geologlar va kon muhandislari (Junior/Middle)", ru: "Геологи и горные инженеры (Junior/Middle)" },
                                                        connection: { uz: "Bosh geolog lavozimi uchun fundamental bilimlar", ru: "Фундаментальные знания для должности главного геолога" },
                                                        // Scientific Expansion
                                                        methodology: { uz: "Dala tadqiqotlari va 3D modellashtirish laboratoriyalari.", ru: "Полевые исследования и лаборатории 3D-моделирования." },
                                                        keywords: [
                                                            { uz: "Stratigrafiya", ru: "Стратиграфия" },
                                                            { uz: "Litologiya", ru: "Литология" },
                                                            { uz: "Cho'kindi havzalar", ru: "Осадочные бассейны" },
                                                            { uz: "Tektonika", ru: "Тектоника" }
                                                        ],
                                                        duration_breakdown: { theory: 40, practice: 50, assessment: 10 }
                                                    },
                                                    bloomLevels: [
                                                        { level: { uz: "Eslab qolish (Remember)", ru: "Запоминание (Remember)" }, description: { uz: "Asosiy cho'kindi havzalari turlarini ro'yxatlash.", ru: "Перечисление основных типов осадочных бассейнов." } },
                                                        { level: { uz: "Tushunish (Understand)", ru: "Понимание (Understand)" }, description: { uz: "Uglevodorodlarning hosil bo'lishi va migratsiyasi jarayonlarini tushuntirish.", ru: "Объяснение процессов генерации и миграции углеводородов." } },
                                                        { level: { uz: "Qo'llash (Apply)", ru: "Применение (Apply)" }, description: { uz: "Quduq ma'lumotlaridan foydalanib g'ovaklik va o'tkazuvchanlikni hisoblash.", ru: "Расчет пористости и проницаемости по данным каротажа." } },
                                                        { level: { uz: "Tahlil (Analyze)", ru: "Анализ (Analyze)" }, description: { uz: "Seysmik ma'lumotlar asosida strukturaviy va stratigrafik tuzoqlarni farqlash.", ru: "Различение структурных и стратиграфических ловушек на основе сейсмики." } },
                                                        { level: { uz: "Baholash (Evaluate)", ru: "Оценка (Evaluate)" }, description: { uz: "Geologik xatarlarni hisobga olgan holda konning iqtisodiy samaradorligini baholash.", ru: "Оценка экономической эффективности месторождения с учетом геологических рисков." } },
                                                        { level: { uz: "Yaratish (Create)", ru: "Создание (Create)" }, description: { uz: "Yangi qidiruv strategiyasini ishlab chiqish.", ru: "Разработка новой стратегии геологоразведки." } }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Detailed Objectives
                                                    objectives_detailed: [
                                                        { description: { uz: "Asosiy cho'kindi havzalari turlarini ro'yxatlash", ru: "Перечисление основных типов осадочных бассейнов" }, domain: 'domain_cognitive', level: 'bloom_remember', competencies: ['comp_technical'] },
                                                        { description: { uz: "Quduq ma'lumotlaridan foydalanib g'ovaklikni hisoblash", ru: "Расчет пористости по данным каротажа" }, domain: 'domain_cognitive', level: 'bloom_apply', competencies: ['comp_technical', 'comp_analysis'] },
                                                        { description: { uz: "Yangi qidiruv strategiyasini ishlab chiqish", ru: "Разработка новой стратегии геологоразведки" }, domain: 'domain_affective', level: 'bloom_create', competencies: ['comp_innovation', 'comp_strategic'] }
                                                    ],
                                                    assessment_config: {
                                                        rubrics: [
                                                            {
                                                                criteria: { uz: "Geologik interpretatsiya aniqligi", ru: "Точность геологической интерпретации" },
                                                                weight: 50,
                                                                levels: {
                                                                    exceeds: { uz: "Barcha qatlamlar va yoriqlar to'g'ri aniqlangan", ru: "Все пласты и разломы определены верно" },
                                                                    meets: { uz: "Asosiy qatlamlar aniq, kichik xatoliklar mavjud", ru: "Основные пласты верны, есть мелкие ошибки" },
                                                                    below: { uz: "Interpretatsiyada jiddiy xatoliklar mavjud", ru: "Серьезные ошибки в интерпретации" }
                                                                }
                                                            },
                                                            {
                                                                criteria: { uz: "Hisobot sifati", ru: "Качество отчета" },
                                                                weight: 30,
                                                                levels: {
                                                                    exceeds: { uz: "Professional standartlarga to'liq mos", ru: "Полностью соответствует проф. стандартам" },
                                                                    meets: { uz: "Tuzilishi to'g'ri, ba'zi detallar yetishmaydi", ru: "Структура верна, не хватает деталей" },
                                                                    below: { uz: "Tushunarsiz va mantiqsiz", ru: "Непонятно и нелогично" }
                                                                }
                                                            }
                                                        ],
                                                        competency_matrix: [
                                                            { method: { uz: "Xarita o'qish", ru: "Чтение карт" }, competencies: ['comp_technical', 'comp_analysis'] },
                                                            { method: { uz: "Yakuniy loyiha", ru: "Финальный проект" }, competencies: ['comp_strategic', 'comp_communication'] }
                                                        ]
                                                    },
                                                    lessons: [
                                                        {
                                                            title: { uz: "Kirish: Cho'kindi havzalar geologiyasi", ru: "Введение: Геология осадочных бассейнов" },
                                                            duration: "2h",
                                                            approach: "Lecture",
                                                            pedagogical_role: "role_acquisition",
                                                            cognitive_load: "load_medium",
                                                            bloom_alignment: "bloom_understand",
                                                            learning_mode: "mode_synchronous"
                                                        },
                                                        {
                                                            title: { uz: "Uglevodorod tizimlari tahlili", ru: "Анализ углеводородных систем" },
                                                            duration: "3h",
                                                            approach: "Case Study",
                                                            pedagogical_role: "role_inquiry",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_analyze",
                                                            learning_mode: "mode_collaborative"
                                                        },
                                                        {
                                                            title: { uz: "Quduq ma'lumotlari interpretatsiyasi", ru: "Интерпретация данных ГИС" },
                                                            duration: "4h",
                                                            approach: "Workshop",
                                                            pedagogical_role: "role_practice",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_evaluate",
                                                            learning_mode: "mode_synchronous"
                                                        }
                                                    ],
                                                    formativeAssessment: [
                                                        { uz: "Xarita o'qish bo'yicha amaliy mashg'ulot", ru: "Практикум по чтению геологических карт" },
                                                        { uz: "Qatlam modelini himoya qilish", ru: "Защита модели пласта" }
                                                    ],
                                                    summativeAssessment: [
                                                        { uz: "Yakuniy loyiha: Konni o'zlashtirish rejasi", ru: "Финальный проект: План освоения месторождения" }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Facilitator (CoI & Cognitive Apprenticeship)
                                                    facilitator_detailed: [
                                                        {
                                                            phase: 'phase_pre',
                                                            presence: 'presence_teaching',
                                                            activity: { uz: "O'quv dizaynini loyihalash va resurslarni tanlash", ru: "Проектирование учебного дизайна и подбор ресурсов" },
                                                            strategy: 'strat_scaffolding'
                                                        },
                                                        {
                                                            phase: 'phase_during',
                                                            presence: 'presence_cognitive',
                                                            activity: { uz: "Muzokaralarni boshqarish va yo'naltirish", ru: "Модерация и направление дискуссий" },
                                                            strategy: 'strat_coaching'
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Resources (IEEE LOM)
                                                    resources_detailed: [
                                                        {
                                                            title: { uz: "Cho'kindi havzalar atlas-i", ru: "Атлас осадочных бассейнов" },
                                                            type: 'res_reading',
                                                            metadata: { interactivity: 'inter_expositive', difficulty: 'diff_high', learning_time: '4h' },
                                                            citation: "Miall, A. D. (2013). The Geology of Fluvial Deposits. Springer."
                                                        },
                                                        {
                                                            title: { uz: "Petrel dasturiy ta'minoti", ru: "ПО Petrel" },
                                                            type: 'res_tool',
                                                            metadata: { interactivity: 'inter_active', difficulty: 'diff_high', learning_time: '20h' },
                                                            citation: "Schlumberger. (2024). Petrel E&P Software Platform."
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Analytics (SBCM - Geology)
                                                    analytics_detailed: {
                                                        sbcm_stats: [
                                                            { dimension: 'motivational_value', score: 70, max: 100 },
                                                            { dimension: 'cognitive_activity', score: 90, max: 100 }, // High for Geology
                                                            { dimension: 'technological_comp', score: 60, max: 100 },
                                                            { dimension: 'reflective_evaluative', score: 75, max: 100 }
                                                        ],
                                                        mpms_monitoring: { level: 2, average_progress: 82, at_risk_students: 1, total_students: 20 },
                                                        ai_recommendations: [
                                                            { type: 'module_suggestion', module_id: 'adv_geology', reason: { uz: "Kognitiv faollik yuqori", ru: "Высокая когнитивная активность" } }
                                                        ]
                                                    },
                                                    facilitatorRole: [
                                                        { uz: "Ekspert maslahatchi", ru: "Эксперт-консультант" },
                                                        { uz: "Loyiha kuratori", ru: "Куратор проектов" }
                                                    ],
                                                    resources: [
                                                        { uz: "AAPG Bulletin maqolalari", ru: "Статьи AAPG Bulletin" },
                                                        { uz: "Petrel dasturiy ta'minoti qo'llanmasi", ru: "Руководство по Petrel" }
                                                    ],
                                                    prerequisites: [
                                                        { uz: "Umumiy geologiya", ru: "Общая геология" },
                                                        { uz: "Litologiya asoslari", ru: "Основы литологии" }
                                                    ]
                                                };
                                            }

                                            // 2. DRILLING (Gagne's 9 Events of Instruction Focus)
                                            if (t.includes('burg\'ulash') || t.includes('бурения')) {
                                                return {
                                                    overview: {
                                                        context: { uz: "Murakkab kon sharoitida xavfsiz va samarali burg'ulash.", ru: "Безопасное и эффективное бурение в сложных горно-геологических условиях." },
                                                        audience: { uz: "Burg'ulash muhandislari, Supervayzerlar", ru: "Инженеры по бурению, Супервайзеры" },
                                                        connection: { uz: "IWCF sertifikatini olishga tayyorgarlik", ru: "Подготовка к получению сертификата IWCF" },
                                                        // Scientific Expansion
                                                        methodology: { uz: "Simulyatsiyaga asoslangan ta'lim (SBL) va kognitiv o'rganish.", ru: "Обучение на основе симуляций (SBL) и когнитивное ученичество." },
                                                        keywords: [
                                                            { uz: "Gidrostatik bosim", ru: "Гидростатическое давление" },
                                                            { uz: "BHA dizayni", ru: "Компоновка низа бурильной колонны (BHA)" },
                                                            { uz: "Burg'ulash rejimi", ru: "Режим бурения" },
                                                            { uz: "Quduq nazorati", ru: "Контроль скважины" }
                                                        ],
                                                        duration_breakdown: { theory: 30, practice: 60, assessment: 10 }
                                                    },
                                                    bloomLevels: [
                                                        { level: { uz: "Tahlil", ru: "Анализ" }, description: { uz: "Avariya sabablarini tahlil qilish (Root Cause Analysis)", ru: "Анализ коренных причин аварий (Root Cause Analysis)" } },
                                                        { level: { uz: "Yaratish", ru: "Создание" }, description: { uz: "Burg'ulash eritmasi dasturini loyihalash", ru: "Проектирование программы бурового раствора" } }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Detailed Objectives
                                                    objectives_detailed: [
                                                        { description: { uz: "Avariya sabablarini tahlil qilish", ru: "Анализ коренных причин аварий" }, domain: 'domain_cognitive', level: 'bloom_analyze', competencies: ['comp_analysis', 'comp_safety'] },
                                                        { description: { uz: "Simulyatorda quduqni nazorat qilish", ru: "Контроль скважины на симуляторе" }, domain: 'domain_psychomotor', level: 'bloom_apply', competencies: ['comp_technical', 'comp_response'] },
                                                        { description: { uz: "Xavfsizlik madaniyatini namoyish etish", ru: "Демонстрация культуры безопасности" }, domain: 'domain_affective', level: 'bloom_evaluate', competencies: ['comp_safety', 'comp_ethics'] }
                                                    ],
                                                    assessment_config: {
                                                        rubrics: [
                                                            {
                                                                criteria: { uz: "Simulyatsiya reaksiyasi vaqti", ru: "Время реакции в симуляции" },
                                                                weight: 60,
                                                                levels: {
                                                                    exceeds: { uz: "< 2 daqiqa, xatosiz", ru: "< 2 минут, без ошибок" },
                                                                    meets: { uz: "< 5 daqiqa, kichik xatolar", ru: "< 5 минут, мелкие ошибки" },
                                                                    below: { uz: "> 5 daqiqa yoki kritik xato", ru: "> 5 минут или критическая ошибка" }
                                                                }
                                                            }
                                                        ],
                                                        competency_matrix: [
                                                            { method: { uz: "Simulyator", ru: "Симулятор" }, competencies: ['comp_technical', 'comp_safety'] },
                                                            { method: { uz: "Yozma imtihon", ru: "Письменный экзамен" }, competencies: ['comp_knowledge'] }
                                                        ]
                                                    },
                                                    lessons: [
                                                        // Using Gagne's Events explicitly in titles/descriptions logic if supported, here just implicitly
                                                        {
                                                            title: { uz: "1. Diqqatni jalb qilish: Avariya videosi tahlili", ru: "1. Привлечение внимания: Разбор видео аварии" },
                                                            duration: "30m",
                                                            approach: "Gagne Event 1",
                                                            pedagogical_role: "role_inquiry", // Hook
                                                            cognitive_load: "load_medium",
                                                            bloom_alignment: "bloom_analyze",
                                                            learning_mode: "mode_synchronous"
                                                        },
                                                        {
                                                            title: { uz: "2. Maqsadlarni e'lon qilish va bilimlarni tiklash", ru: "2. Цели и актуализация знаний" },
                                                            duration: "45m",
                                                            approach: "Gagne Events 2-3",
                                                            pedagogical_role: "role_acquisition",
                                                            cognitive_load: "load_low",
                                                            bloom_alignment: "bloom_remember",
                                                            learning_mode: "mode_synchronous"
                                                        },
                                                        {
                                                            title: { uz: "3. Yangi material: BHA dizayni asoslari", ru: "3. Новый материал: Основы компоновки низа бурильной колонны (BHA)" },
                                                            duration: "1.5h",
                                                            approach: "Gagne Event 4",
                                                            pedagogical_role: "role_acquisition",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_understand",
                                                            learning_mode: "mode_asynchronous"
                                                        },
                                                        {
                                                            title: { uz: "4. Qo'llab-quvvatlash va amaliyot (Simulyator)", ru: "4. Сопровождение и практика (Симулятор)" },
                                                            duration: "3h",
                                                            approach: "Gagne Events 5-6",
                                                            pedagogical_role: "role_practice",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_apply",
                                                            learning_mode: "mode_synchronous"
                                                        }
                                                    ],
                                                    formativeAssessment: [
                                                        { uz: "Simulyatorda burg'ulash parametrlarini nazorat qilish", ru: "Контроль параметров бурения на симуляторе" },
                                                        { uz: "Teskari aloqa sessiyasi", ru: "Сессия обратной связи" }
                                                    ],
                                                    summativeAssessment: [
                                                        { uz: "To'liq sikl simulyatsiyasi", ru: "Симуляция полного цикла" },
                                                        { uz: "Yozma imtihon (API standartlari bo'yicha)", ru: "Письменный экзамен (по стандартам API)" }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Facilitator (Drilling - Cognitive Apprenticeship)
                                                    facilitator_detailed: [
                                                        {
                                                            phase: 'phase_during',
                                                            presence: 'presence_teaching',
                                                            activity: { uz: "Simulyatsiya darsini o'tkazish va modellashtirish", ru: "Проведение симуляции и моделирование действий" },
                                                            strategy: 'strat_modeling'
                                                        },
                                                        {
                                                            phase: 'phase_during',
                                                            presence: 'presence_cognitive',
                                                            activity: { uz: "Individual xatolarni tuzatish va yo'naltirish", ru: "Коррекция индивидуальных ошибок и коучинг" },
                                                            strategy: 'strat_coaching'
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Resources (Drilling - High Tech)
                                                    resources_detailed: [
                                                        {
                                                            title: { uz: "IADC Burg'ulash Qo'llanmasi (12-nashr)", ru: "Руководство по бурению IADC (12-е изд.)" },
                                                            type: 'res_reading',
                                                            metadata: { interactivity: 'inter_expositive', difficulty: 'diff_medium', learning_time: '10h' },
                                                            citation: "IADC. (2023). IADC Drilling Manual. International Association of Drilling Contractors."
                                                        },
                                                        {
                                                            title: { uz: "DrillSim 5000", ru: "DrillSim 5000" },
                                                            type: 'res_tool',
                                                            metadata: { interactivity: 'inter_active', difficulty: 'diff_high', learning_time: '15h' },
                                                            citation: "Drilling Systems. (2024). DrillSim Well Control Simulator."
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Analytics (SBCM - Drilling)
                                                    analytics_detailed: {
                                                        sbcm_stats: [
                                                            { dimension: 'motivational_value', score: 85, max: 100 },
                                                            { dimension: 'cognitive_activity', score: 75, max: 100 },
                                                            { dimension: 'technological_comp', score: 95, max: 100 }, // High for Drilling
                                                            { dimension: 'reflective_evaluative', score: 60, max: 100 }
                                                        ],
                                                        mpms_monitoring: { level: 3, average_progress: 88, at_risk_students: 3, total_students: 18 },
                                                        ai_recommendations: [
                                                            { type: 'simulation_ready', module_id: 'well_control_sim', reason: { uz: "Simulyator natijalari a'lo", ru: "Отличные результаты на симуляторе" } }
                                                        ]
                                                    },
                                                    facilitatorRole: [
                                                        { uz: "Instruktor-trener", ru: "Инструктор-тренер" },
                                                        { uz: "Avariya ssenariylari rejissyori", ru: "Режиссер аварийных сценариев" }
                                                    ],
                                                    resources: [
                                                        { uz: "API RP 54 Standarti", ru: "Стандарт API RP 54" },
                                                        { uz: "IADC Drilling Manual", ru: "Руководство по бурению IADC" }
                                                    ],
                                                    prerequisites: [
                                                        { uz: "Gidravlika asoslari", ru: "Основы гидравлики" },
                                                        { uz: "Materialshunoslik", ru: "Материаловедение" }
                                                    ]
                                                };
                                            }

                                            // 3. SAFETY (Kirkpatrick Model Focus)
                                            if (t.includes('xavfsizlik') || t.includes('безопасность')) {
                                                return {
                                                    overview: {
                                                        context: { uz: "Ish joyidagi baxtsiz hodisalarni nolga tushirish (Zero Harm).", ru: "Сведению несчастных случаев на производстве к нулю (Zero Harm)." },
                                                        audience: { uz: "Barcha xodimlar va pudratchilar", ru: "Все сотрудники и подрядчики" },
                                                        connection: { uz: "HSE madaniyatini shakllantirish", ru: "Формирование культуры HSE" },
                                                        // Scientific Expansion
                                                        methodology: { uz: "Kompetentsiyaga asoslangan ta'lim (CBT) va xulq-atvor xavfsizligi.", ru: "Компетентностный подход (CBT) и поведенческая безопасность." },
                                                        keywords: [
                                                            { uz: "Xatarlarni baholash", ru: "Оценка рисков" },
                                                            { uz: "LOTO", ru: "LOTO" },
                                                            { uz: "Favqulodda javob choralari", ru: "Аварийное реагирование" },
                                                            { uz: "Zero Harm", ru: "Zero Harm" }
                                                        ],
                                                        duration_breakdown: { theory: 20, practice: 70, assessment: 10 }
                                                    },
                                                    bloomLevels: [
                                                        { level: { uz: "Qo'llash", ru: "Применение" }, description: { uz: "PPE (Shaxsiy himoya vositalari) dan to'g'ri foydalanish", ru: "Правильное использование СИЗ" } },
                                                        { level: { uz: "Baholash", ru: "Оценка" }, description: { uz: "Xatarlarni baholash matritsasini to'ldirish", ru: "Заполнение матрицы оценки рисков" } }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Detailed Objectives
                                                    objectives_detailed: [
                                                        { description: { uz: "PPE dan to'g'ri foydalanishni namoyish qilish", ru: "Демонстрация правильного использования СИЗ" }, domain: 'domain_psychomotor', level: 'bloom_apply', competencies: ['comp_safety'] },
                                                        { description: { uz: "LOTO protseduralarini xatosiz bajarish", ru: "Безошибочное выполнение процедур LOTO" }, domain: 'domain_cognitive', level: 'bloom_apply', competencies: ['comp_technical', 'comp_safety'] },
                                                        { description: { uz: "Zero Harm qadriyatlarini qabul qilish", ru: "Принятие ценностей Zero Harm" }, domain: 'domain_affective', level: 'bloom_internalize', competencies: ['comp_ethics'] }
                                                    ],
                                                    assessment_config: {
                                                        rubrics: [
                                                            {
                                                                criteria: { uz: "PPE kiyish tartibi", ru: "Порядок надевания СИЗ" },
                                                                weight: 40,
                                                                levels: {
                                                                    exceeds: { uz: "To'liq standart va tez", ru: "Полный стандарт и быстро" },
                                                                    meets: { uz: "Standartga mos", ru: "Соответствует стандарту" },
                                                                    below: { uz: "Xatoliklar mavjud", ru: "Есть ошибки" }
                                                                }
                                                            }
                                                        ],
                                                        competency_matrix: [
                                                            { method: { uz: "Amaliy kuzatuv", ru: "Практическое наблюдение" }, competencies: ['comp_safety', 'comp_technical'] }
                                                        ]
                                                    },
                                                    lessons: [
                                                        {
                                                            title: { uz: "HSE Oltin qoidalari", ru: "Золотые правила HSE" },
                                                            duration: "1h",
                                                            approach: "Interactive",
                                                            pedagogical_role: "role_acquisition",
                                                            cognitive_load: "load_low",
                                                            bloom_alignment: "bloom_remember",
                                                            learning_mode: "mode_asynchronous"
                                                        },
                                                        {
                                                            title: { uz: "Yong'in xavfsizligi va evakuatsiya", ru: "Пожарная безопасность и эвакуация" },
                                                            duration: "2h",
                                                            approach: "Drill",
                                                            pedagogical_role: "role_practice",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_apply",
                                                            learning_mode: "mode_synchronous"
                                                        },
                                                        {
                                                            title: { uz: "Birinchi yordam ko'rsatish", ru: "Оказание первой помощи" },
                                                            duration: "3h",
                                                            approach: "Hands-on",
                                                            pedagogical_role: "role_practice",
                                                            cognitive_load: "load_high",
                                                            bloom_alignment: "bloom_apply",
                                                            learning_mode: "mode_synchronous"
                                                        }
                                                    ],
                                                    formativeAssessment: [
                                                        { uz: "Daraja 1 (Kirkpatrick): Qoniqish so'rovnomasi", ru: "Уровень 1 (Киркпатрик): Опрос удовлетворенности" },
                                                        { uz: "Daraja 2 (Kirkpatrick): Xavfsizlik bo'yicha test", ru: "Уровень 2 (Киркпатрик): Тест по безопасности" }
                                                    ],
                                                    summativeAssessment: [
                                                        { uz: "Daraja 3 (Kirkpatrick): Ish joyidagi xatti-harakatlar auditi (3 oydan keyin)", ru: "Уровень 3 (Киркпатрик): Аудит поведения на рабочем месте (через 3 месяца)" },
                                                        { uz: "Daraja 4 (Kirkpatrick): Baxtsiz hodisalar statistikasi tahlili", ru: "Уровень 4 (Киркпатрик): Анализ статистики происшествий" }
                                                    ],
                                                    facilitatorRole: [
                                                        { uz: "Xavfsizlik bo'yicha murabbiy", ru: "Тренер по безопасности" },
                                                        { uz: "Madaniyat o'zgarishi agenti", ru: "Агент изменений культуры" }
                                                    ],
                                                    resources: [
                                                        { uz: "ISO 45001 Standarti", ru: "Стандарт ISO 45001" },
                                                        { uz: "Kompaniyaning HSE siyosati", ru: "Политика HSE компании" }
                                                    ],
                                                    prerequisites: [
                                                        { uz: "Yo'q (Kirish kursi)", ru: "Нет (Вводный курс)" }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Facilitator (Safety - Social & Scaffolding)
                                                    facilitator_detailed: [
                                                        {
                                                            phase: 'phase_pre',
                                                            presence: 'presence_social',
                                                            activity: { uz: "Xavfsizlik madaniyatini shakllantirish (Icebreaker)", ru: "Формирование культуры безопасности (Icebreaker)" },
                                                            strategy: 'strat_scaffolding'
                                                        },
                                                        {
                                                            phase: 'phase_post',
                                                            presence: 'presence_cognitive',
                                                            activity: { uz: "Hodisalarni tahlil qilish (Debriefing)", ru: "Разбор происшествий (Debriefing)" },
                                                            strategy: 'strat_fading'
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Resources (Safety - Regulatory)
                                                    resources_detailed: [
                                                        {
                                                            title: { uz: "ISO 45001:2018 Standarti", ru: "Стандарт ISO 45001:2018" },
                                                            type: 'res_reading',
                                                            metadata: { interactivity: 'inter_expositive', difficulty: 'diff_medium', learning_time: '6h' },
                                                            citation: "ISO. (2018). Occupational health and safety management systems."
                                                        },
                                                        {
                                                            title: { uz: "Piper Alpha halokati tahlili (Video)", ru: "Разбор катастрофы Piper Alpha (Видео)" },
                                                            type: 'res_multimedia',
                                                            metadata: { interactivity: 'inter_active', difficulty: 'diff_low', learning_time: '1h' },
                                                            citation: "BBC/Discovery Channel. (1990). Piper Alpha Documentary."
                                                        }
                                                    ],
                                                    // SCIENTIFIC EXPANSION: Analytics (SBCM - Safety)
                                                    analytics_detailed: {
                                                        sbcm_stats: [
                                                            { dimension: 'motivational_value', score: 95, max: 100 }, // Safety is critical
                                                            { dimension: 'cognitive_activity', score: 60, max: 100 },
                                                            { dimension: 'technological_comp', score: 50, max: 100 },
                                                            { dimension: 'reflective_evaluative', score: 90, max: 100 } // High evaluation/reflection
                                                        ],
                                                        mpms_monitoring: { level: 1, average_progress: 100, at_risk_students: 0, total_students: 30 },
                                                        ai_recommendations: [
                                                            { type: 'develop_reflective', resource_id: 'safety_log', reason: { uz: "Xavfsizlik madaniyatini mustahkamlash", ru: "Укрепление культуры безопасности" } }
                                                        ]
                                                    }
                                                };
                                            }

                                            // Return base template for any OTHER modules
                                            if (t.includes('qayta') || t.includes('переработка') || t.includes('logistika') || t.includes('логистика') || t.includes('raqamli') || t.includes('цифровые')) {
                                                return baseTemplate;
                                            }
                                            return null;
                                        };

                                        // ... existing code ...

                                        // RENDERING LOGIC UPDATE for Overview
                                        // Find TabsContent value="overview" and replace


                                        const specificData = getSpecificData(selectedModule.title_ru || selectedModule.title_uz_lat);

                                        const getField = (field) => {
                                            const val = realData[field];
                                            if (Array.isArray(val) && val.length > 0) return val;
                                            if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) return val;
                                            // Fallback to specific hardcoded data first, then generic mock data
                                            if (specificData && specificData[field]) return specificData[field];
                                            return mockData[field] || [];
                                        };

                                        // Helper to handle bilingual text (string or {uz, ru})
                                        const getLocalizedText = (text) => {
                                            if (!text) return '';
                                            if (typeof text === 'object') {
                                                if (language === 'ru' && text.ru) return text.ru;
                                                if ((language === 'uz_lat' || language === 'uz') && (text.uz_lat || text.uz)) return text.uz_lat || text.uz;
                                                // Fallback to any available
                                                return text.uz_lat || text.uz || text.ru || Object.values(text)[0] || '';
                                            }
                                            // If it's a string, try translation key, otherwise return raw string
                                            return t(text) === text ? text : t(text);
                                        };

                                        return (
                                            <>
                                                <TabsContent value="overview" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <Info className="w-5 h-5 text-green-600" />
                                                        {t('overview')}
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {/* 1. Context (Hero Section) */}
                                                        <div className="p-5 bg-green-50/30 rounded-2xl border border-green-100/50">
                                                            <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2 opacity-70 flex items-center gap-2">
                                                                <Globe className="w-4 h-4" />
                                                                {t('context') || 'Context'}
                                                            </h4>
                                                            <p className="text-gray-700 leading-relaxed font-semibold text-lg">
                                                                {getField('overview')?.context ? getLocalizedText(getField('overview').context) : (meta
                                                                    ? (language === 'ru' ? meta.desc_ru : meta.desc_uz)
                                                                    : (selectedModule[`description_${language}`] || selectedModule.description_uz_lat || t('no_description'))
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* 2. Scientific Methodology & Ontology (New Rows) */}
                                                        {getField('overview')?.methodology && (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                {/* Methodology Card */}
                                                                <div className="md:col-span-2 p-4 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                                                                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-2 opacity-70 flex items-center gap-2">
                                                                        <BookOpen className="w-3.5 h-3.5" />
                                                                        {t('instructional_methodology') || 'Methodology'}
                                                                    </h4>
                                                                    <p className="text-gray-800 font-medium text-base">
                                                                        {getLocalizedText(getField('overview').methodology)}
                                                                    </p>
                                                                </div>

                                                                {/* Ontology/Keywords (Tag Cloud) */}
                                                                <div className="space-y-2">
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
                                                                        {t('scientific_ontology') || 'Ontology'}
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {getField('overview').keywords?.map((kw, idx) => (
                                                                            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md border border-gray-200 font-medium">
                                                                                {getLocalizedText(kw)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* 3. Educational Blueprint (Duration Breakdown) */}
                                                        {getField('overview')?.duration_breakdown && (
                                                            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                                    {t('educational_blueprint') || 'Blueprint'}
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    {['theory', 'practice', 'assessment'].map((type) => {
                                                                        const percent = getField('overview').duration_breakdown[type] || 0;
                                                                        const color = type === 'theory' ? 'bg-blue-500' : type === 'practice' ? 'bg-green-500' : 'bg-red-500';
                                                                        return (
                                                                            <div key={type} className="flex items-center gap-4">
                                                                                <div className="w-24 text-xs font-semibold text-gray-600 capitalize">
                                                                                    {t(`duration_${type}`) || type}: {percent}%
                                                                                </div>
                                                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                                    <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* 4. Audience & Connection (Bottom Grid) */}
                                                        {getField('overview')?.audience && (
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
                                                                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 opacity-70">{t('target_audience') || 'Target Audience'}</h4>
                                                                    <p className="text-gray-700 font-medium text-sm">{getLocalizedText(getField('overview').audience)}</p>
                                                                </div>
                                                                <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-100/50">
                                                                    <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-2 opacity-70">{t('professional_connection') || 'Career Path'}</h4>
                                                                    <p className="text-gray-700 font-medium text-sm">{getLocalizedText(getField('overview').connection)}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="objectives" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <Target className="w-5 h-5 text-green-600" />
                                                        {t('learning_objectives')}
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {/* Check for detailed scientific objectives first */}
                                                        {getField('objectives_detailed') ? (
                                                            getField('objectives_detailed').map((obj, idx) => (
                                                                <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
                                                                    <div className="flex-1">
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t(obj.domain)}</Badge>
                                                                            <Badge variant="secondary">{t(obj.level)}</Badge>
                                                                        </div>
                                                                        <p className="font-medium text-gray-800 text-lg">{getLocalizedText(obj.description)}</p>
                                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                                            {obj.competencies?.map((comp, i) => (
                                                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-200">
                                                                                    {t(comp) || comp}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            // Fallback to original bloomLevels
                                                            getField('bloomLevels').map((level, idx) => (
                                                                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                                    <Badge className="bg-green-100 text-green-700 mb-2">{getLocalizedText(level.level)}</Badge>
                                                                    <p className="text-sm font-medium text-gray-700">{getLocalizedText(level.description)}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="structure" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <Layers className="w-5 h-5 text-green-600" />
                                                        {t('module_structure')}
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {getField('lessons').map((lesson, idx) => (
                                                            <div key={idx} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                                                                {/* Timeline Dot */}
                                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>

                                                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                                                                        <div>
                                                                            <h4 className="font-bold text-gray-900 text-base">{getLocalizedText(lesson.title)}</h4>
                                                                            <span className="text-xs text-gray-500 font-medium">{lesson.duration} • {lesson.learning_mode ? t(lesson.learning_mode) : lesson.approach}</span>
                                                                        </div>
                                                                        {lesson.pedagogical_role && (
                                                                            <Badge variant="outline" className={`
                                                                                capitalize 
                                                                                ${lesson.pedagogical_role === 'role_acquisition' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                                                ${lesson.pedagogical_role === 'role_practice' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                                                                ${lesson.pedagogical_role === 'role_production' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                                                                ${lesson.pedagogical_role === 'role_inquiry' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                                                                            `}>
                                                                                {t(lesson.pedagogical_role)}
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    {/* Scientific Attributes Grid */}
                                                                    {lesson.cognitive_load && (
                                                                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-50">
                                                                            <div className="space-y-1">
                                                                                <span className="text-[10px] uppercase font-bold text-gray-400">{t('cognitive_load')}</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                                        <div className={`h-full rounded-full ${lesson.cognitive_load === 'load_low' ? 'w-1/3 bg-green-400' :
                                                                                            lesson.cognitive_load === 'load_medium' ? 'w-2/3 bg-orange-400' :
                                                                                                'w-full bg-red-400'
                                                                                            }`}></div>
                                                                                    </div>
                                                                                    <span className="text-xs font-semibold text-gray-600">{t(lesson.cognitive_load)}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <span className="text-[10px] uppercase font-bold text-gray-400">Bloom's</span>
                                                                                <span className="block text-xs font-semibold text-gray-700">{t(lesson.bloom_alignment || 'bloom_understand')}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="assessment" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <ClipboardCheck className="w-5 h-5 text-green-600" />
                                                        {t('assessment_evaluation')}
                                                    </h3>

                                                    {/* Scientific Rubrics & Matrix */}
                                                    {getField('assessment_config') && (
                                                        <div className="space-y-6 mb-6">
                                                            {/* Rubrics */}
                                                            {getField('assessment_config').rubrics && (
                                                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{t('rubric_criteria') || 'Assessment Rubrics'}</h4>
                                                                    </div>
                                                                    <div className="divide-y divide-gray-100">
                                                                        {getField('assessment_config').rubrics.map((rubric, idx) => (
                                                                            <div key={idx} className="p-4 grid md:grid-cols-4 gap-4">
                                                                                <div className="md:col-span-1">
                                                                                    <p className="font-bold text-gray-900">{getLocalizedText(rubric.criteria)}</p>
                                                                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">{t('rubric_weight')}: {rubric.weight}%</span>
                                                                                </div>
                                                                                <div className="md:col-span-3 grid grid-cols-3 gap-2 text-sm">
                                                                                    <div className="bg-green-50 p-2 rounded border border-green-100">
                                                                                        <span className="block text-xs font-bold text-green-700 mb-1">{t('rubric_exceeds')}</span>
                                                                                        <span className="text-gray-600">{getLocalizedText(rubric.levels.exceeds)}</span>
                                                                                    </div>
                                                                                    <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                                                                        <span className="block text-xs font-bold text-blue-700 mb-1">{t('rubric_meets')}</span>
                                                                                        <span className="text-gray-600">{getLocalizedText(rubric.levels.meets)}</span>
                                                                                    </div>
                                                                                    <div className="bg-red-50 p-2 rounded border border-red-100">
                                                                                        <span className="block text-xs font-bold text-red-700 mb-1">{t('rubric_below')}</span>
                                                                                        <span className="text-gray-600">{getLocalizedText(rubric.levels.below)}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Competency Matrix */}
                                                            {getField('assessment_config').competency_matrix && (
                                                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-3">{t('competency_matrix')}</h4>
                                                                    <div className="grid gap-3">
                                                                        {getField('assessment_config').competency_matrix.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                                                <div className="w-1/3 font-semibold text-gray-700">{getLocalizedText(item.method)}</div>
                                                                                <div className="flex-1 flex flex-wrap gap-2">
                                                                                    {item.competencies.map((comp, i) => (
                                                                                        <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 shadow-sm">
                                                                                            {t(comp) || comp}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-100">
                                                            <h4 className="font-bold text-amber-800 mb-2">{t('formative_assessment')}</h4>
                                                            <ul className="text-sm list-disc pl-4 space-y-1">
                                                                {getField('formativeAssessment').map((a, i) => <li key={i}>{getLocalizedText(a)}</li>)}
                                                            </ul>
                                                        </div>
                                                        <div className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                                                            <h4 className="font-bold text-green-800 mb-2">{t('summative_assessment')}</h4>
                                                            <ul className="text-sm list-disc pl-4 space-y-1">
                                                                {getField('summativeAssessment').map((a, i) => <li key={i}>{getLocalizedText(a)}</li>)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="facilitator" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <UserCheck className="w-5 h-5 text-green-600" />
                                                        {t('facilitator_activities')}
                                                    </h3>

                                                    {/* Scientific Facilitator Display */}
                                                    {getField('facilitator_detailed') ? (
                                                        <div className="grid gap-4">
                                                            {getField('facilitator_detailed').map((item, idx) => (
                                                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                                                                    <div className="md:w-1/4 space-y-2">
                                                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 block w-fit">
                                                                            {t(item.phase)}
                                                                        </Badge>
                                                                        <Badge className={`
                                                                            ${item.presence === 'presence_teaching' ? 'bg-blue-100 text-blue-700' :
                                                                                item.presence === 'presence_social' ? 'bg-green-100 text-green-700' :
                                                                                    'bg-purple-100 text-purple-700'}
                                                                        `}>
                                                                            {t(item.presence)}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-bold text-gray-800 mb-1">{getLocalizedText(item.activity)}</h4>
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('instructional_methodology')}:</span>
                                                                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded font-medium border border-amber-100">
                                                                                {t(item.strategy)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {getField('facilitatorRole').map((role, i) => (
                                                                <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm font-medium">{getLocalizedText(role)}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                <TabsContent value="resources" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-green-600" />
                                                        {t('prerequisites_resources')}
                                                    </h3>

                                                    {/* Scientific Resources Display */}
                                                    {getField('resources_detailed') && (
                                                        <div className="space-y-4 mb-6">
                                                            <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wide">{t('recommended_materials')} (IEEE LOM)</h4>
                                                            <div className="grid gap-4">
                                                                {getField('resources_detailed').map((res, idx) => (
                                                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <FileText className="w-4 h-4 text-blue-500" />
                                                                                <h5 className="font-bold text-gray-800">{getLocalizedText(res.title)}</h5>
                                                                            </div>
                                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">{t(res.type)}</Badge>
                                                                        </div>

                                                                        {/* IEEE LOM Metadata */}
                                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded font-medium border border-blue-100">
                                                                                {t(res.metadata.interactivity)}
                                                                            </span>
                                                                            <span className={`px-2 py-0.5 text-[10px] rounded font-medium border
                                                                                ${res.metadata.difficulty === 'diff_high' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                                    res.metadata.difficulty === 'diff_medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                                        'bg-green-50 text-green-700 border-green-100'}
                                                                            `}>
                                                                                {t(res.metadata.difficulty)}
                                                                            </span>
                                                                            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded font-medium border border-gray-200">
                                                                                {res.metadata.learning_time}
                                                                            </span>
                                                                        </div>

                                                                        <div className="p-2 bg-gray-50 rounded text-xs text-gray-500 font-mono border border-gray-100 group-hover:bg-blue-50/50 transition-colors">
                                                                            <span className="font-bold text-gray-400 mr-2">CITATION:</span>
                                                                            {res.citation}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="grid gap-4">
                                                        <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                                                            <h4 className="font-bold text-blue-800 mb-2">{t('required_knowledge')}</h4>
                                                            <ul className="text-sm list-disc pl-4 space-y-1">
                                                                {getField('prerequisites').map((p, i) => <li key={i}>{getLocalizedText(p)}</li>)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="analytics" className="mt-0 space-y-6">
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        <BarChart className="w-5 h-5 text-indigo-600" />
                                                        {t('analytics') || 'Analytics'}
                                                    </h3>

                                                    {getField('analytics_detailed') ? (
                                                        <div className="space-y-6">
                                                            {/* SBCM Radar/Grid */}
                                                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                                    <Target className="w-4 h-4 text-indigo-500" />
                                                                    SBCM (Competency Model)
                                                                </h4>
                                                                <div className="grid gap-4">
                                                                    {getField('analytics_detailed').sbcm_stats.map((stat, idx) => (
                                                                        <div key={idx} className="space-y-1">
                                                                            <div className="flex justify-between text-sm">
                                                                                <span className="font-medium text-gray-700">{t(stat.dimension) || stat.dimension}</span>
                                                                                <span className="font-bold text-gray-900">{stat.score}%</span>
                                                                            </div>
                                                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                                                    style={{ width: `${(stat.score / stat.max) * 100}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* MPMS Monitoring */}
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100">
                                                                    <h4 className="font-bold text-indigo-900 mb-2">MPMS Level</h4>
                                                                    <div className="text-3xl font-bold text-indigo-700">
                                                                        {getField('analytics_detailed').mpms_monitoring.level === 1 ? t('mpms_group') :
                                                                            getField('analytics_detailed').mpms_monitoring.level === 2 ? t('mpms_individual') :
                                                                                t('mpms_diagnostic')}
                                                                    </div>
                                                                    <p className="text-xs text-indigo-600 mt-1 uppercase font-bold tracking-wide">
                                                                        {t('monitoring_system')}
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white p-5 rounded-xl border border-gray-200">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span className="text-sm font-bold text-gray-500">{t('average_progress')}</span>
                                                                        <span className="text-2xl font-bold text-green-600">{getField('analytics_detailed').mpms_monitoring.average_progress}%</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm font-bold text-gray-500">{t('at_risk_students')}</span>
                                                                        <span className="text-xl font-bold text-red-500">{getField('analytics_detailed').mpms_monitoring.at_risk_students}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* AI Recommendations */}
                                                            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100">
                                                                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                                                    <RefreshCcw className="w-4 h-4 text-amber-600" />
                                                                    {t('ai_recommendations') || 'AI Trajectory'}
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {getField('analytics_detailed').ai_recommendations.map((rec, idx) => (
                                                                        <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm flex gap-3">
                                                                            <div className="shrink-0 mt-1">
                                                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-bold text-gray-900">{getLocalizedText(rec.reason)}</div>
                                                                                <div className="text-xs text-amber-700 font-mono mt-1 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                                                                                    {rec.module_id || rec.resource_id}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                            {t('no_analytics_data')}
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Tabs >
                    </div >
                </div >
            )
            }

            {
                isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 animate-in zoom-in duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="w-6 h-6 text-green-600" />
                                {t('add_module')}
                            </h2>

                            <form onSubmit={handleAddModule} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Title (UZ)</label>
                                        <input
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={newModule.title_uz_lat}
                                            onChange={e => setNewModule({ ...newModule, title_uz_lat: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Title (RU)</label>
                                        <input
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={newModule.title_ru}
                                            onChange={e => setNewModule({ ...newModule, title_ru: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Description (UZ)</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
                                        value={newModule.description_uz_lat}
                                        onChange={e => setNewModule({ ...newModule, description_uz_lat: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Description (RU)</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
                                        value={newModule.description_ru}
                                        onChange={e => setNewModule({ ...newModule, description_ru: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Type</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none hover:bg-gray-50 transition-colors"
                                            value={newModule.module_type}
                                            onChange={e => setNewModule({ ...newModule, module_type: e.target.value })}
                                        >
                                            <option value="Technical">Technical</option>
                                            <option value="Safety">Safety</option>
                                            <option value="Soft Skills">Soft Skills</option>
                                            <option value="Pedagogical">Pedagogical</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Hours</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={newModule.total_hours}
                                            onChange={e => setNewModule({ ...newModule, total_hours: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        Pedagogical Data (JSON)
                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">Advanced</span>
                                    </label>
                                    <textarea
                                        placeholder='{"bloomLevels": [...], "lessons": [...]}'
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-xs min-h-[100px]"
                                        onChange={e => {
                                            try {
                                                const json = JSON.parse(e.target.value);
                                                setNewModule({ ...newModule, pedagogical_data: json });
                                            } catch (err) { }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const template = {
                                                "overview": {
                                                    "context": { "uz": "Ushbu modul ishlab chiqarish jarayonidagi real muammolarni hal qilishga qaratilgan.", "ru": "Этот модуль направлен на решение реальных производственных задач." },
                                                    "audience": { "uz": "Boshlang'ich va o'rta darajadagi mutaxassislar", "ru": "Специалисты начального и среднего уровня" },
                                                    "connection": { "uz": "Bosh muhandis lavozimiga ko'tarilish uchun zarur", "ru": "Необходимо для продвижения на должность главного инженера" }
                                                },
                                                "bloomLevels": [
                                                    { "level": "Tushunish (Understanding)", "description": "Burg'ulash qurilmasining ishlash tamoyillarini tushuntirish." },
                                                    { "level": "Qo'llash (Applying)", "description": "Simulyatorda burg'ulash jarayonini boshlash." },
                                                    { "level": "Tahlil (Analyzing)", "description": "Avariya sabablarini tashxislash." }
                                                ],
                                                "lessons": [
                                                    { "title": "Nazariyaga kirish", "duration": "45 min", "approach": "Munozarali ma'ruza" },
                                                    { "title": "Simulyatorda namoyish", "duration": "1.5 soat", "approach": "Kuzatish va modellashtirish" },
                                                    { "title": "Mustaqil mashg'ulot", "duration": "2 soat", "approach": "Amaliy o'rganish (Learning by Doing)" }
                                                ],
                                                "formativeAssessment": [
                                                    "Har bir video-blokdan keyin viktorina",
                                                    "Simulyatsiyadan oldin o'z-o'zini tekshirish ro'yxati (Check-list)",
                                                    "Fasilitatorning og'zaki fikr-mulohazasi"
                                                ],
                                                "summativeAssessment": [
                                                    "Simulyatordagi yakuniy imtihon (avariyasiz ishga tushirish)",
                                                    "Jarayonni optimallashtirish bo'yicha loyiha himoyasi"
                                                ],
                                                "facilitatorRole": [
                                                    "Moderator: ochiq savollar berish",
                                                    "Kuzatuvchi: xatolarni qayd etish",
                                                    "Kouch: simulyatsiyadan keyin tahlil (debrifing) o'tkazish"
                                                ],
                                                "resources": [
                                                    "Texnologik reglament №123-B",
                                                    "Xavfsizlik texnikasi bo'yicha video-yo'riqnoma",
                                                    "VR-laboratoriyaga kirish"
                                                ],
                                                "prerequisites": [
                                                    "Fizika asoslari kursi (Gidravlika)",
                                                    "Mehnat muhofazasi bo'yicha kirish yo'riqnomasi"
                                                ]
                                            };
                                            const textarea = document.querySelector('textarea[placeholder*="bloomLevels"]');
                                            if (textarea) {
                                                textarea.value = JSON.stringify(template, null, 2);
                                                // Trigger change event to update state
                                                const event = new Event('change', { bubbles: true });
                                                textarea.dispatchEvent(event);
                                                setNewModule({ ...newModule, pedagogical_data: template });
                                            }
                                        }}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors mt-2"
                                    >
                                        {t('load_template')}
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-6 sticky bottom-0 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
                                    >
                                        {loading ? t('saving') : t('save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}