import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    uz_lat: {
        dashboard: "Bosh sahifa",
        students: "Talabalar",
        modules: "O'quv modullari",
        simulations: "Simulyatsiyalar",
        portfolio: "Portfolio",
        reflections: "Refleksiya",
        trajectories: "Traektoriyalar",
        facilitators: "Fasilitatorlar",
        monitoring: "Monitoring",
        sbcm: "SBCM Model",
        content_gen: "Kontent Generator",
        welcome: "Xush kelibsiz",
        search: "Qidirish...",
        filter: "Filtrlash",
        save: "Saqlash",
        cancel: "Bekor qilish",
        edit: "Tahrirlash",
        delete: "O'chirish",
        add: "Qo'shish",
        view: "Ko'rish",
        back: "Orqaga",
        next: "Keyingi",
        loading: "Yuklanmoqda...",
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Neft-gaz sohasida innovatsion pedagogik tizim",
        professional_competency: "Kasbiy kompetensiya",
        meta_competency: "Metakompetensiya",
        motivation_level: "Motivatsiya darajasi",
        reflective_skills: "Refleksiv ko'nikmalar",
        drilling: "Burg'ulash",
        production: "Ishlab chiqarish",
        processing: "Qayta ishlash",
        transportation: "Tashish",
        geology: "Geologiya",
        total_students: "Jami talabalar",
        active_modules: "Faol modullar",
        average_progress: "O'rtacha natija",
        progress_tracking: "Natijalar tahlili",
        competency_analysis: "Kompetensiyalar tahlili",
        no_data: "Ma'lumot topilmadi",
        active: "Faol",
        published: "Chop etilgan",
        hard_level: "Murakkab",
        global_indicator: "Global ko'rsatkich",
        pending_review: "Tekshirilmoqda",
        attention_required: "Diqqat talab",
        at_risk_students: "Xavf ostidagi talabalar",
        success: "Muvaffaqiyatli!",
    },
    uz_cyr: {
        dashboard: "Бош саҳифа",
        students: "Талабалар",
        modules: "Ўқув моделлари",
        simulations: "Симуляциялар",
        portfolio: "Портфолио",
        reflections: "Рефлексия",
        trajectories: "Траекториялар",
        facilitators: "Фасилитаторлар",
        monitoring: "Мониторинг",
        sbcm: "SBCM Модели",
        content_gen: "Контент Генератор",
        welcome: "Хуш келибсиз",
        search: "Қидириш...",
        filter: "Фильтрлаш",
        save: "Сақлаш",
        cancel: "Бекор қилиш",
        edit: "Таҳрирлаш",
        delete: "Ўчириш",
        add: "Қўшиш",
        view: "Кўриш",
        back: "Орқага",
        next: "Кейинги",
        loading: "Юкланмоқда...",
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Нефт-газ соҳасида инновацион педагогик тизим",
        professional_competency: "Касбий компетенция",
        meta_competency: "Метакомпетенция",
        motivation_level: "Мотивация даражаси",
        reflective_skills: "Рефлексив кўникмалар",
        drilling: "Бурғулаш",
        production: "Ишлаб чиқариш",
        processing: "Қайта ишлаш",
        transportation: "Ташиш",
        geology: "Геология",
        total_students: "Жами талабалар",
        active_modules: "Фаол модуллар",
        average_progress: "Ўртача натижа",
        progress_tracking: "Натижалар таҳлили",
        competency_analysis: "Компетенциялар таҳлили",
        no_data: "Маълумот топилмади",
        active: "Фаол",
        published: "Чоп этилган",
        hard_level: "Мураккаб",
        global_indicator: "Глобал кўрсаткич",
        pending_review: "Текширилмоқда",
        attention_required: "Диққат талаб",
        at_risk_students: "Хавф остидаги талабалар",
        success: "Муваффақиятли!",
    },
    ru: {
        dashboard: "Панель управления",
        students: "Студенты",
        modules: "Учебные модули",
        simulations: "Симуляции",
        portfolio: "Портфолио",
        reflections: "Рефлексия",
        trajectories: "Траектории",
        facilitators: "Фасилитаторы",
        monitoring: "Мониторинг",
        sbcm: "SBCM Модель",
        content_gen: "Генератор контента",
        welcome: "Добро пожаловать",
        search: "Поиск...",
        filter: "Фильтр",
        save: "Сохранить",
        cancel: "Отмена",
        edit: "Редактировать",
        delete: "Удалить",
        add: "Добавить",
        view: "Просмотр",
        back: "Назад",
        next: "Далее",
        loading: "Загрузка...",
        feirm_title: "FEIRM - Facilitator-Enhanced Instructional Role Model",
        feirm_subtitle: "Инновационная педагогическая система",
        professional_competency: "Проф. компетенция",
        meta_competency: "Метакомпетентность",
        motivation_level: "Уровень мотивации",
        reflective_skills: "Рефлексия",
        drilling: "Бурение",
        production: "Производство",
        processing: "Переработка",
        transportation: "Транспортировка",
        geology: "Геология",
        total_students: "Всего студентов",
        active_modules: "Учебные модули",
        average_progress: "Средний прогресс",
        progress_tracking: "Аналитика прогресса",
        competency_analysis: "Анализ компетенций",
        no_data: "Данные не найдены",
        active: "Активные",
        published: "Опубликовано",
        hard_level: "Сложные",
        global_indicator: "Глобальный показатель",
        pending_review: "На проверке",
        attention_required: "Требуют внимания",
        at_risk_students: "Студенты в зоне риска",
        success: "Успешно!",
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