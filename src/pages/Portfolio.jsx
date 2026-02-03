import { useState, useEffect } from 'react';
import { fetchPortfolioItems, deletePortfolioItem } from '@/entities/PortfolioItem';
import { fetchStudents } from '@/entities/Student';
import { useLanguage } from '@/components/shared/LanguageContext';
import {
    Search,
    Plus,
    Filter,
    Folder,
    FolderOpen,
    Award,
    Medal,
    Lightbulb,
    Play,
    User,
    Lock,
    Eye,
    ChevronDown,
    Calendar
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { cn } from '@/lib/utils';

export default function Portfolio() {
    const { t, language } = useLanguage();
    const [items, setItems] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const loadData = async () => {
        setLoading(true);
        try {
            const [portfolioData, studentsData] = await Promise.all([
                fetchPortfolioItems(),
                fetchStudents()
            ]);

            // Use mock data if API returns empty
            const mockData = [
                {
                    id: 1,
                    title_uz_lat: 'Quduq loyihasi',
                    title_uz_cyr: 'Қудуқ лойиҳаси',
                    title_ru: 'Проект скважины',
                    description_uz_lat: '3500m chuqurlikdagi qidiruv quduqini burg\'ilash bo\'yicha to\'liq loyiha',
                    description_uz_cyr: '3500м чуқурликдаги қидирув қудуғини бурғилаш бўйича тўлиқ лойиҳа',
                    description_ru: 'Полный проект бурения разведочной скважины глубиной 3500м',
                    item_type: 'Project',
                    visibility: 'Private',
                    student_id: 1,
                    created_at: '2026-01-31'
                },
                {
                    id: 2,
                    title_uz_lat: 'AR simulyatsiya sertifikati',
                    title_uz_cyr: 'AR симуляция сертификати',
                    title_ru: 'Сертификат AR-симуляции',
                    description_uz_lat: 'Burg\'ilash jarayonlarining AR-simulyatsiyalari kursi bo\'yicha sertifikat',
                    description_uz_cyr: 'Бурғилаш жараёнларининг AR-симуляциялари курси бўйича сертификат',
                    description_ru: 'Сертификат о прохождении курса AR-симуляций буровых процессов',
                    item_type: 'Certificate',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-01-31'
                },
                {
                    id: 3,
                    title_uz_lat: 'Geologik tahlil hisoboti',
                    title_uz_cyr: 'Геологик таҳлил ҳисоботи',
                    title_ru: 'Отчет геологического анализа',
                    description_uz_lat: 'Geologik ma\'lumotlarni tahlil qilish bo\'yicha semestrning eng yaxshi hisoboti',
                    description_uz_cyr: 'Геологик маълумотларни таҳлил қилиш бўйича семестрнинг энг яхши ҳисоботи',
                    description_ru: 'Лучший отчёт семестра по анализу геологических данных',
                    item_type: 'Achievement',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-01-31'
                },
                {
                    id: 4,
                    title_uz_lat: 'Refleksiv kundalik',
                    title_uz_cyr: 'Рефлексив кундалик',
                    title_ru: 'Рефлексивный дневник',
                    description_uz_lat: 'Qayta ishlash texnologiyalari kursi bo\'yicha haftalik refleksiyalar',
                    description_uz_cyr: 'Қайта ишлаш технологиялари курси бўйича ҳафталик рефлексиялар',
                    description_ru: 'Еженедельные рефлексии по курсу технологий переработки',
                    item_type: 'Reflection',
                    visibility: 'Private',
                    student_id: 1,
                    created_at: '2026-01-31'
                },
                {
                    id: 5,
                    title_uz_lat: 'Quvur simulyatsiyasi natijasi',
                    title_uz_cyr: 'Қувур симуляцияси натижаси',
                    title_ru: 'Результат симуляции трубопровода',
                    description_uz_lat: 'Quvur tizimini boshqarish simulyatsiyasini muvaffaqiyatli yakunlash',
                    description_uz_cyr: 'Қувур тизимини бошқариш симуляциясини муваффақиятли якунлаш',
                    description_ru: 'Успешное прохождение симуляции управления трубопроводной системой',
                    item_type: 'Simulation',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-01-31'
                },
                {
                    id: 6,
                    title_uz_lat: '3D burg\'ilash modeli',
                    title_uz_cyr: '3Д бурғилаш модели',
                    title_ru: '3D модель бурения',
                    description_uz_lat: 'Yangi kon uchun burg\'ilash tizimining batafsil 3D modeli',
                    description_uz_cyr: 'Янги кон учун бурғилаш тизимининг батафсил 3Д модели',
                    description_ru: 'Детальная 3D модель системы бурения для нового месторождения',
                    item_type: 'Project',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-02-01'
                },
                {
                    id: 7,
                    title_uz_lat: 'Xavfsizlik texnikasi sertifikati',
                    title_uz_cyr: 'Хавфсизлик техникаси сертификати',
                    title_ru: 'Сертификат по технике безопасности',
                    description_uz_lat: 'Sanoat xavfsizligi va mehnat muhofazasi bo\'yicha xalqaro sertifikat',
                    description_uz_cyr: 'Саноат хавфсизлиги ва меҳнат муҳофазаси бўйиcha халқаро сертификат',
                    description_ru: 'Международный сертификат по промышленной безопасности и охране труда',
                    item_type: 'Certificate',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-02-02'
                },
                {
                    id: 8,
                    title_uz_lat: 'Eng yaxshi talaba tadqiqoti',
                    title_uz_cyr: 'Энг яхши талаба тадқиқоти',
                    title_ru: 'Лучшее студенческое исследование',
                    description_uz_lat: 'Burg\'ilash eritmalarini optimallashtirish bo\'yicha tanlov g\'olibi',
                    description_uz_cyr: 'Бурғилаш эритмаларини оптималлаштириш бўйича танлов ғолиби',
                    description_ru: 'Победитель конкурса по оптимизации буровых растворов',
                    item_type: 'Achievement',
                    visibility: 'Public',
                    student_id: 1,
                    created_at: '2026-02-03'
                },
                {
                    id: 9,
                    title_uz_lat: 'Quduq nazorati simulyatsiyasi 2.0',
                    title_uz_cyr: 'Қудуқ назорати симуляцияси 2.0',
                    title_ru: 'Симуляция управления скважиной 2.0',
                    description_uz_lat: 'Murakkab geologik sharoitlarda quduqni boshqarish bo\'yicha ilg\'or simulyatsiya',
                    description_uz_cyr: 'Мураккаб геологик шароитларда қудуқни бошқариш бўйича илғор симуляция',
                    description_ru: 'Продвинутая симуляция управления скважиной в сложных геологических условиях',
                    item_type: 'Simulation',
                    visibility: 'Private',
                    student_id: 1,
                    created_at: '2026-02-03'
                }
            ];

            const mockStudents = [
                { id: 1, full_name: 'A.O. Abdullaeva' }
            ];

            setItems((portfolioData && portfolioData.length > 0) ? portfolioData : mockData);
            setStudents((studentsData && studentsData.length > 0) ? studentsData : mockStudents);
        } catch (err) {
            console.error('Failed to load data:', err);
            // Set mock data on error - reuse the same mockData defined above
            setItems(mockData);
            setStudents(mockStudents);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    // Helper to get localized field
    const getLoc = (item, field) => {
        const langSuffix = language === 'uz_lat' ? '_uz_lat' : language === 'uz_cyr' ? '_uz_cyr' : '_ru';
        return item[`${field}${langSuffix}`] || item[`${field}_uz_lat`] || item[field] || '';
    };

    const filteredItems = items.filter(item => {
        const title = getLoc(item, 'title');
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || item.item_type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Type colors and icons (Base44 style)
    const typeColors = {
        'Project': 'bg-blue-100',
        'Certificate': 'bg-amber-100',
        'Achievement': 'bg-emerald-100',
        'Reflection': 'bg-violet-100',
        'Simulation': 'bg-rose-100'
    };

    const typeIconColors = {
        'Project': 'bg-blue-100 text-blue-700 border-blue-200',
        'Certificate': 'bg-amber-100 text-amber-700 border-amber-200',
        'Achievement': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Reflection': 'bg-violet-100 text-violet-700 border-violet-200',
        'Simulation': 'bg-rose-100 text-rose-700 border-rose-200'
    };

    const typeIcons = {
        'Project': FolderOpen,
        'Certificate': Award,
        'Achievement': Medal,
        'Reflection': Lightbulb,
        'Simulation': Play
    };

    // Stats Calculation
    const stats = [
        { id: 'Project', label: t('project'), icon: FolderOpen, color: 'blue' },
        { id: 'Certificate', label: t('certificate'), icon: Award, color: 'amber' },
        { id: 'Achievement', label: t('achievement'), icon: Medal, color: 'emerald' },
        { id: 'Reflection', label: t('reflections'), icon: Lightbulb, color: 'violet' },
        { id: 'Simulation', label: t('simulation_result'), icon: Play, color: 'rose' },
    ];

    const getCount = (type) => items.filter(i => i.item_type === type).length;

    const getItemIcon = (type) => {
        const normalizedType = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : 'Project';
        const mapType = {
            'Image': 'Project',
            'Video': 'Simulation',
            'Link': 'Reflection'
        }[normalizedType] || normalizedType;

        const Icon = typeIcons[mapType] || FolderOpen;
        const colorClass = typeIconColors[mapType] || typeIconColors['Project'];

        return (
            <div className={cn("p-2 rounded-lg border", colorClass)}>
                <Icon className="h-5 w-5" />
            </div>
        );
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student?.full_name || t('unknown_student');
    };

    const getVisibilityIcon = (visibility) => {
        if (visibility === 'Private') return <Lock className="h-4 w-4 text-slate-400" />;
        if (visibility === 'Public') return <Eye className="h-4 w-4 text-slate-400" />;
        return <User className="h-4 w-4 text-slate-400" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('portfolio')}</h1>
                    <p className="text-sm text-gray-500 mt-1">{items.length} {t('element')}</p>
                </div>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                    <Plus className="w-4 h-4" />
                    {t('add')}
                </button>
            </div>

            {/* Stats Overview - 5 Panels (like Simulations page) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.id}
                        title={stat.label}
                        value={getCount(stat.id)}
                        subtitle={t('total_items')}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-w-[160px]"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">{t('all_types') || 'Barcha turlar'}</option>
                        {stats.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Grid - 3 Column Layout (Base44 Original) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                        const normalizedType = item.item_type ? item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1).toLowerCase() : 'Project';
                        const mapType = {
                            'Image': 'Project',
                            'Video': 'Simulation',
                            'Link': 'Reflection'
                        }[normalizedType] || normalizedType;
                        const topBarColor = typeColors[mapType] || typeColors['Project'];

                        return (
                            <div key={item.id} className="border border-slate-200/60 bg-white/80 hover:shadow-lg hover:border-slate-300 transition-all duration-300 shadow-sm rounded-xl overflow-hidden">
                                {/* Top Accent Bar */}
                                <div className={cn("h-2", topBarColor)} />

                                {/* Card Content */}
                                <div className="pt-4 px-5 pb-5">
                                    {/* Header - Icon and Visibility */}
                                    <div className="flex items-start justify-between mb-3">
                                        {getItemIcon(item.item_type)}
                                        {getVisibilityIcon(item.visibility)}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                                        {getLoc(item, 'title')}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                        {getLoc(item, 'description') || t('no_description')}
                                    </p>

                                    {/* Footer - Student and Date */}
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{getStudentName(item.student_id)}</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(item.created_at || Date.now()).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Folder className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-medium">{t('no_data')}</p>
                        <p className="text-sm text-gray-500 mt-1">{t('adjust_search')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}