import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '../shared/LanguageContext';
import { Layers, TrendingUp, Play, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FEIRMFlowDiagram() {
    const { language } = useLanguage();

    const steps = [
        {
            icon: Layers,
            title: { ru: 'SBCM Модель', uz_lat: 'SBCM Modeli', uz_cyr: 'SBCM Модели' },
            color: 'from-blue-500 to-cyan-500',
            description: { ru: 'Структура компетенций', uz_lat: 'Kompetensiya tuzilmasi', uz_cyr: 'Компетенсия тузилмаси' }
        },
        {
            icon: TrendingUp,
            title: { ru: 'AI Траектория', uz_lat: 'AI Traektoriya', uz_cyr: 'AI Траектория' },
            color: 'from-violet-500 to-purple-500',
            description: { ru: 'Персональный путь', uz_lat: 'Shaxsiy yo\'l', uz_cyr: 'Шахсий йўл' }
        },
        {
            icon: Play,
            title: { ru: 'Симуляции', uz_lat: 'Simulyatsiyalar', uz_cyr: 'Симуляциялар' },
            color: 'from-emerald-500 to-teal-500',
            description: { ru: 'Практика SDME+ASM', uz_lat: 'SDME+ASM amaliyot', uz_cyr: 'SDME+ASM амалиёт' }
        },
        {
            icon: Lightbulb,
            title: { ru: 'Рефлексия', uz_lat: 'Refleksiya', uz_cyr: 'Рефлексия' },
            color: 'from-amber-500 to-orange-500',
            description: { ru: 'Осознанное развитие', uz_lat: 'Ongli rivojlanish', uz_cyr: 'Онгли ривожланиш' }
        }
    ];

    const getText = (obj) => obj[language] || obj.ru;

    return (
        <Card className="border-slate-200/60 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    {language === 'ru' ? 'Цикл обучения FEIRM' :
                        language === 'uz_cyr' ? 'FEIRM ўқитиш цикли' :
                            'FEIRM o\'qitish sikli'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Desktop Flow */}
                    <div className="hidden md:flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <React.Fragment key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="flex flex-col items-center gap-3 flex-1"
                                    >
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-xl`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-slate-900 mb-1">
                                                {getText(step.title)}
                                            </h3>
                                            <p className="text-xs text-slate-600">
                                                {getText(step.description)}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {index < steps.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 + 0.1 }}
                                        >
                                            <ArrowRight className="h-8 w-8 text-slate-300 mx-2" />
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Mobile Flow */}
                    <div className="md:hidden space-y-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-200"
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {getText(step.title)}
                                        </h3>
                                        <p className="text-xs text-slate-600">
                                            {getText(step.description)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200">
                    <p className="text-sm text-slate-700 text-center">
                        {language === 'ru' ?
                            '🎯 Комплексный подход: от теоретической модели компетенций через персонализированное обучение и симуляции к осознанному профессиональному развитию' :
                            language === 'uz_cyr' ?
                                '🎯 Комплекс ёндашув: компетенция назариясидан шахсийлаштирилган таълим ва симуляциялар орқали онгли касбий ривожланишга' :
                                '🎯 Kompleks yondashuv: kompetensiya nazariyasidan shaxsiylashtirilgan ta\'lim va simulyatsiyalar orqali ongli kasbiy rivojlanishga'
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}