import { Brain, Heart, Cpu, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/shared/LanguageContext';

/**
 * SBCM Components Widget
 * Displays 4 components of Simulation-Based Competency Model
 */
export default function SBCMComponents({ data }) {
    const { t } = useLanguage();

    const components = [
        {
            key: 'motivational',
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            value: data?.motivationalComponent?.intrinsicMotivation || 78
        },
        {
            key: 'cognitive',
            icon: Brain,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            value: data?.cognitiveComponent?.theoreticalKnowledge || 75
        },
        {
            key: 'technological',
            icon: Cpu,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            value: data?.technologicalComponent?.anyLogicProficiency || 65
        },
        {
            key: 'reflective',
            icon: Eye,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            value: data?.reflectiveComponent?.selfAssessment || 76
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">{t('sbcm_components')}</h3>
                <span className="text-xs text-gray-500 ml-auto">{t('sbcm_full')}</span>
            </div>

            <div className="space-y-4">
                {components.map((comp) => {
                    const Icon = comp.icon;
                    const labelKey = comp.key === 'motivational' ? 'motivational_value' :
                        comp.key === 'cognitive' ? 'cognitive_activity' :
                            comp.key === 'technological' ? 'technological_comp' :
                                'reflective_evaluative';
                    return (
                        <div key={comp.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded ${comp.bgColor}`}>
                                        <Icon className={`w-4 h-4 ${comp.color}`} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {t(labelKey)}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{comp.value}%</span>
                            </div>
                            <Progress value={comp.value} className="h-2" />
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    {t('comprehensive_model')}
                </p>
            </div>
        </div>
    );
}
