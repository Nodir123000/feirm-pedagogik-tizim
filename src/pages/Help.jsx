import { useState } from 'react';
import {
    Headphones, Search, ChevronDown, ChevronUp,
    MessageSquare, Mail, Phone, BookOpen,
    FileText, PlayCircle, Users, Gamepad2,
    BarChart3, Shield, Send, CheckCircle2,
    Loader2, ChevronRight, ExternalLink,
    AlertCircle, Lightbulb, HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';

const FAQ_DATA = {
    ru: [
        {
            category: 'Студенты и группы',
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            questions: [
                { q: 'Как добавить нового студента?', a: 'Перейдите в раздел «Студенты», нажмите кнопку «+ Добавить» в правом верхнем углу. Заполните форму с данными студента и нажмите «Сохранить».' },
                { q: 'Как создать учебную группу?', a: 'В разделе «Мои группы» нажмите «Создать группу». Введите название группы (например: НГТ-21-1) и добавьте студентов из списка.' },
                { q: 'Как отследить прогресс студента?', a: 'Перейдите в раздел «Студенты», найдите нужного студента и нажмите на иконку «Просмотр профиля». Там отображается весь прогресс.' },
            ]
        },
        {
            category: 'Симуляции и задания',
            icon: Gamepad2,
            color: 'bg-purple-50 text-purple-600',
            questions: [
                { q: 'Как запустить симуляцию для группы?', a: 'В разделе «Симуляции и тренажёры» выберите сценарий, нажмите «Запустить» и выберите нужную группу студентов.' },
                { q: 'Как создать тест или задание?', a: 'Перейдите в «Мои курсы», откройте нужный модуль и нажмите «Добавить задание» или «Создать тест» в соответствующей вкладке.' },
                { q: 'Как проверить выполненные задания?', a: 'В разделе «Задания и тесты» выберите фильтр «Ожидает проверки». Кликните на задание для просмотра ответов студентов.' },
            ]
        },
        {
            category: 'Аналитика и отчёты',
            icon: BarChart3,
            color: 'bg-emerald-50 text-emerald-600',
            questions: [
                { q: 'Как экспортировать отчёт?', a: 'В разделе «Аналитика и отчёты» нажмите кнопку «Экспорт отчёта» в правом верхнем углу. Выберите формат (PDF или Excel) и диапазон дат.' },
                { q: 'Как посмотреть статистику по группе?', a: 'Перейдите в «Мои группы», выберите нужную группу. Вы увидите сводную статистику: средний прогресс, распределение по уровням успеваемости.' },
            ]
        },
        {
            category: 'Аккаунт и безопасность',
            icon: Shield,
            color: 'bg-rose-50 text-rose-500',
            questions: [
                { q: 'Как изменить пароль?', a: 'Перейдите в «Настройки» → вкладка «Безопасность». Введите текущий пароль, затем новый пароль дважды и нажмите «Сохранить».' },
                { q: 'Как изменить язык интерфейса?', a: 'Используйте переключатель языка в верхней панели (рядом с уведомлениями), или перейдите в «Настройки» → «Язык».' },
            ]
        },
    ],
    uz_lat: [
        {
            category: 'Talabalar va guruhlar',
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            questions: [
                { q: 'Yangi talaba qanday qo\'shiladi?', a: '«Talabalar» bo\'limiga o\'ting, yuqori o\'ng burchakdagi «+ Qo\'shish» tugmasini bosing. Talaba ma\'lumotlarini to\'ldiring va «Saqlash» tugmasini bosing.' },
                { q: 'O\'quv guruhi qanday yaratiladi?', a: '«Mening guruhlarim» bo\'limida «Guruh yaratish» tugmasini bosing. Guruh nomini kiriting va talabalarni ro\'yxatdan qo\'shing.' },
            ]
        },
        {
            category: 'Simulyatsiyalar va topshiriqlar',
            icon: Gamepad2,
            color: 'bg-purple-50 text-purple-600',
            questions: [
                { q: 'Guruh uchun simulyatsiya qanday ishga tushiriladi?', a: '«Simulyatsiyalar» bo\'limida stsenariyni tanlang, «Boshlash» tugmasini bosing va kerakli talabalar guruhini tanlang.' },
                { q: 'Test yoki topshiriq qanday yaratiladi?', a: '«Mening kurslarim» bo\'limiga o\'ting, kerakli modulni oching va «Topshiriq qo\'shish» yoki «Test yaratish» tugmasini bosing.' },
            ]
        },
    ]
};

const QUICK_LINKS = {
    ru: [
        { icon: BookOpen,    label: 'Руководство преподавателя',   href: '#', color: 'bg-blue-50 text-blue-600' },
        { icon: PlayCircle,  label: 'Видеоуроки по системе',        href: '#', color: 'bg-purple-50 text-purple-600' },
        { icon: FileText,    label: 'Техническая документация',     href: '#', color: 'bg-emerald-50 text-emerald-600' },
        { icon: Gamepad2,    label: 'Руководство по симуляциям',    href: '#', color: 'bg-amber-50 text-amber-500' },
    ],
    uz_lat: [
        { icon: BookOpen,    label: 'O\'qituvchi qo\'llanmasi',      href: '#', color: 'bg-blue-50 text-blue-600' },
        { icon: PlayCircle,  label: 'Video darslar',                 href: '#', color: 'bg-purple-50 text-purple-600' },
        { icon: FileText,    label: 'Texnik hujjatlar',              href: '#', color: 'bg-emerald-50 text-emerald-600' },
        { icon: Gamepad2,    label: 'Simulyatsiya bo\'yicha qo\'llanma', href: '#', color: 'bg-amber-50 text-amber-500' },
    ],
};

export default function Help() {
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFAQ, setOpenFAQ] = useState(null);
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const L = {
        ru: {
            title: 'Центр поддержки',
            subtitle: 'Найдите ответы на ваши вопросы или свяжитесь с нами',
            search: 'Поиск по часто задаваемым вопросам...',
            faq: 'Часто задаваемые вопросы',
            quickLinks: 'Полезные материалы',
            contact: 'Связаться с нами',
            contactDesc: 'Не нашли ответ? Отправьте нам сообщение',
            subject: 'Тема обращения',
            subjectPlaceholder: 'Опишите кратко вашу проблему...',
            message: 'Сообщение',
            messagePlaceholder: 'Подробно опишите вашу проблему или вопрос...',
            send: 'Отправить',
            sending: 'Отправляем...',
            sentTitle: 'Сообщение отправлено!',
            sentDesc: 'Мы ответим вам в течение 24 часов.',
            email: 'support@feirm.uz',
            phone: '+998 (71) 200-00-01',
            workHours: 'Пн–Пт: 09:00 – 18:00',
            noResults: 'Ничего не найдено по запросу',
        },
        uz_lat: {
            title: 'Yordam markazi',
            subtitle: 'Savollaringizga javob toping yoki biz bilan bog\'laning',
            search: 'Ko\'p so\'raladigan savollarda qidirish...',
            faq: 'Ko\'p so\'raladigan savollar',
            quickLinks: 'Foydali materiallar',
            contact: 'Biz bilan bog\'laning',
            contactDesc: 'Javob topa olmadingizmi? Bizga xabar yuboring',
            subject: 'Murojaat mavzusi',
            subjectPlaceholder: 'Muammoingizni qisqacha tasvirlab bering...',
            message: 'Xabar',
            messagePlaceholder: 'Muammo yoki savolingizni batafsil tasvirlab bering...',
            send: 'Yuborish',
            sending: 'Yuborilmoqda...',
            sentTitle: 'Xabar yuborildi!',
            sentDesc: '24 soat ichida javob beramiz.',
            email: 'support@feirm.uz',
            phone: '+998 (71) 200-00-01',
            workHours: 'Du–Ju: 09:00 – 18:00',
            noResults: 'So\'rov bo\'yicha hech narsa topilmadi',
        },
    };
    const T = L[language] || L.ru;
    const faqData = FAQ_DATA[language] || FAQ_DATA.ru;
    const quickLinks = QUICK_LINKS[language] || QUICK_LINKS.ru;

    // Filter FAQ by search
    const filteredFAQ = searchQuery
        ? faqData.map(cat => ({
            ...cat,
            questions: cat.questions.filter(
                q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.questions.length > 0)
        : faqData;

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));
        setSubmitting(false);
        setSubmitted(true);
        setFormData({ subject: '', message: '' });
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{T.title}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{T.subtitle}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={T.search}
                    className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: FAQ + Quick Links */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Quick links */}
                    {!searchQuery && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-800 mb-3">{T.quickLinks}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {quickLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100
                                            shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group text-center"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}
                                            group-hover:scale-110 transition-transform`}>
                                            <link.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 leading-snug">{link.label}</span>
                                        <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQ */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-indigo-500" />
                            {T.faq}
                        </h2>

                        {filteredFAQ.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-center">
                                <AlertCircle className="w-10 h-10 text-gray-200 mb-3" />
                                <p className="text-sm text-gray-400">{T.noResults}: «{searchQuery}»</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFAQ.map((cat, ci) => (
                                    <div key={ci} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        {/* Category header */}
                                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color}`}>
                                                <cat.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">{cat.category}</span>
                                        </div>
                                        {/* Questions */}
                                        <div className="divide-y divide-gray-50">
                                            {cat.questions.map((item, qi) => {
                                                const key = `${ci}-${qi}`;
                                                const isOpen = openFAQ === key;
                                                return (
                                                    <div key={qi}>
                                                        <button
                                                            onClick={() => setOpenFAQ(isOpen ? null : key)}
                                                            className="w-full flex items-center justify-between px-5 py-3.5 text-left
                                                                hover:bg-gray-50 transition-colors"
                                                        >
                                                            <span className="text-sm font-medium text-gray-700 pr-4">{item.q}</span>
                                                            {isOpen
                                                                ? <ChevronUp className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                                                : <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                                                        </button>
                                                        {isOpen && (
                                                            <div className="px-5 pb-4">
                                                                <div className="flex gap-2.5">
                                                                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Contact info + Form */}
                <div className="space-y-4">
                    {/* Contact info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">{T.contact}</h3>
                        <div className="space-y-3">
                            {[
                                { icon: Mail,  label: 'Email', value: T.email,     href: `mailto:${T.email}` },
                                { icon: Phone, label: language === 'ru' ? 'Телефон' : 'Telefon', value: T.phone, href: `tel:${T.phone}` },
                                { icon: Headphones, label: language === 'ru' ? 'Часы работы' : 'Ish vaqti', value: T.workHours, href: null },
                            ].map((c, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <c.icon className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400">{c.label}</p>
                                        {c.href
                                            ? <a href={c.href} className="text-sm font-medium text-indigo-600 hover:underline">{c.value}</a>
                                            : <p className="text-sm font-medium text-gray-700">{c.value}</p>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-800 mb-1">{T.contact}</h3>
                        <p className="text-xs text-gray-400 mb-4">{T.contactDesc}</p>

                        {submitted ? (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <p className="font-semibold text-gray-800 text-sm">{T.sentTitle}</p>
                                <p className="text-xs text-gray-400 mt-1">{T.sentDesc}</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-4 text-xs text-indigo-600 hover:underline"
                                >
                                    {language === 'ru' ? 'Отправить ещё' : 'Yana yuborish'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{T.subject}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}
                                        placeholder={T.subjectPlaceholder}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                            bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{T.message}</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                                        placeholder={T.messagePlaceholder}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                                            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                            bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600
                                        hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors
                                        disabled:opacity-60 shadow-sm shadow-indigo-200"
                                >
                                    {submitting
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> {T.sending}</>
                                        : <><Send className="w-4 h-4" /> {T.send}</>
                                    }
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
