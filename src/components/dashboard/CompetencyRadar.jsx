import React from 'react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from '../shared/LanguageContext';

export default function CompetencyRadar({ data, studentName }) {
    const { t } = useLanguage();

    const defaultData = [
        { subject: t('professional_competency'), A: 85, fullMark: 100 },
        { subject: t('meta_competency'), A: 70, fullMark: 100 },
        { subject: t('motivation_level'), A: 90, fullMark: 100 },
        { subject: t('reflective_skills'), A: 65, fullMark: 100 },
        { subject: t('drilling'), A: 75, fullMark: 100 },
    ];

    const chartData = data || defaultData;

    return (
        <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold text-slate-800">
                    SBCM: {studentName || t('competency_analysis')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#64748b', fontSize: 10 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: '#64748b', fontSize: 10 }}
                            />
                            <Radar
                                name="Competency"
                                dataKey="A"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}