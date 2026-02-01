import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../shared/LanguageContext';

export default function ProgressChart({ data, title }) {
    const { t } = useLanguage();

    const defaultData = [
        { month: 'Yan', professional: 45, meta: 40, motivation: 50, reflective: 35 },
        { month: 'Fev', professional: 52, meta: 48, motivation: 55, reflective: 42 },
        { month: 'Mar', professional: 58, meta: 55, motivation: 58, reflective: 48 },
        { month: 'Apr', professional: 65, meta: 62, motivation: 62, reflective: 55 },
        { month: 'May', professional: 70, meta: 68, motivation: 68, reflective: 60 },
        { month: 'Iyu', professional: 75, meta: 72, motivation: 72, reflective: 65 },
    ];

    const chartData = data || defaultData;

    return (
        <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800">
                    {title || t('progress_tracking')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfessional" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="professional"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorProfessional)"
                                name={t('professional_competency')}
                            />
                            <Area
                                type="monotone"
                                dataKey="meta"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorMeta)"
                                name={t('meta_competency')}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}