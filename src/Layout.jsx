import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Gamepad2,
    FolderOpen,
    MessageSquare,
    Route as RouteIcon,
    UserCog,
    BarChart3,
    Network,
    Sparkles,
    Menu,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from './components/shared/LanguageContext';
import LanguageSwitcher from './components/shared/LanguageSwitcher';
import { Toaster } from "@/components/ui/toaster";
import IntroVideo from './components/shared/IntroVideo';

const navigation = [
    { key: 'dashboard', href: '/', icon: LayoutDashboard },
    { key: 'sbcm', href: '/sbcm', icon: Network },
    { key: 'students', href: '/students', icon: Users },
    { key: 'modules', href: '/modules', icon: BookOpen },
    { key: 'simulations', href: '/simulations', icon: Gamepad2 },
    { key: 'portfolio', href: '/portfolio', icon: FolderOpen },
    { key: 'reflections', href: '/reflections', icon: MessageSquare },
    { key: 'trajectories', href: '/trajectories', icon: RouteIcon },
    { key: 'facilitators', href: '/facilitators', icon: UserCog },
    { key: 'monitoring', href: '/monitoring', icon: BarChart3 },
];

export default function Layout() {
    const location = useLocation();
    const { t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <IntroVideo />
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <img src="/logo.jfif" alt="FEIRM Logo" className="w-8 h-8 object-contain" />
                            <h1 className="text-xl font-bold text-blue-600">FEIRM</h1>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.key}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {t(item.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            FEIRM Pedagogik Tizim v1.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-64' : 'pl-0'
                }`}>
                {/* Top Header */}
                <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                            title={isSidebarOpen ? "Скрыть меню" : "Показать меню"}
                        >
                            {isSidebarOpen ? (
                                <PanelLeftClose className="w-5 h-5" />
                            ) : (
                                <PanelLeftOpen className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{t('admin_name')}</p>
                                <p className="text-xs text-gray-500">{t('administrator')}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                <img src="/kelin.jfif" alt="Admin Avatar" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.src = '/kelin.jpg'; }} />
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