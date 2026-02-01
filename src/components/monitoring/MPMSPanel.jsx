import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '../shared/LanguageContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BookOpen, Target, Brain } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function MPMSPanel({ assessments = [], students = [] }) {
    const { t } = useLanguage();

    const competencyData = [
        {
            name: t('professional_competency'),
            value: 68.7,
            change: '+23.7%',
            icon: Target
        },
        {
            name: t('meta_competency'),
            value: 72.4,
            change: '+27.4%',
            icon: Brain
        },
        {
            name: t('motivation_level'),
            value: 68,
            change: '+32%',
            icon: TrendingUp
        },
        {
            name: t('reflective_skills'),
            value: 61.5,
            change: '+31.5%',
            icon: BookOpen
        },
    ];

    const assessmentTypeData = [
        { type: t('self_assessment'), count: 145 },
        { type: t('peer_assessment'), count: 89 },
        { type: t('facilitator_assessment'), count: 67 },
        { type: t('automated_assessment'), count: 203 },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="border border-slate-200/60 bg-gradient-to-br from-blue-50 to-violet-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-800">
                                {t('mpms_title')}
                            </CardTitle>
                            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Cohen's d = 0.82
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            {competencyData.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-white/80 rounded-xl p-4 border border-slate-200/60"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-2 rounded-lg bg-slate-100">
                                                <Icon className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <span className="text-emerald-600 text-xs font-medium">{item.change}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{item.value}%</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.name}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-800">
                            {t('completed_assessments')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={assessmentTypeData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis
                                        type="category"
                                        dataKey="type"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        width={150}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {assessmentTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}