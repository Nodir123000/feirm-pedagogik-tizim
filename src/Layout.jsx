import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardList,
    Gamepad2,
    BarChart3,
    MessageSquare,
    LineChart,
    FolderOpen,
    Mail,
    Calendar,
    Megaphone,
    Settings,
    Headphones,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    X,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from './components/shared/LanguageContext';
import LanguageSwitcher from './components/shared/LanguageSwitcher';
import { Toaster } from "@/components/ui/toaster";
import IntroVideo from './components/shared/IntroVideo';

// ─── Navigation groups ────────────────────────────────────────────────────────
const mainNavigation = [
    { key: 'nav_dashboard',      href: '/',             icon: LayoutDashboard },
    { key: 'nav_courses',        href: '/modules',      icon: BookOpen        },
    { key: 'nav_groups',         href: '/groups',       icon: Users           },
    { key: 'nav_students',       href: '/students',     icon: Users           },
    { key: 'nav_tasks',          href: '/tasks',        icon: ClipboardList   },
    { key: 'nav_simulations',    href: '/simulations',  icon: Gamepad2        },
    { key: 'nav_grades',         href: '/monitoring',   icon: BarChart3       },
    { key: 'nav_facilitation',   href: '/facilitators', icon: MessageSquare   },
    { key: 'nav_analytics',      href: '/analytics',    icon: LineChart       },
    { key: 'nav_materials',      href: '/portfolio',    icon: FolderOpen      },
    { key: 'nav_messages',       href: '/reflections',  icon: Mail            },
    { key: 'nav_calendar',       href: '/trajectories', icon: Calendar        },
    { key: 'nav_announcements',  href: '/sbcm',         icon: Megaphone       },
    { key: 'nav_settings',       href: '/settings',     icon: Settings        },
];

const feirmModules = [
    {
        num: 1,
        label: 'Модуль проектирования компетенций (SBCM)',
        href: '/sbcm',
        badgeColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgHover: 'hover:bg-blue-50',
    },
    {
        num: 2,
        label: 'Модуль симуляционного обучения (SDME + ASM)',
        href: '/simulations',
        badgeColor: 'bg-green-500',
        textColor: 'text-green-600',
        bgHover: 'hover:bg-green-50',
    },
    {
        num: 3,
        label: 'Модуль фасилитационного сопровождения (FEIRM)',
        href: '/facilitators',
        badgeColor: 'bg-red-500',
        textColor: 'text-red-600',
        bgHover: 'hover:bg-red-50',
    },
    {
        num: 4,
        label: 'Модуль мониторинга и аналитики (MPMS)',
        href: '/monitoring',
        badgeColor: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgHover: 'hover:bg-orange-50',
    },
];

export default function Layout() {
    const location = useLocation();
    const { t, language } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'info',    read: false, time: '10 мин', ru: '3 новых сообщения от студентов',        uz: '3 ta yangi xabar talabalardan' },
        { id: 2, type: 'warning', read: false, time: '1 ч',   ru: '5 заданий требуют проверки',            uz: '5 ta topshiriq tekshirishni kutmoqda' },
        { id: 3, type: 'success', read: false, time: '2 ч',   ru: 'Симуляция «Бурение» завершена группой', uz: 'Guruh simulyatsiyani yakunladi' },
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <IntroVideo />

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <div
                className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200
                    transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
            >
                {/* Logo block */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 flex-shrink-0">
                    {/* Hexagon icon */}
                    <div className="relative flex-shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path
                                d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
                                fill="#4F46E5"
                                fillOpacity="0.12"
                                stroke="#4F46E5"
                                strokeWidth="1.5"
                            />
                            <text x="20" y="25" textAnchor="middle" fontSize="14" fill="#4F46E5" fontWeight="bold">🎓</text>
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">FEIRM Platform</p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                            Цифровая образовательная<br />платформа на основе 4 модулей
                        </p>
                    </div>
                </div>

                {/* Scrollable nav area */}
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">

                    {/* ── Group: НАВИГАЦИЯ ─────────────────────────────────── */}
                    <div>
                        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase select-none">
                            {t('nav_section_nav')}
                        </p>
                        <nav className="space-y-0.5">
                            {mainNavigation.map((item) => {
                                const isActive = location.pathname === item.href &&
                                    item.href !== '/' || (item.href === '/' && location.pathname === '/');

                                // For items that share the same href, highlight only the canonical one
                                const isExactActive = (() => {
                                    if (item.href === '/')            return location.pathname === '/' && item.key === 'nav_dashboard';
                                    if (item.href === '/modules')     return location.pathname === '/modules'   && item.key === 'nav_courses';
                                    if (item.href === '/students')    return location.pathname === '/students'  && item.key === 'nav_students';
                                    if (item.href === '/monitoring')  return location.pathname === '/monitoring' && item.key === 'nav_grades';
                                    return location.pathname === item.href;
                                })();

                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.key}
                                        to={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                                            ${isExactActive
                                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors
                                            ${isExactActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}
                                        />
                                        <span className="truncate leading-snug">{t(item.key)}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* ── Group: МОДУЛИ ПЛАТФОРМЫ FEIRM ───────────────────── */}
                    <div>
                        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase select-none">
                            {t('nav_section_modules')}
                        </p>
                        <div className="space-y-1">
                            {feirmModules.map((mod) => {
                                const isActive = location.pathname === mod.href;
                                return (
                                    <Link
                                        key={mod.num}
                                        to={mod.href}
                                        className={`flex items-start gap-2.5 px-3 py-2 rounded-lg transition-all duration-150
                                            ${isActive ? 'bg-indigo-50' : `${mod.bgHover}`}`}
                                    >
                                        {/* Colored number badge */}
                                        <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md ${mod.badgeColor}
                                            text-white text-[11px] font-bold flex items-center justify-center`}>
                                            {mod.num}
                                        </span>
                                        <span className={`text-xs font-medium leading-snug ${isActive ? 'text-indigo-700' : mod.textColor}`}>
                                            {mod.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Sidebar Footer ──────────────────────────────────────── */}
                <div className="flex-shrink-0 border-t border-gray-100">
                    {/* Help */}
                    <Link
                        to="/help"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Headphones className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-700 leading-tight">{t('nav_help')}</p>
                            <p className="text-[10px] text-indigo-500 leading-tight">{t('nav_help_sub')}</p>
                        </div>
                    </Link>
                    {/* Collapse button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400
                            hover:text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{t('nav_collapse')}</span>
                    </button>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Sidebar toggle */}
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                title="Показать меню"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}

                        {/* Global Search */}
                        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-64'}`}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => { setIsSearchFocused(false); setSearchQuery(''); }}
                                placeholder={
                                    language === 'ru'
                                        ? 'Поиск по курсам, модулям, студентам...'
                                        : 'Kurslar, modullar, talabalar...'
                                }
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl
                                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mail icon */}
                        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                            <Mail className="w-5 h-5" />
                        </button>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white
                                        text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-900">
                                            {language === 'ru' ? 'Уведомления' : 'Bildirishnomalar'}
                                        </p>
                                        <button
                                            onClick={() => setNotifications(ns => ns.map(n => ({ ...n, read: true })))}
                                            className="text-xs text-indigo-600 hover:underline"
                                        >
                                            {language === 'ru' ? 'Прочитать все' : "Barchasini o'qi"}
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
                                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                                            >
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                    n.type === 'success' ? 'bg-green-100' : n.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                                                }`}>
                                                    {n.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                                                     n.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-600" /> :
                                                     <Info className="w-4 h-4 text-blue-600" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm text-gray-800 ${!n.read ? 'font-semibold' : ''}`}>
                                                        {language === 'ru' ? n.ru : n.uz}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {n.time} {language === 'ru' ? 'назад' : 'avval'}
                                                    </p>
                                                </div>
                                                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                                        <button className="text-xs text-indigo-600 hover:underline">
                                            {language === 'ru' ? 'Все уведомления →' : 'Barcha bildirishnomalar →'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <LanguageSwitcher />

                        {/* User info */}
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{t('admin_name')}</p>
                                <p className="text-xs text-gray-500">{t('administrator')}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full border-2 border-indigo-100 overflow-hidden bg-indigo-50
                                flex items-center justify-center text-indigo-600 font-bold">
                                <img
                                    src="/kelin.jfif"
                                    alt="Admin Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.src = '/kelin.jpg'; }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1">
                    <Outlet />
                </main>
            </div>
            <Toaster />
        </div>
    );
}