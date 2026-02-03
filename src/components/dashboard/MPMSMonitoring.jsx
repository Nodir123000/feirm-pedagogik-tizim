import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/shared/LanguageContext';

/**
 * MPMS Monitoring Widget
 * Multi-Tiered Pedagogical Monitoring System
 * Shows 3 levels: Group, Individual, Component diagnostics
 */
export default function MPMSMonitoring({ data }) {
    const { t } = useLanguage();

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const componentData = data?.componentDiagnostics?.byStudent || {};

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">{t('mpms_monitoring')}</h3>
                <span className="text-xs text-gray-500 ml-auto">{t('mpms_full')}</span>
            </div>

            {/* Уровень 1: Групповая статистика */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('level_1_group')}</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">{t('total_students_count')}</p>
                        <p className="text-2xl font-bold text-blue-600">{data?.groupLevel?.totalStudents || 45}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">{t('average_progress_pct')}</p>
                        <p className="text-2xl font-bold text-green-600">{data?.groupLevel?.averageProgress || 76.5}%</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">{t('high_level_count')}</p>
                        <p className="text-2xl font-bold text-purple-600">{data?.groupLevel?.competencyDistribution?.high || 12}</p>
                    </div>
                </div>
            </div>

            {/* Уровень 3: Компонентная диагностика */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('level_3_sbcm')}</h4>
                <div className="space-y-3">
                    {[
                        { key: 'motivational', label: 'Мотивационный', color: 'bg-red-500' },
                        { key: 'cognitive', label: 'Когнитивный', color: 'bg-blue-500' },
                        { key: 'technological', label: 'Технологический', color: 'bg-green-500' },
                        { key: 'reflective', label: 'Рефлексивный', color: 'bg-purple-500' }
                    ].map((comp) => {
                        const compData = componentData[comp.key] || { score: 0, trend: 'stable' };
                        return (
                            <div key={comp.key} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-700">{comp.label}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(compData.trend)}
                                            <span className="text-xs font-bold text-gray-900">{compData.score}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${comp.color} transition-all duration-500`}
                                            style={{ width: `${compData.score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    {t('multi_tier_monitoring')}
                </p>
            </div>
        </div>
    );
}
