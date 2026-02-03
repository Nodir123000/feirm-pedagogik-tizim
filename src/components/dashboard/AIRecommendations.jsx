import { Sparkles, BookOpen, Brain, Users, Gamepad2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/shared/LanguageContext';

/**
 * AI Recommendations Widget
 * Displays personalized AI-driven recommendations for students
 */
export default function AIRecommendations({ recommendations = [] }) {
    const { t } = useLanguage();

    const iconMap = {
        BookOpen,
        Brain,
        Users,
        Gamepad2
    };

    const priorityColors = {
        high: 'border-red-200 bg-red-50',
        medium: 'border-yellow-200 bg-yellow-50',
        low: 'border-blue-200 bg-blue-50'
    };

    const priorityBadges = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-blue-100 text-blue-700'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">{t('ai_recommendations_title')}</h3>
                <span className="text-xs text-gray-500 ml-auto">{t('personalized_recommendations')}</span>
            </div>

            <div className="space-y-3">
                {recommendations.slice(0, 4).map((rec, idx) => {
                    const Icon = iconMap[rec.icon] || BookOpen;
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border-2 ${priorityColors[rec.priority]} transition-all hover:shadow-md cursor-pointer`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Icon className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {rec.title}
                                        </h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityBadges[rec.priority]}`}>
                                            {rec.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {rec.description}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {recommendations.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('no_active_recommendations')}</p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    {t('ai_trajectory_analysis')}
                </p>
            </div>
        </div>
    );
}
