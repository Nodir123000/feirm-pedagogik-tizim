import { useState } from 'react';
import {
    User, Bell, Globe, Shield, Palette, Monitor,
    Save, Camera, Eye, EyeOff, Check, ChevronRight,
    Moon, Sun, Languages, Key, Mail, Phone,
    BookOpen, GraduationCap, Building2, Loader2
} from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';

const TABS = ['profile', 'notifications', 'language', 'security', 'appearance'];

export default function Settings() {
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Profile form state
    const [profile, setProfile] = useState({
        fullName: 'Абдуллаева Асила',
        email: 'asila.abdullaeva@feirm.uz',
        phone: '+998 90 123 45 67',
        subject: language === 'ru' ? 'Основы нефтегазовой технологии' : 'Neft-gaz texnologiyasi asoslari',
        department: language === 'ru' ? 'Кафедра нефтегазового дела' : 'Neft-gaz ishi kafedrasi',
        role: language === 'ru' ? 'Преподаватель' : "O'qituvchi",
    });

    // Notification settings
    const [notifs, setNotifs] = useState({
        newMessage: true, taskSubmit: true, simComplete: true,
        systemUpdate: false, weeklyReport: true, emailNotif: true,
    });

    // Appearance
    const [theme, setTheme] = useState('light');
    const [accentColor, setAccentColor] = useState('indigo');

    const labels = {
        ru: {
            settings: 'Настройки',
            subtitle: 'Управление профилем и настройками системы',
            profile: 'Профиль',
            notifications: 'Уведомления',
            language: 'Язык',
            security: 'Безопасность',
            appearance: 'Внешний вид',
            fullName: 'Полное имя',
            email: 'Email',
            phone: 'Телефон',
            subject: 'Предмет',
            department: 'Кафедра / Отдел',
            role: 'Роль',
            save: 'Сохранить изменения',
            saved: 'Сохранено!',
            newMessage: 'Новые сообщения от студентов',
            taskSubmit: 'Сдача заданий студентами',
            simComplete: 'Завершение симуляции',
            systemUpdate: 'Обновления системы',
            weeklyReport: 'Еженедельный отчёт',
            emailNotif: 'Email уведомления',
            changePass: 'Изменить пароль',
            currentPass: 'Текущий пароль',
            newPass: 'Новый пароль',
            confirmPass: 'Подтвердите пароль',
            twoFactor: 'Двухфакторная аутентификация',
            twoFactorDesc: 'Дополнительный уровень защиты вашего аккаунта',
            themeLight: 'Светлая',
            themeDark: 'Тёмная',
            themeSystem: 'Системная',
            accentColor: 'Акцентный цвет',
            langTitle: 'Язык интерфейса',
            langDesc: 'Выберите язык для отображения интерфейса системы',
            avatar: 'Фото профиля',
            changeAvatar: 'Изменить фото',
        },
        uz_lat: {
            settings: 'Sozlamalar',
            subtitle: 'Profil va tizim sozlamalarini boshqarish',
            profile: 'Profil',
            notifications: 'Bildirishnomalar',
            language: 'Til',
            security: 'Xavfsizlik',
            appearance: 'Ko\'rinish',
            fullName: 'To\'liq ism',
            email: 'Email',
            phone: 'Telefon',
            subject: 'Fan',
            department: 'Kafedra / Bo\'lim',
            role: 'Rol',
            save: 'O\'zgarishlarni saqlash',
            saved: 'Saqlandi!',
            newMessage: 'Talabalardan yangi xabarlar',
            taskSubmit: 'Talabalar topshiriq topshirishi',
            simComplete: 'Simulyatsiya yakunlandi',
            systemUpdate: 'Tizim yangilanishlari',
            weeklyReport: 'Haftalik hisobot',
            emailNotif: 'Email bildirishnomalar',
            changePass: 'Parolni o\'zgartirish',
            currentPass: 'Joriy parol',
            newPass: 'Yangi parol',
            confirmPass: 'Parolni tasdiqlang',
            twoFactor: 'Ikki faktorli autentifikatsiya',
            twoFactorDesc: 'Hisobingizni qo\'shimcha himoya qilish',
            themeLight: 'Yorug\'',
            themeDark: 'Qorong\'i',
            themeSystem: 'Tizim',
            accentColor: 'Aksent rangi',
            langTitle: 'Interfeys tili',
            langDesc: 'Tizim interfeysini ko\'rsatish uchun tilni tanlang',
            avatar: 'Profil rasmi',
            changeAvatar: 'Rasmni o\'zgartirish',
        },
    };

    const L = labels[language] || labels.ru;

    const tabList = [
        { key: 'profile',       icon: User,     label: L.profile },
        { key: 'notifications', icon: Bell,     label: L.notifications },
        { key: 'language',      icon: Languages, label: L.language },
        { key: 'security',      icon: Shield,   label: L.security },
        { key: 'appearance',    icon: Palette,  label: L.appearance },
    ];

    async function handleSave() {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    const accents = [
        { key: 'indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-600' },
        { key: 'blue',   bg: 'bg-blue-600',   ring: 'ring-blue-600'   },
        { key: 'violet', bg: 'bg-violet-600', ring: 'ring-violet-600' },
        { key: 'emerald',bg: 'bg-emerald-500',ring: 'ring-emerald-500'},
        { key: 'rose',   bg: 'bg-rose-500',   ring: 'ring-rose-500'   },
        { key: 'amber',  bg: 'bg-amber-500',  ring: 'ring-amber-500'  },
    ];

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-indigo-600" />
                    </span>
                    {L.settings}
                </h1>
                <p className="text-sm text-gray-500 mt-1 ml-[52px]">{L.subtitle}</p>
            </div>

            <div className="flex gap-6">
                {/* ── Sidebar tabs ──────────────────────────────────────────── */}
                <div className="w-52 flex-shrink-0 space-y-1">
                    {tabList.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                ${activeTab === tab.key
                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : 'text-gray-400'}`} />
                            {tab.label}
                            {activeTab !== tab.key && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />}
                        </button>
                    ))}
                </div>

                {/* ── Content panel ─────────────────────────────────────────── */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">

                    {/* ── PROFILE ─────────────────────────────────────────── */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-100 overflow-hidden border-2 border-indigo-200">
                                        <img src="/kelin.jfif" alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.style.display = 'none'; }} />
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-indigo-700 transition-colors">
                                        <Camera className="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{profile.fullName}</p>
                                    <p className="text-sm text-gray-500">{profile.role}</p>
                                    <button className="mt-1 text-xs text-indigo-600 hover:underline">{L.changeAvatar}</button>
                                </div>
                            </div>

                            {/* Form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { key: 'fullName', label: L.fullName, icon: User },
                                    { key: 'email',    label: L.email,    icon: Mail },
                                    { key: 'phone',    label: L.phone,    icon: Phone },
                                    { key: 'subject',  label: L.subject,  icon: BookOpen },
                                    { key: 'department', label: L.department, icon: Building2 },
                                    { key: 'role',     label: L.role,     icon: GraduationCap },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{field.label}</label>
                                        <div className="relative">
                                            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profile[field.key]}
                                                onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ───────────────────────────────────── */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 mb-4">
                                {language === 'ru'
                                    ? 'Выберите события, о которых хотите получать уведомления'
                                    : 'Bildirishnoma olmoqchi bo\'lgan voqealarni tanlang'}
                            </p>
                            {[
                                { key: 'newMessage',    label: L.newMessage,    icon: Mail },
                                { key: 'taskSubmit',    label: L.taskSubmit,    icon: BookOpen },
                                { key: 'simComplete',   label: L.simComplete,   icon: Monitor },
                                { key: 'systemUpdate',  label: L.systemUpdate,  icon: Shield },
                                { key: 'weeklyReport',  label: L.weeklyReport,  icon: Bell },
                                { key: 'emailNotif',    label: L.emailNotif,    icon: Mail },
                            ].map(item => (
                                <div key={item.key}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${notifs[item.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                                            ${notifs[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── LANGUAGE ────────────────────────────────────────── */}
                    {activeTab === 'language' && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">{L.langTitle}</p>
                                <p className="text-xs text-gray-400">{L.langDesc}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {[
                                    { code: 'uz_lat', label: "O'zbekcha (Lotin)", flag: '🇺🇿', sub: 'Lotin alifbosi' },
                                    { code: 'uz_cyr', label: 'Ўзбекча (Кирилл)',  flag: '🇺🇿', sub: 'Кирилл ёзуви' },
                                    { code: 'ru',     label: 'Русский',           flag: '🇷🇺', sub: 'Кириллица' },
                                    { code: 'en',     label: 'English',           flag: '🇬🇧', sub: 'Latin alphabet' },
                                ].map(lang => (
                                    <div
                                        key={lang.code}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                                            ${language === lang.code
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-100 hover:border-gray-300 bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-3xl">{lang.flag}</span>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${language === lang.code ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                {lang.label}
                                            </p>
                                            <p className="text-xs text-gray-400">{lang.sub}</p>
                                        </div>
                                        {language === lang.code && (
                                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                {language === 'ru'
                                    ? '* Чтобы сменить язык, используйте переключатель языка в верхней панели.'
                                    : '* Tilni o\'zgartirish uchun yuqori paneldagi til almashturgichdan foydalaning.'}
                            </p>
                        </div>
                    )}

                    {/* ── SECURITY ────────────────────────────────────────── */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            {/* Change password */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-indigo-500" /> {L.changePass}
                                </h3>
                                <div className="space-y-3 max-w-md">
                                    {[
                                        { label: L.currentPass, placeholder: '••••••••' },
                                        { label: L.newPass,     placeholder: '••••••••' },
                                        { label: L.confirmPass, placeholder: '••••••••' },
                                    ].map((f, i) => (
                                        <div key={i}>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                                            <div className="relative">
                                                <input
                                                    type={showPass ? 'text' : 'password'}
                                                    placeholder={f.placeholder}
                                                    className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                                                        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                                />
                                                {i === 0 && (
                                                    <button
                                                        onClick={() => setShowPass(s => !s)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2FA */}
                            <div className="border-t border-gray-100 pt-5">
                                <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 max-w-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{L.twoFactor}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{L.twoFactorDesc}</p>
                                        </div>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                                        <span className="inline-block h-4 w-4 rounded-full bg-white shadow translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── APPEARANCE ──────────────────────────────────────── */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            {/* Theme */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    {language === 'ru' ? 'Тема оформления' : 'Dizayn mavzusi'}
                                </p>
                                <div className="flex gap-3">
                                    {[
                                        { key: 'light', label: L.themeLight, icon: Sun },
                                        { key: 'dark',  label: L.themeDark,  icon: Moon },
                                        { key: 'system',label: L.themeSystem,icon: Monitor },
                                    ].map(t => (
                                        <button
                                            key={t.key}
                                            onClick={() => setTheme(t.key)}
                                            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all
                                                ${theme === t.key
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-gray-50'
                                                }`}
                                        >
                                            <t.icon className="w-5 h-5" />
                                            <span className="text-xs font-medium">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accent color */}
                            <div className="border-t border-gray-100 pt-5">
                                <p className="text-sm font-semibold text-gray-700 mb-3">{L.accentColor}</p>
                                <div className="flex gap-3">
                                    {accents.map(a => (
                                        <button
                                            key={a.key}
                                            onClick={() => setAccentColor(a.key)}
                                            className={`w-9 h-9 rounded-full ${a.bg} transition-all
                                                ${accentColor === a.key ? `ring-2 ring-offset-2 ${a.ring} scale-110` : 'hover:scale-110'}`}
                                        >
                                            {accentColor === a.key && <Check className="w-4 h-4 text-white mx-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Save button ──────────────────────────────────────── */}
                    <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                                ${saved
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                                } disabled:opacity-70`}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" />
                             : saved  ? <Check className="w-4 h-4" />
                             :          <Save className="w-4 h-4" />}
                            {saved ? L.saved : saving ? '...' : L.save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
