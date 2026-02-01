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
    Sparkles
} from 'lucide-react';
import { useLanguage } from './components/shared/LanguageContext';
import LanguageSwitcher from './components/shared/LanguageSwitcher';

const navigation = [
    { key: 'dashboard', href: '/', icon: LayoutDashboard },
    { key: 'students', href: '/students', icon: Users },
    { key: 'modules', href: '/modules', icon: BookOpen },
    { key: 'simulations', href: '/simulations', icon: Gamepad2 },
    { key: 'portfolio', href: '/portfolio', icon: FolderOpen },
    { key: 'reflections', href: '/reflections', icon: MessageSquare },
    { key: 'trajectories', href: '/trajectories', icon: RouteIcon },
    { key: 'facilitators', href: '/facilitators', icon: UserCog },
    { key: 'monitoring', href: '/monitoring', icon: BarChart3 },
    { key: 'sbcm', href: '/sbcm', icon: Network },
    { key: 'content_gen', href: '/content-generator', icon: Sparkles },
];

export default function Layout() {
    const location = useLocation();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
                <div className="flex flex-col h-full">
                    {/* Logo & Language Switcher */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-blue-600">FEIRM</h1>
                        <LanguageSwitcher variant="ghost" />
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
            <div className="pl-64">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}