import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/shared/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
// import WelcomeVideoModal from '@/components/shared/WelcomeVideoModal';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language } = useLanguage();

    // Fallback translation if t() keys aren't ready yet for login specific terms
    const text = {
        title: language === 'ru' ? 'Вход в систему' : 'Tizimga kirish',
        subtitle: language === 'ru' ? 'FEIRM Педагогическая система' : 'FEIRM Pedagogik Tizimi',
        email: 'Email',
        password: language === 'ru' ? 'Пароль' : 'Parol',
        signIn: language === 'ru' ? 'Войти' : 'Kirish',
        signingIn: language === 'ru' ? 'Вход...' : 'Kirilmoqda...',
        error: language === 'ru' ? 'Ошибка входа' : 'Kirish xatosi',
        invalidCredentials: language === 'ru' ? 'Неверный логин или пароль' : 'Login yoki parol noto\'g\'ri',
        welcome: language === 'ru' ? 'Добро пожаловать' : 'Xush kelibsiz',
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    // const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);

    const from = location.state?.from?.pathname || '/';

    // const handleVideoClose = () => {
    //     setShowWelcomeVideo(false);
    //     navigate(from, { replace: true });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate(from, { replace: true });
            setIsLoading(false);
            // setShowWelcomeVideo(true);
        } catch (err) {
            console.error('Login error:', err);
            // Use localized error message instead of the raw error message
            const errorMessage = err.message?.includes('Invalid') || err.message?.includes('credentials')
                ? text.invalidCredentials
                : text.error;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/login-bg-new.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                {/* Removed dark overlay to show original photo */}
            </div>

            {/* Welcome Video Modal */}
            {/* <WelcomeVideoModal
                isOpen={showWelcomeVideo}
                onClose={handleVideoClose}
            /> */}

            {/* Show Form Button (Visible when form is hidden and video is not showing) */}
            {!isFormVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsFormVisible(true)}
                    className="absolute bottom-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all font-medium"
                >
                    <Eye className="w-4 h-4" />
                    {text.signIn}
                </motion.button>
            )}

            {/* Login Card */}
            {isFormVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden z-10 mx-4 border border-white/30 relative"
                >
                    <div className="bg-white/5 backdrop-blur-sm p-8 text-white text-center relative border-b border-white/10">
                        {/* Hide Button */}
                        <button
                            onClick={() => setIsFormVisible(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title="Скрыть окно"
                        >
                            <EyeOff className="w-4 h-4 text-white" />
                        </button>

                        <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{text.title}</h2>
                        <p className="text-white/80 text-sm">{text.subtitle}</p>
                    </div>

                    <div className="p-8 bg-white/5 backdrop-blur-sm">
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/20 border border-red-300/30 text-white text-sm rounded-lg flex items-center gap-2 backdrop-blur-sm">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Login</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Login"
                                        className="pl-10 h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">{text.password}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white/10 hover:bg-white/20 border border-white/30 h-11 text-base text-white backdrop-blur-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {text.signingIn}
                                    </>
                                ) : (
                                    text.signIn
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-xs text-white/70">
                            FEIRM Pedagogik Tizim © 2026
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
