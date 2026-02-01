import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../shared/LanguageContext';
import { Layers, TrendingUp, Play, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function SBCMIntegration({ student, trajectory, recentSimulation, recentReflection }) {
    const { language } = useLanguage();

    const getText = (ru, uz) => language === 'ru' ? ru : uz;

    return (
        <Card className="border-slate-200/60 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    {getText('Интеграция FEIRM', 'FEIRM integratsiyasi')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* SBCM Status */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">SBCM</p>
                            <p className="text-xs text-slate-600">
                                {getText('4 компонента компетенций', '4 ta kompetensiya komponenti')}
                            </p>
                        </div>
                    </div>
                    <Link to={createPageUrl('SBCM')}>
                        <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Trajectory */}
                {trajectory ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-violet-50 border border-violet-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">
                                    {getText('Траектория активна', 'Traektoriya faol')}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {trajectory.progress_percentage}% {getText('завершено', 'tugallandi')}
                                </p>
                            </div>
                        </div>
                        <Link to={createPageUrl('Trajectories')}>
                            <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">
                            {getText('Траектория не создана', 'Traektoriya yaratilmagan')}
                        </p>
                        <Link to={createPageUrl('Trajectories')}>
                            <Button size="sm" variant="outline" className="w-full gap-2">
                                <Sparkles className="h-4 w-4" />
                                {getText('Создать AI-траекторию', 'AI-traektoriya yaratish')}
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Recent Simulation */}
                {recentSimulation && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                                <Play className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">
                                    {getText('Последняя симуляция', 'Oxirgi simulyatsiya')}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {getText('Балл', 'Ball')}: {recentSimulation.score}
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700">
                            {recentSimulation.score >= 80 ? '✓' : '○'}
                        </Badge>
                    </div>
                )}

                {/* Recent Reflection */}
                {recentReflection && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                                <Lightbulb className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">
                                    {getText('Последняя рефлексия', 'Oxirgi refleksiya')}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {recentReflection.reflection_type}
                                </p>
                            </div>
                        </div>
                        <Link to={createPageUrl('Reflections')}>
                            <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="pt-2">
                    <p className="text-xs text-center text-slate-500">
                        {getText(
                            '💡 Полный цикл: Модель → Траектория → Симуляция → Рефлексия',
                            '💡 To\'liq sikl: Model → Traektoriya → Simulyatsiya → Refleksiya'
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}