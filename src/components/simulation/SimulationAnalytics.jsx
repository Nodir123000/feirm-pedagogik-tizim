
import React, { useState } from 'react';
import { useLanguage } from '@/components/shared/LanguageContext';
import {
    X,
    Trophy,
    Clock,
    Shield,
    Activity,
    CheckCircle,
    AlertTriangle,
    XCircle,
    TrendingUp,

    BrainCircuit,
    ArrowLeft,
    Target
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

const SimulationAnalytics = ({ scenario, onClose }) => {
    const { t, language } = useLanguage();

    // Mock Data based on proposal
    const performanceData = [
        { attempt: 1, score: 65, time: 25 },
        { attempt: 2, score: 72, time: 22 },
        { attempt: 3, score: 85, time: 18 },
        { attempt: 4, score: 89, time: 15 },
        { attempt: 5, score: 94, time: 12 },
    ];

    const skillData = [
        { subject: t('technical_knowledge') || 'Technical', A: 90, fullMark: 100 },
        { subject: t('safety_compliance') || 'Safety', A: 85, fullMark: 100 },
        { subject: t('reaction_time') || 'Reaction', A: 70, fullMark: 100 },
        { subject: t('procedure_adherence') || 'Procedure', A: 95, fullMark: 100 },
        { subject: t('equipment_handling') || 'Equipment', A: 80, fullMark: 100 },
        { subject: t('communication') || 'Communication', A: 60, fullMark: 100 },
    ];

    const aiFeedback = [
        { id: 1, type: 'success', text_uz_lat: "Oqish o'z vaqtida aniqlandi", text_ru: "Утечка обнаружена своевременно", text_uz_cyr: "Оқиш ўз вақтида аниқланди" },
        { id: 2, type: 'warning', text_uz_lat: "Preventorni yopishda kechikish (+25 soniya)", text_ru: "Задержка при закрытии превентора (+25 сек)", text_uz_cyr: "Превенторни ёпишда кечикиш (+25 сония)" },
        { id: 3, type: 'error', text_uz_lat: "Dispetcher xabardor qilinmadi (Kritik xato)", text_ru: "Не оповещен диспетчер (Критическая ошибка)", text_uz_cyr: "Диспетчер хабардор қилинмади (Критик хато)" },
    ];

    const getFeedbackText = (item) => {
        return item[`text_${language}`] || item.text_uz_lat;
    };

    return (
        <div className="w-full h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <div>
                    <button
                        onClick={onClose}
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_simulations') || 'Back to Simulations'}
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-purple-600" />
                        {t('analysis_results') || 'Analysis Results'}
                    </h2>
                    <p className="text-gray-500 mt-1 line-clamp-1 max-w-2xl">
                        {scenario[`title_${language}`] || scenario.title_uz_lat}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-200 rounded-lg text-green-700">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{t('overall_score') || 'Overall Score'}</p>
                            <p className="text-2xl font-bold text-gray-900">94<span className="text-base font-medium text-gray-500">/100</span></p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-200 rounded-lg text-blue-700">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{t('time_efficiency') || 'Efficiency'}</p>
                            <p className="text-2xl font-bold text-gray-900">+15<span className="text-sm font-medium text-blue-600">%</span></p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl border border-rose-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-rose-200 rounded-lg text-rose-700">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">{t('safety_rating') || 'Safety'}</p>
                            <p className="text-2xl font-bold text-gray-900">A<span className="text-lg font-medium text-gray-400">-</span></p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-200 rounded-lg text-purple-700">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">{t('consistency') || 'Consistency'}</p>
                            <p className="text-2xl font-bold text-gray-900">98<span className="text-sm font-medium text-purple-600">%</span></p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Progress Chart */}
                    <div className="hidden hidden p-6 bg-white rounded-xl border border-gray-100 shadow-sm md:block">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                {t('learning_progress') || 'Learning Curve'}
                            </h3>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="attempt" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="time"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skill Radar */}
                    <div className="hidden hidden p-6 bg-white rounded-xl border border-gray-100 shadow-sm md:block">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Target className="w-4 h-4 text-gray-400" />
                                {t('competency_map') || 'Competency Map'}
                            </h3>
                        </div>
                        <div className="h-64 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Skill Level"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.5}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


                {/* AI Analysis List */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">{t('ai_analysis_report') || 'AI Detailed Analysis'}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {aiFeedback.map((item) => (
                            <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                <div className={`
                                        p-2 rounded-lg shrink-0
                                        ${item.type === 'success' ? 'bg-green-100 text-green-600' :
                                        item.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                            'bg-red-100 text-red-600'}
                                    `}>
                                    {item.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                        item.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                            <XCircle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{getFeedbackText(item)}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.type === 'error' ? t('critical_error') || 'Critical Error' :
                                            item.type === 'warning' ? t('improvement_needed') || 'Improvement Needed' :
                                                t('well_done') || 'Well Done'}
                                    </p>
                                </div>
                                <span className="text-xs font-mono text-gray-400">00:0{item.id}:42</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <BrainCircuit className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-purple-900 mb-1">{t('ai_recommendation') || 'AI Recommendation'}</h4>
                        <p className="text-sm text-purple-700 leading-relaxed">
                            {t('stat_ai_rec_text') || "Based on your results, we recommend reviewing the 'Safety Protocols' module. Your reaction time to critical alerts has improved by 15%, but procedural adherence needs attention during emergency shutdown sequences."}
                        </p>
                        <button className="mt-4 text-xs font-bold bg-white text-purple-600 px-4 py-2 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all">
                            {t('go_to_module') || 'GO TO MODULE'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SimulationAnalytics;


