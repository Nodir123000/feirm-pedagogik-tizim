import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    uz_lat: {
        // Navigation
        dashboard: "Bosh sahifa",
        modules: "O'quv modullari",
        students: "Talabalar",
        facilitators: "Fasilitatorlar",
        portfolio: "Portfolio",
        monitoring: "Monitoring",
        settings: "Sozlamalar",

        // Common
        welcome: "Xush kelibsiz",
        search: "Qidirish",
        filter: "Filtrlash",
        save: "Saqlash",
        cancel: "Bekor qilish",
        edit: "Tahrirlash",
        delete: "O'chirish",
        add: "Qo'shish",
        view: "Ko'rish",
        back: "Orqaga",
        next: "Keyingi",
        previous: "Oldingi",
        submit: "Yuborish",
        loading: "Yuklanmoqda...",

        // FEIRM specific
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Neft-gaz sohasida innovatsion pedagogik tizim",
        professional_competency: "Kasbiy kompetensiya",
        meta_competency: "Metapredmet kompetensiyalar",
        motivation_level: "Motivatsiya darajasi",
        reflective_skills: "Refleksiv ko'nikmalar",

        // Module types
        simulation: "Simulyatsiya",
        case_study: "Keys-stadi",
        project: "Loyiha",
        laboratory: "Laboratoriya",
        theory: "Nazariya",

        // Assessment types
        self_assessment: "O'z-o'zini baholash",
        peer_assessment: "O'zaro baholash",
        facilitator_assessment: "Fasilitator bahosi",
        automated_assessment: "Avtomatik baholash",

        // Specializations
        drilling: "Burg'ulash",
        production: "Ishlab chiqarish",
        processing: "Qayta ishlash",
        transportation: "Tashish",
        geology: "Geologiya",

        // Difficulty levels
        beginner: "Boshlang'ich",
        intermediate: "O'rta",
        advanced: "Yuqori",

        // Stats
        total_students: "Jami talabalar",
        active_modules: "Faol modullar",
        completed_assessments: "Bajarilgan baholashlar",
        average_progress: "O'rtacha progress",

        // Roles
        facilitator: "Fasilitator",
        moderator: "Moderator",
        coordinator: "Koordinator",
        mentor: "Mentor",

        // Messages
        no_data: "Ma'lumot topilmadi",
        success: "Muvaffaqiyatli!",
        error: "Xatolik yuz berdi",
        confirm_delete: "O'chirishni tasdiqlaysizmi?",

        // MPMS
        mpms_title: "MPMS - Ko'p darajali pedagogik monitoring tizimi",
        progress_tracking: "Progress kuzatuvi",
        competency_analysis: "Kompetensiya tahlili",
        reflective_session: "Refleksiv sessiya",

        // SBCM
        sbcm: "SBCM",
        sbcm_full: "Simulation-Based Competency Model",

        // New sections
        trajectories: "Traektoriyalar",
        simulations: "Simulyatsiyalar",
        reflections: "Refleksiyalar",
        analytics: "Analitika",
        content_gen: "Kontent generatori",
    },

    uz_cyr: {
        // Navigation
        dashboard: "Бош саҳифа",
        modules: "Ўқув модуллари",
        students: "Талабалар",
        facilitators: "Фасилитаторлар",
        portfolio: "Портфолио",
        monitoring: "Мониторинг",
        settings: "Созламалар",

        // Common
        welcome: "Хуш келибсиз",
        search: "Қидириш",
        filter: "Фильтрлаш",
        save: "Сақлаш",
        cancel: "Бекор қилиш",
        edit: "Таҳрирлаш",
        delete: "Ўчириш",
        add: "Қўшиш",
        view: "Кўриш",
        back: "Орқага",
        next: "Кейинги",
        previous: "Олдинги",
        submit: "Юбориш",
        loading: "Юкланмоқда...",

        // FEIRM specific
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Нефт-газ соҳасида инновацион педагогик тизим",
        professional_competency: "Касбий компетенсия",
        meta_competency: "Метапредмет компетенсиялар",
        motivation_level: "Мотивация даражаси",
        reflective_skills: "Рефлексив кўникмалар",

        // Module types
        simulation: "Симуляция",
        case_study: "Кейс-стади",
        project: "Лойиҳа",
        laboratory: "Лаборатория",
        theory: "Назария",

        // Assessment types
        self_assessment: "Ўз-ўзини баҳолаш",
        peer_assessment: "Ўзаро баҳолаш",
        facilitator_assessment: "Фасилитатор баҳоси",
        automated_assessment: "Автоматик баҳолаш",

        // Specializations
        drilling: "Бурғулаш",
        production: "Ишлаб чиқариш",
        processing: "Қайта ишлаш",
        transportation: "Ташиш",
        geology: "Геология",

        // Difficulty levels
        beginner: "Бошланғич",
        intermediate: "Ўрта",
        advanced: "Юқори",

        // Stats
        total_students: "Жами талабалар",
        active_modules: "Фаол модуллар",
        completed_assessments: "Бажарилган баҳолашлар",
        average_progress: "Ўртача прогресс",

        // Roles
        facilitator: "Фасилитатор",
        moderator: "Модератор",
        coordinator: "Координатор",
        mentor: "Ментор",

        // Messages
        no_data: "Маълумот топилмади",
        success: "Муваффақиятли!",
        error: "Хатолик юз берди",
        confirm_delete: "Ўчиришни тасдиқлайсизми?",

        // MPMS
        mpms_title: "MPMS - Кўп даражали педагогик мониторинг тизими",
        progress_tracking: "Прогресс кузатуви",
        competency_analysis: "Компетенсия таҳлили",
        reflective_session: "Рефлексив сессия",

        // SBCM
        sbcm: "SBCM",
        sbcm_full: "Simulation-Based Competency Model",

        // New sections
        trajectories: "Траекториялар",
        simulations: "Симуляциялар",
        reflections: "Рефлексиялар",
        analytics: "Аналитика",
        content_gen: "Контент генератори",
    },

    ru: {
        // Navigation
        dashboard: "Главная",
        modules: "Учебные модули",
        students: "Студенты",
        facilitators: "Фасилитаторы",
        portfolio: "Портфолио",
        monitoring: "Мониторинг",
        settings: "Настройки",

        // Common
        welcome: "Добро пожаловать",
        search: "Поиск",
        filter: "Фильтр",
        save: "Сохранить",
        cancel: "Отмена",
        edit: "Редактировать",
        delete: "Удалить",
        add: "Добавить",
        view: "Просмотр",
        back: "Назад",
        next: "Далее",
        previous: "Назад",
        submit: "Отправить",
        loading: "Загрузка...",

        // FEIRM specific
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Инновационная педагогическая система для нефтегазовой отрасли",
        professional_competency: "Профессиональная компетентность",
        meta_competency: "Метапредметные компетенции",
        motivation_level: "Уровень мотивации",
        reflective_skills: "Рефлексивные навыки",

        // Module types
        simulation: "Симуляция",
        case_study: "Кейс-стади",
        project: "Проект",
        laboratory: "Лаборатория",
        theory: "Теория",

        // Assessment types
        self_assessment: "Самооценка",
        peer_assessment: "Взаимооценка",
        facilitator_assessment: "Оценка фасилитатора",
        automated_assessment: "Автоматическая оценка",

        // Specializations
        drilling: "Бурение",
        production: "Добыча",
        processing: "Переработка",
        transportation: "Транспортировка",
        geology: "Геология",

        // Difficulty levels
        beginner: "Начальный",
        intermediate: "Средний",
        advanced: "Продвинутый",

        // Stats
        total_students: "Всего студентов",
        active_modules: "Активных модулей",
        completed_assessments: "Завершённых оценок",
        average_progress: "Средний прогресс",

        // Roles
        facilitator: "Фасилитатор",
        moderator: "Модератор",
        coordinator: "Координатор",
        mentor: "Ментор",

        // Messages
        no_data: "Данные не найдены",
        success: "Успешно!",
        error: "Произошла ошибка",
        confirm_delete: "Подтвердите удаление",

        // MPMS
        mpms_title: "MPMS - Многоуровневая система педагогического мониторинга",
        progress_tracking: "Отслеживание прогресса",
        competency_analysis: "Анализ компетенций",
        reflective_session: "Рефлексивная сессия",

        // SBCM
        sbcm: "SBCM",
        sbcm_full: "Simulation-Based Competency Model",

        // New sections
        trajectories: "Траектории",
        simulations: "Симуляции",
        reflections: "Рефлексии",
        analytics: "Аналитика",
        content_gen: "Генератор контента",
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('feirm_language') || 'uz_lat';
        }
        return 'uz_lat';
    });

    useEffect(() => {
        localStorage.setItem('feirm_language', language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations['ru']?.[key] || key;
    };

    const getLocalizedField = (item, fieldPrefix) => {
        if (!item) return '';
        const langSuffix = language === 'uz_lat' ? '_uz_lat' : language === 'uz_cyr' ? '_uz_cyr' : '_ru';
        return item[`${fieldPrefix}${langSuffix}`] || item[`${fieldPrefix}_ru`] || item[fieldPrefix] || '';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedField, translations }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export const languageOptions = [
    { code: 'uz_lat', name: "O'zbekcha (lotin)", flag: '🇺🇿' },
    { code: 'uz_cyr', name: 'Ўзбекча (кирил)', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];