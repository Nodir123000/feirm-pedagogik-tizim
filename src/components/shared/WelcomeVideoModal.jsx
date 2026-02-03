import React, { useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

/**
 * WelcomeVideoModal - Компонент для автоматического воспроизведения приветственного видео
 * 
 * Отображает модальное окно с видео при первом входе пользователя в систему.
 * Видео автоматически воспроизводится и может быть закрыто пользователем.
 * 
 * @param {boolean} isOpen - Флаг отображения модального окна
 * @param {function} onClose - Callback функция для закрытия модального окна
 */
export default function WelcomeVideoModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const videoRef = useRef(null);

    // Автоматическое воспроизведение видео при открытии модального окна
    useEffect(() => {
        if (isOpen && videoRef.current) {
            // Небольшая задержка для корректной загрузки видео
            const timer = setTimeout(() => {
                videoRef.current?.play().catch(error => {
                    console.error('Ошибка автоматического воспроизведения видео:', error);
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Обработчик завершения воспроизведения видео
    const handleVideoEnded = () => {
        onClose();
    };

    // Обработчик закрытия модального окна
    const handleClose = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black border-none">
                {/* Заголовок с кнопкой закрытия */}
                <DialogHeader className="absolute top-0 right-0 z-10 p-4">
                    <button
                        onClick={handleClose}
                        className="ml-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        aria-label="Закрыть"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </DialogHeader>

                {/* Видео плеер */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <video
                        ref={videoRef}
                        className="absolute top-0 left-0 w-full h-full"
                        controls
                        onEnded={handleVideoEnded}
                        playsInline
                    >
                        <source src="/welcome_video.mp4" type="video/mp4" />
                        Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                </div>

                {/* Кнопка "Пропустить" */}
                <div className="absolute bottom-4 right-4 z-10">
                    <button
                        onClick={handleClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
                    >
                        {t('skip') || 'Пропустить'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
