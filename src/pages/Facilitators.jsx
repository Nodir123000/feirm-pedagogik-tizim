import { useState, useEffect } from 'react';
import { fetchFacilitators, deleteFacilitator } from '@/entities/Facilitator';
import { useLanguage } from '../components/shared/LanguageContext';
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
    UserCircle,
    ArrowLeft,
    Award,
    Calendar,
    Phone,
    Globe,
    BookOpen,
    Clock,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Facilitators() {
    const { t, language } = useLanguage();
    const [facilitators, setFacilitators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedFacilitator, setSelectedFacilitator] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newFacilitator, setNewFacilitator] = useState({
        full_name: '',
        role_type: '',
        department: '',
        specializations: ''
    });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFacilitators();

            const mockFacilitators = [
                {
                    id: 'f1',
                    full_name: 'Damirova Malika',
                    role_type: 'Senior Facilitator',
                    department: "Burg'ilash texnologiyalari",
                    specializations: 'Advanced Drilling',
                    assigned_groups: '4',
                    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
                    bio_ru: 'Старший фасилитатор с 15-летним опытом в технологиях бурения.',
                    bio_uz_lat: 'Burg\'ilash texnologiyalari bo\'yicha 15 yillik tajribaga ega katta fasilitator.',
                    bio_uz_cyr: 'Бурғилаш технологиялари бўйича 15 йиллик тажрибага эга катта фасилитатор.',

                    // Education
                    education: [
                        {
                            degree_ru: 'Кандидат технических наук',
                            degree_uz_lat: 'Texnika fanlari nomzodi',
                            degree_uz_cyr: 'Техника фанлари номзоди',
                            major_ru: 'Технология бурения нефтяных и газовых скважин',
                            major_uz_lat: 'Neft va gaz quduqlarini burg\'ilash texnologiyasi',
                            major_uz_cyr: 'Нефт ва газ қудуқларини бурғилаш технологияси',
                            institution: 'Tashkent State Technical University',
                            year: 2012
                        },
                        {
                            degree_ru: 'Магистр',
                            degree_uz_lat: 'Magistr',
                            degree_uz_cyr: 'Магистр',
                            major_ru: 'Нефтегазовое дело',
                            major_uz_lat: 'Neft-gaz ishi',
                            major_uz_cyr: 'Нефт-газ иши',
                            institution: 'Gubkin Russian State University of Oil and Gas',
                            year: 2008
                        }
                    ],

                    // Certifications
                    certifications: [
                        {
                            name_ru: 'Сертифицированный инструктор IADC WellCAP',
                            name_uz_lat: 'IADC WellCAP sertifikatlangan instruktor',
                            name_uz_cyr: 'IADC WellCAP сертификатланган инструктор',
                            issuer: 'IADC',
                            year: 2020
                        },
                        {
                            name_ru: 'Контроль скважины IWCF уровень 4',
                            name_uz_lat: 'IWCF 4-daraja quduq nazorati',
                            name_uz_cyr: 'IWCF 4-даража қудуқ назорати',
                            issuer: 'IWCF',
                            year: 2018
                        },
                        {
                            name_ru: 'API RP 54 - Безопасность буровых работ',
                            name_uz_lat: 'API RP 54 - Burg\'ilash xavfsizligi',
                            name_uz_cyr: 'API RP 54 - Бурғилаш хавфсизлиги',
                            issuer: 'API',
                            year: 2019
                        }
                    ],

                    // Experience
                    industry_experience: [
                        {
                            position_ru: 'Старший инженер по бурению',
                            position_uz_lat: 'Katta burg\'ilash muhandisi',
                            position_uz_cyr: 'Катта бурғилаш муҳандиси',
                            company: 'Uzbekneftegaz',
                            years: '2008-2018',
                            description_ru: 'Руководство буровыми операциями на месторождениях Устюрт и Бухара-Хива',
                            description_uz_lat: 'Ustyurt va Buxoro-Xiva konlarida burg\'ilash operatsiyalarini boshqarish',
                            description_uz_cyr: 'Устюрт ва Бухоро-Хива конларида бурғилаш операцияларини бошқариш'
                        }
                    ],
                    teaching_experience_years: 6,
                    total_experience_years: 15,

                    // Courses
                    current_courses: [
                        {
                            title_ru: 'Продвинутые технологии бурения',
                            title_uz_lat: 'Ilg\'or burg\'ilash texnologiyalari',
                            title_uz_cyr: 'Илғор бурғилаш технологиялари',
                            module_code: 'DRILL-301'
                        },
                        {
                            title_ru: 'Контроль скважины и управление давлением',
                            title_uz_lat: 'Quduq nazorati va bosimni boshqarish',
                            title_uz_cyr: 'Қудуқ назорати ва босимни бошқариш',
                            module_code: 'DRILL-401'
                        }
                    ],

                    past_courses: [
                        {
                            title_ru: 'Основы бурения',
                            title_uz_lat: 'Burg\'ilash asoslari',
                            title_uz_cyr: 'Бурғилаш асослари',
                            module_code: 'DRILL-101'
                        }
                    ],

                    // Research & Publications
                    publications: [
                        {
                            title_ru: 'Оптимизация параметров бурения в карбонатных коллекторах',
                            title_uz_lat: 'Karbonat kollektorlarda burg\'ilash parametrlarini optimallashtirish',
                            title_uz_cyr: 'Карбонат коллекторларда бурғилаш параметрларини оптималлаштириш',
                            journal: 'Journal of Petroleum Science and Engineering',
                            year: 2021
                        }
                    ],

                    research_interests_ru: ['Автоматизация бурения', 'Мониторинг скважин в реальном времени', 'ИИ в оптимизации бурения'],
                    research_interests_uz_lat: ['Burg\'ilashni avtomatlashtirish', 'Real vaqtda quduq monitoringi', 'Sun\'iy intellekt orqali optimallash'],
                    research_interests_uz_cyr: ['Бурғилашни автоматлаштириш', 'Реал вақтда қудуқ мониторинги', 'Сунъий интеллект орқали оптималлаш'],

                    // Teaching Philosophy
                    teaching_philosophy_ru: 'Я верю в практико-ориентированное обучение, где студенты применяют знания в реальных симуляциях и кейсах из индустрии.',
                    teaching_philosophy_uz_lat: 'Men amaliyotga yo\'naltirilgan ta\'limga ishonaman, bu yerda talabalar bilimlarni real simulyatsiyalar va sanoat keyslarida qo\'llaydilar.',
                    teaching_philosophy_uz_cyr: 'Мен амалиётга йўналтирилган таълимга ишонаман, бу ерда талабалар билимларни реал симуляциялар ва саноат кейсларида қўллайдилар.',

                    // Office Hours
                    office_hours: {
                        monday: '14:00-16:00',
                        wednesday: '10:00-12:00',
                        friday: '14:00-16:00'
                    },

                    // Contact preferences
                    preferred_contact: 'email',
                    response_time: '24 hours',

                    // Languages
                    languages: [
                        { name: 'Uzbek', level: 'Native' },
                        { name: 'Russian', level: 'Fluent' },
                        { name: 'English', level: 'Advanced (C1)' }
                    ],

                    // Professional memberships
                    professional_memberships_ru: ['SPE (Society of Petroleum Engineers)', 'IADC (International Association of Drilling Contractors)'],
                    professional_memberships_uz_lat: ['SPE (Neft muhandislari jamiyati)', 'IADC (Xalqaro burg\'ilash pudratchilar assotsiatsiyasi)'],
                    professional_memberships_uz_cyr: ['SPE (Нефт муҳандислари жамияти)', 'IADC (Халқаро бурғилаш пудратчилар ассотсиацияси)'],

                    // Statistics
                    average_rating: 4.8,
                    total_students: 156,
                    course_completion_rate: 92
                },
                {
                    id: 'f2',
                    full_name: 'Karimov Jaloliddin',
                    role_type: 'Academic Expert',
                    department: 'Geologiya',
                    specializations: 'Petroleum Geology',
                    assigned_groups: '2',
                    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
                    bio_ru: 'Эксперт в области нефтегазовой геологии и разведки.',
                    bio_uz_lat: 'Neft va gaz geologiyasi hamda qidiruv ishlari bo\'yicha ekspert.',
                    bio_uz_cyr: 'Нефт ва газ геологияси ҳамда қидирув ишлари бўйича эксперт.',

                    education: [
                        {
                            degree_ru: 'Доктор геолого-минералогических наук',
                            degree_uz_lat: 'Geologiya-mineralogiya fanlari doktori',
                            degree_uz_cyr: 'Геология-минералогия фанлари доктори',
                            major_ru: 'Геология нефти и газа',
                            major_uz_lat: 'Neft va gaz geologiyasi',
                            major_uz_cyr: 'Нефт ва газ геологияси',
                            institution: 'Gubkin Russian State University of Oil and Gas',
                            year: 2015
                        }
                    ],

                    certifications: [
                        {
                            name_ru: 'Сертифицированный геолог-нефтяник AAPG',
                            name_uz_lat: 'AAPG sertifikatlangan neft geologi',
                            name_uz_cyr: 'AAPG сертификатланган нефт геологи',
                            issuer: 'AAPG',
                            year: 2017
                        },
                        {
                            name_ru: 'Интерпретация сейсмических данных Petrel',
                            name_uz_lat: 'Petrel seysmik ma\'lumotlarni interpretatsiya qilish',
                            name_uz_cyr: 'Petrel сейсмик маълумотларни интерпретация қилиш',
                            issuer: 'Schlumberger',
                            year: 2019
                        }
                    ],

                    industry_experience: [
                        {
                            position_ru: 'Главный геолог',
                            position_uz_lat: 'Bosh geolog',
                            position_uz_cyr: 'Бош геолог',
                            company: 'Lukoil Uzbekistan',
                            years: '2010-2019',
                            description_ru: 'Геологоразведочные работы и оценка запасов на Кандымском месторождении',
                            description_uz_lat: 'Qandim konida geologik qidiruv ishlari va zaxiralarni baholash',
                            description_uz_cyr: 'Қандим конида геологик қидирув ишлари ва заҳираларни баҳолаш'
                        }
                    ],
                    teaching_experience_years: 5,
                    total_experience_years: 14,

                    current_courses: [
                        {
                            title_ru: 'Геология нефти и газа',
                            title_uz_lat: 'Neft va gaz geologiyasi',
                            title_uz_cyr: 'Нефт ва газ геологияси',
                            module_code: 'GEO-201'
                        },
                        {
                            title_ru: 'Сейсмическая интерпретация',
                            title_uz_lat: 'Seysmik interpretatsiya',
                            title_uz_cyr: 'Сейсмик интерпретация',
                            module_code: 'GEO-301'
                        }
                    ],

                    publications: [
                        {
                            title_ru: 'Структурно-тектонические особенности Бухаро-Хивинского региона',
                            title_uz_lat: 'Buxoro-Xiva mintaqasining strukturaviy-tektonik xususiyatlari',
                            title_uz_cyr: 'Бухоро-Хива минтақасининг структуравий-тектоник хусусиятлари',
                            journal: 'AAPG Bulletin',
                            year: 2020
                        }
                    ],

                    research_interests_ru: ['Стратиграфия осадочных бассейнов', '3D геологическое моделирование', 'Оценка углеводородного потенциала'],
                    research_interests_uz_lat: ['Cho\'kindi havzalar stratigrafiyasi', '3D geologik modellashtirish', 'Uglevodorod potentsialini baholash'],
                    research_interests_uz_cyr: ['Чўкинди ҳавзалар стратиграфияси', '3D геологик моделлаштириш', 'Углеводород потенциалини баҳолаш'],

                    teaching_philosophy_ru: 'Геология - это наука наблюдения. Я учу студентов видеть закономерности в данных и принимать обоснованные решения.',
                    teaching_philosophy_uz_lat: 'Geologiya - kuzatish fanidir. Men talabalarni ma\'lumotlardagi qonuniyatlarni ko\'rishga va asosli qarorlar qabul qilishga o\'rgataman.',
                    teaching_philosophy_uz_cyr: 'Геология - кузатиш фанидир. Мен талабаларни маълумотлардаги қонуниятларни кўришга ва асосли қарорлар қабул қилишга ўргатаман.',

                    office_hours: {
                        tuesday: '09:00-11:00',
                        thursday: '14:00-16:00'
                    },

                    languages: [
                        { name: 'Uzbek', level: 'Native' },
                        { name: 'Russian', level: 'Fluent' },
                        { name: 'English', level: 'Fluent' }
                    ],

                    professional_memberships_ru: ['AAPG (Американская ассоциация нефтяных геологов)', 'SPE'],
                    professional_memberships_uz_lat: ['AAPG (Amerika neft geologlari assotsiatsiyasi)', 'SPE'],
                    professional_memberships_uz_cyr: ['AAPG (Америка нефт геологлари ассотсиацияси)', 'SPE'],

                    average_rating: 4.9,
                    total_students: 98,
                    course_completion_rate: 95
                },
                {
                    id: 'f3',
                    full_name: 'Azizov Rustam',
                    role_type: 'Field Mentor',
                    department: 'Xavfsizlik texnikasi',
                    specializations: 'HSE Management',
                    assigned_groups: '5',
                    avatar_url: 'https://randomuser.me/api/portraits/men/52.jpg',
                    bio_ru: 'Полевой ментор по технике безопасности и охране труда.',
                    bio_uz_lat: 'Xavfsizlik texnikasi va mehnat muhofazasi bo\'yicha dala mentori.',
                    bio_uz_cyr: 'Хавфсизлик техникаси ва меҳнат муҳофазаси бўйича дала ментори.',
                    education: [{ degree_ru: 'Магистр', degree_uz_lat: 'Magistr', degree_uz_cyr: 'Магистр', major_ru: 'Промышленная безопасность', major_uz_lat: 'Sanoat xavfsizligi', major_uz_cyr: 'Саноат хавфсизлиги', institution: 'TSTU', year: 2014 }],
                    certifications: [{ name_ru: 'NEBOSH International Diploma', name_uz_lat: 'NEBOSH Xalqaro Diploma', name_uz_cyr: 'NEBOSH Халқаро Диплома', issuer: 'NEBOSH', year: 2016 }],
                    teaching_experience_years: 4,
                    current_courses: [{ title_ru: 'HSE менеджмент', title_uz_lat: 'HSE boshqaruvi', title_uz_cyr: 'HSE бошқаруви', module_code: 'HSE-201' }],
                    office_hours: { monday: '10:00-12:00', friday: '15:00-17:00' },
                    languages: [{ name: 'Uzbek', level: 'Native' }, { name: 'Russian', level: 'Fluent' }],
                    average_rating: 4.7,
                    total_students: 142
                },
                {
                    id: 'f4',
                    full_name: 'Samirova Gulnora',
                    role_type: 'Junior Facilitator',
                    department: "Burg'ilash texnologiyalari",
                    specializations: 'Drilling Fluids',
                    assigned_groups: '1',
                    avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
                    bio_ru: 'Младший фасилитатор, специализирующийся на буровых растворах.',
                    bio_uz_lat: 'Burg\'ilash eritmalari bo\'yicha ixtisoslashgan kichik fasilitator.',
                    bio_uz_cyr: 'Бурғилаш эритмалари бўйича ихтисослашган кичик фасилитатор.',
                    education: [{ degree_ru: 'Магистр', degree_uz_lat: 'Magistr', degree_uz_cyr: 'Магистр', major_ru: 'Буровые растворы', major_uz_lat: 'Burg\'ilash eritmalari', major_uz_cyr: 'Бурғилаш эритмалари', institution: 'TSTU', year: 2020 }],
                    certifications: [{ name_ru: 'Технология буровых растворов', name_uz_lat: 'Burg\'ilash eritmalari texnologiyasi', name_uz_cyr: 'Бурғилаш эритмалари технологияси', issuer: 'MI-SWACO', year: 2021 }],
                    teaching_experience_years: 2,
                    current_courses: [{ title_ru: 'Буровые растворы', title_uz_lat: 'Burg\'ilash eritmalari', title_uz_cyr: 'Бурғилаш эритмалари', module_code: 'DRILL-201' }],
                    office_hours: { tuesday: '13:00-15:00' },
                    languages: [{ name: 'Uzbek', level: 'Native' }, { name: 'Russian', level: 'Fluent' }, { name: 'English', level: 'Intermediate' }],
                    average_rating: 4.6,
                    total_students: 45
                },
                {
                    id: 'f5',
                    full_name: 'Nazarov Orif',
                    role_type: 'Project Coordinator',
                    department: 'Rejalashtirish',
                    specializations: 'Operational Planning',
                    assigned_groups: '3',
                    avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg',
                    bio_ru: 'Координатор проектов по оперативному планированию.',
                    bio_uz_lat: 'Operativ rejalashtirish bo\'yicha loyiha koordinatori.',
                    bio_uz_cyr: 'Оператив режалаштириш бўйича лойиҳа координатори.',
                    education: [{ degree_ru: 'MBA', degree_uz_lat: 'MBA', degree_uz_cyr: 'MBA', major_ru: 'Управление проектами', major_uz_lat: 'Loyihalarni boshqarish', major_uz_cyr: 'Лойиҳаларни бошқариш', institution: 'Westminster International University', year: 2018 }],
                    certifications: [{ name_ru: 'PMP - Project Management Professional', name_uz_lat: 'PMP - Professional loyiha menejeri', name_uz_cyr: 'PMP - Профессионал лойиҳа менежери', issuer: 'PMI', year: 2019 }],
                    teaching_experience_years: 3,
                    current_courses: [{ title_ru: 'Управление проектами', title_uz_lat: 'Loyihalarni boshqarish', title_uz_cyr: 'Лойиҳаларни бошқариш', module_code: 'MGT-301' }],
                    office_hours: { wednesday: '11:00-13:00', thursday: '11:00-13:00' },
                    languages: [{ name: 'Uzbek', level: 'Native' }, { name: 'Russian', level: 'Fluent' }, { name: 'English', level: 'Advanced' }],
                    average_rating: 4.5,
                    total_students: 87
                },
                {
                    id: 'f6',
                    full_name: 'Usmonova Sevara',
                    role_type: 'Research Lead',
                    department: 'Geologiya',
                    specializations: 'Geophysical Surveys',
                    assigned_groups: '2',
                    avatar_url: 'https://randomuser.me/api/portraits/women/28.jpg',
                    bio_ru: 'Руководитель исследовательских работ в геофизике.',
                    bio_uz_lat: 'Geofizikada tadqiqot ishlari rahbari.',
                    bio_uz_cyr: 'Геофизикада тадқиқот ишлари раҳбари.',
                    education: [{ degree_ru: 'Кандидат физико-математических наук', degree_uz_lat: 'Fizika-matematika fanlari nomzodi', degree_uz_cyr: 'Физика-математика фанлари номзоди', major_ru: 'Геофизика', major_uz_lat: 'Geofizika', major_uz_cyr: 'Геофизика', institution: 'Moscow State University', year: 2016 }],
                    certifications: [{ name_ru: 'Сейсмическая интерпретация', name_uz_lat: 'Seysmik interpretatsiya', name_uz_cyr: 'Сейсмик интерпретация', issuer: 'CGG', year: 2018 }],
                    teaching_experience_years: 4,
                    current_courses: [{ title_ru: 'Геофизические исследования', title_uz_lat: 'Geofizik tadqiqotlar', title_uz_cyr: 'Геофизик тадқиқотлар', module_code: 'GEO-401' }],
                    office_hours: { monday: '09:00-11:00', wednesday: '14:00-16:00' },
                    languages: [{ name: 'Uzbek', level: 'Native' }, { name: 'Russian', level: 'Fluent' }, { name: 'English', level: 'Fluent' }],
                    average_rating: 4.9,
                    total_students: 76
                },
                {
                    id: 'f7',
                    full_name: 'Ismoilov Farhod',
                    role_type: 'Safety Inspector',
                    department: 'Xavfsizlik texnikasi',
                    specializations: 'Industrial Safety',
                    assigned_groups: '6',
                    avatar_url: 'https://randomuser.me/api/portraits/men/46.jpg',
                    bio_ru: 'Инспектор по промышленной безопасности.',
                    bio_uz_lat: 'Sanoat xavfsizligi bo\'yicha inspektor.',
                    bio_uz_cyr: 'Саноат хавфсизлиги бўйича инспектор.',
                    education: [{ degree_ru: 'Бакалавр', degree_uz_lat: 'Bakalavr', degree_uz_cyr: 'Бакалавр', major_ru: 'Техносферная безопасность', major_uz_lat: 'Texnosfera xavfsizligi', major_uz_cyr: 'Техносфера хавфсизлиги', institution: 'TSTU', year: 2015 }],
                    certifications: [{ name_ru: 'Аудитор ISO 45001', name_uz_lat: 'ISO 45001 auditori', name_uz_cyr: 'ISO 45001 аудитори', issuer: 'ISO', year: 2020 }],
                    teaching_experience_years: 5,
                    current_courses: [{ title_ru: 'Промышленная безопасность', title_uz_lat: 'Sanoat xavfsizligi', title_uz_cyr: 'Саноат хавфсизлиги', module_code: 'HSE-301' }],
                    office_hours: { tuesday: '10:00-12:00', thursday: '10:00-12:00' },
                    languages: [{ name: 'Uzbek', level: 'Native' }, { name: 'Russian', level: 'Fluent' }],
                    average_rating: 4.8,
                    total_students: 165
                }
            ];

            setFacilitators((data && data.length > 0) ? [...data, ...mockFacilitators] : mockFacilitators);
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

    const handleCreateFacilitator = () => {
        setIsCreateModalOpen(true);
    };

    const handleSaveFacilitator = () => {
        if (!newFacilitator.full_name || !newFacilitator.role_type) {
            alert(t('name_required'));
            return;
        }

        const facilitator = {
            id: `f${Date.now()}`,
            ...newFacilitator,
            assigned_groups: '0',
            avatar_url: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
            education: [],
            certifications: [],
            industry_experience: [],
            current_courses: [],
            languages: []
        };

        setFacilitators([facilitator, ...facilitators]);
        setIsCreateModalOpen(false);
        setNewFacilitator({ full_name: '', role_type: '', department: '', specializations: '' });
        alert(t('facilitator_created_success'));
    };

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
            {!isDetailsOpen ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <UserCog className="w-8 h-8 text-orange-600" />
                                {t('facilitators')}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {t('facilitators_subtitle')}
                            </p>
                        </div>
                        <button
                            onClick={handleCreateFacilitator}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('add_facilitator')}
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search_by_name')}
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
                                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{facilitator.role_type || t('facilitator')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{facilitator.department || t('department')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{facilitator.specializations || 'Academic Expert'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{facilitator.assigned_groups || '0'} {t('assigned_groups')}</span>
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
                                            <button
                                                onClick={() => {
                                                    setSelectedFacilitator(facilitator);
                                                    setIsDetailsOpen(true);
                                                }}
                                                className="flex items-center text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors gap-1 uppercase tracking-tight"
                                            >
                                                {t('profile')}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Detail View
                <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 group"
                                    title={t('back')}
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedFacilitator?.full_name}
                                    </h2>
                                    <p className="text-sm text-orange-600 font-bold uppercase tracking-wide mt-1">
                                        {selectedFacilitator?.role_type || t('facilitator')}
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
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                        {selectedFacilitator?.avatar_url ? (
                                            <img
                                                src={selectedFacilitator.avatar_url}
                                                alt={selectedFacilitator.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                                                <UserCircle className="w-16 h-16 text-orange-600" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedFacilitator?.full_name}</h3>
                                    <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-4">
                                        {selectedFacilitator?.role_type}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-xl p-3 shadow-sm">
                                            <div className="text-2xl font-bold text-orange-600">{selectedFacilitator?.assigned_groups || '0'}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{t('groups')}</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 shadow-sm">
                                            <div className="text-2xl font-bold text-emerald-600">4.8</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{t('rating')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                    <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">{t('contact_info')}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">facilitator@feirm.uz</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">+998 90 123 45 67</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">Tashkent, Uzbekistan</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Tabbed Detailed Info */}
                            <div className="lg:col-span-2">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-5 mb-6">
                                        <TabsTrigger value="overview">{t('overview') || 'Overview'}</TabsTrigger>
                                        <TabsTrigger value="education">{t('education') || 'Education'}</TabsTrigger>
                                        <TabsTrigger value="experience">{t('experience') || 'Experience'}</TabsTrigger>
                                        <TabsTrigger value="courses">{t('courses') || 'Courses'}</TabsTrigger>
                                        <TabsTrigger value="research">{t('research') || 'Research'}</TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Biography */}
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <UserCircle className="w-4 h-4 text-orange-600" />
                                                {t('biography') || 'Biography'}
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 rounded-xl p-4">
                                                "{selectedFacilitator?.[`bio_${language}`] || selectedFacilitator?.bio_uz_lat || 'Experienced educator committed to excellence.'}"
                                            </p>
                                        </div>

                                        {/* Teaching Philosophy */}
                                        {selectedFacilitator?.[`teaching_philosophy_${language}`] && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-orange-600" />
                                                    {t('teaching_philosophy') || 'Teaching Philosophy'}
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4 border border-blue-100">
                                                    {selectedFacilitator[`teaching_philosophy_${language}`]}
                                                </p>
                                            </div>
                                        )}

                                        {/* Department & Specializations */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-orange-600" />
                                                    {t('department') || 'Department'}
                                                </h4>
                                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                                    <p className="text-sm font-bold text-orange-900">
                                                        {selectedFacilitator?.department || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-orange-600" />
                                                    {t('specializations') || 'Specializations'}
                                                </h4>
                                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                                    <p className="text-sm font-bold text-emerald-900">
                                                        {selectedFacilitator?.specializations || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Languages */}
                                        {selectedFacilitator?.languages && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-orange-600" />
                                                    {t('languages') || 'Languages'}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedFacilitator.languages.map((lang, idx) => (
                                                        <Badge key={idx} variant="outline" className="bg-purple-50 border-purple-200 text-purple-900">
                                                            {lang.name} ({lang.level})
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Education Tab */}
                                    <TabsContent value="education" className="space-y-6">
                                        {/* Degrees */}
                                        {selectedFacilitator?.education && selectedFacilitator.education.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-orange-600" />
                                                    {t('degrees') || 'Academic Degrees'}
                                                </h4>
                                                <div className="space-y-4">
                                                    {selectedFacilitator.education.map((edu, idx) => (
                                                        <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h5 className="font-bold text-blue-900 mb-1">
                                                                        {edu[`degree_${language}`] || edu.degree_ru}
                                                                    </h5>
                                                                    <p className="text-sm text-blue-700 mb-2">
                                                                        {edu[`major_${language}`] || edu.major_ru}
                                                                    </p>
                                                                    <p className="text-xs text-blue-600">
                                                                        {edu.institution}
                                                                    </p>
                                                                </div>
                                                                <div className="bg-blue-900 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                                                    {edu.year}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Certifications */}
                                        {selectedFacilitator?.certifications && selectedFacilitator.certifications.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-orange-600" />
                                                    {t('certifications') || 'Professional Certifications'}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {selectedFacilitator.certifications.map((cert, idx) => (
                                                        <div key={idx} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Award className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-amber-900 truncate">
                                                                        {cert[`name_${language}`] || cert.name_ru}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between text-[10px] text-amber-700">
                                                                <span>{cert.issuer}</span>
                                                                <span className="font-bold">{cert.year}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Experience Tab */}
                                    <TabsContent value="experience" className="space-y-6">
                                        {/* Experience Summary */}
                                        {(selectedFacilitator?.teaching_experience_years || selectedFacilitator?.total_experience_years) && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedFacilitator.teaching_experience_years && (
                                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100 text-center">
                                                        <div className="text-3xl font-bold text-orange-600 mb-1">
                                                            {selectedFacilitator.teaching_experience_years}
                                                        </div>
                                                        <div className="text-xs text-orange-700 font-bold uppercase tracking-wide">
                                                            {t('years_teaching') || 'Years Teaching'}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedFacilitator.total_experience_years && (
                                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 text-center">
                                                        <div className="text-3xl font-bold text-emerald-600 mb-1">
                                                            {selectedFacilitator.total_experience_years}
                                                        </div>
                                                        <div className="text-xs text-emerald-700 font-bold uppercase tracking-wide">
                                                            {t('years_total') || 'Total Years'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Industry Experience */}
                                        {selectedFacilitator?.industry_experience && selectedFacilitator.industry_experience.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-orange-600" />
                                                    {t('industry_experience') || 'Industry Experience'}
                                                </h4>
                                                <div className="space-y-4">
                                                    {selectedFacilitator.industry_experience.map((exp, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h5 className="font-bold text-gray-900">
                                                                        {exp[`position_${language}`] || exp.position_ru}
                                                                    </h5>
                                                                    <p className="text-sm text-orange-600 font-semibold">{exp.company}</p>
                                                                </div>
                                                                <Badge variant="outline" className="bg-gray-100">
                                                                    {exp.years}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                                {exp[`description_${language}`] || exp.description_ru}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Courses Tab */}
                                    <TabsContent value="courses" className="space-y-6">
                                        {/* Current Courses */}
                                        {selectedFacilitator?.current_courses && selectedFacilitator.current_courses.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-orange-600" />
                                                    {t('current_courses') || 'Current Courses'}
                                                </h4>
                                                <div className="space-y-3">
                                                    {selectedFacilitator.current_courses.map((course, idx) => (
                                                        <div key={idx} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h5 className="font-bold text-orange-900 mb-1">
                                                                        {course[`title_${language}`] || course.title_ru}
                                                                    </h5>
                                                                    <p className="text-xs text-orange-600 font-mono">
                                                                        {course.module_code}
                                                                    </p>
                                                                </div>
                                                                <Badge className="bg-orange-600 text-white">
                                                                    {t('active') || 'Active'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Past Courses */}
                                        {selectedFacilitator?.past_courses && selectedFacilitator.past_courses.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-600" />
                                                    {t('past_courses') || 'Past Courses'}
                                                </h4>
                                                <div className="space-y-2">
                                                    {selectedFacilitator.past_courses.map((course, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-semibold text-gray-700">
                                                                    {course[`title_${language}`] || course.title_ru}
                                                                </p>
                                                                <span className="text-xs text-gray-500 font-mono">
                                                                    {course.module_code}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Office Hours */}
                                        {selectedFacilitator?.office_hours && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-orange-600" />
                                                    {t('office_hours') || 'Office Hours'}
                                                </h4>
                                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2">
                                                    {Object.entries(selectedFacilitator.office_hours).map(([day, time]) => (
                                                        <div key={day} className="flex items-center justify-between text-sm">
                                                            <span className="font-semibold text-blue-900 capitalize">{day}</span>
                                                            <span className="text-blue-700 font-mono">{time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Research Tab */}
                                    <TabsContent value="research" className="space-y-6">
                                        {/* Publications */}
                                        {selectedFacilitator?.publications && selectedFacilitator.publications.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-orange-600" />
                                                    {t('publications') || 'Publications'}
                                                </h4>
                                                <div className="space-y-4">
                                                    {selectedFacilitator.publications.map((pub, idx) => (
                                                        <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                                                            <h5 className="font-bold text-indigo-900 mb-2 leading-snug">
                                                                {pub[`title_${language}`] || pub.title_ru}
                                                            </h5>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-indigo-700 italic">{pub.journal}</span>
                                                                <Badge className="bg-indigo-600 text-white">{pub.year}</Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Research Interests */}
                                        {selectedFacilitator?.[`research_interests_${language}`] && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-orange-600" />
                                                    {t('research_interests') || 'Research Interests'}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedFacilitator[`research_interests_${language}`].map((interest, idx) => (
                                                        <Badge key={idx} variant="outline" className="bg-teal-50 border-teal-200 text-teal-900">
                                                            {interest}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Professional Memberships */}
                                        {selectedFacilitator?.[`professional_memberships_${language}`] && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-orange-600" />
                                                    {t('professional_memberships') || 'Professional Memberships'}
                                                </h4>
                                                <div className="space-y-2">
                                                    {selectedFacilitator[`professional_memberships_${language}`].map((membership, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                            <p className="text-sm font-semibold text-gray-700">{membership}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Statistics */}
                                        {(selectedFacilitator?.average_rating || selectedFacilitator?.total_students) && (
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-orange-600" />
                                                    {t('statistics') || 'Statistics'}
                                                </h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {selectedFacilitator.average_rating && (
                                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 text-center">
                                                            <div className="text-2xl font-bold text-emerald-600 mb-1">
                                                                {selectedFacilitator.average_rating}
                                                            </div>
                                                            <div className="text-[10px] text-emerald-700 font-bold uppercase">
                                                                {t('avg_rating') || 'Avg Rating'}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedFacilitator.total_students && (
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
                                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                                {selectedFacilitator.total_students}
                                                            </div>
                                                            <div className="text-[10px] text-blue-700 font-bold uppercase">
                                                                {t('students') || 'Students'}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedFacilitator.course_completion_rate && (
                                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 text-center">
                                                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                                                {selectedFacilitator.course_completion_rate}%
                                                            </div>
                                                            <div className="text-[10px] text-purple-700 font-bold uppercase">
                                                                {t('completion') || 'Completion'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Create Facilitator Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('create_facilitator_title')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('facilitator_name')}</Label>
                            <Input
                                id="name"
                                value={newFacilitator.full_name}
                                onChange={(e) => setNewFacilitator({ ...newFacilitator, full_name: e.target.value })}
                                placeholder="e.g. Alisher Zokirov"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">{t('role_type')}</Label>
                            <Input
                                id="role"
                                value={newFacilitator.role_type}
                                onChange={(e) => setNewFacilitator({ ...newFacilitator, role_type: e.target.value })}
                                placeholder="e.g. Senior Lecturer"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dept">{t('department')}</Label>
                            <select
                                id="dept"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newFacilitator.department}
                                onChange={(e) => setNewFacilitator({ ...newFacilitator, department: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.filter(d => d !== 'All').map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="spec">{t('specializations')}</Label>
                            <Input
                                id="spec"
                                value={newFacilitator.specializations}
                                onChange={(e) => setNewFacilitator({ ...newFacilitator, specializations: e.target.value })}
                                placeholder="e.g. Drilling, AI"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleSaveFacilitator}>{t('create')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}