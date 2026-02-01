import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../shared/LanguageContext';
import {
    Play,
    BookOpen,
    Beaker,
    FolderKanban,
    Lightbulb,
    Clock,
    BarChart3,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const moduleTypeIcons = {
    simulation: Play,
    case_study: BookOpen,
    project: FolderKanban,
    laboratory: Beaker,
    theory: Lightbulb,
};

const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    advanced: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function ModuleCard({ module, onSelect, index = 0 }) {
    const { t, getLocalizedField } = useLanguage();

    const Icon = moduleTypeIcons[module.module_type] || BookOpen;
    const title = getLocalizedField(module, 'title');
    const description = getLocalizedField(module, 'description');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="group overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                    {module.thumbnail_url ? (
                        <img
                            src={module.thumbnail_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-6 rounded-full bg-white/80 shadow-lg">
                                <Icon className="h-12 w-12 text-slate-400" />
                            </div>
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <Badge className={`${difficultyColors[module.difficulty_level]} border`}>
                            {t(module.difficulty_level)}
                        </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 text-slate-700">
                            {t(module.module_type)}
                        </Badge>
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[40px]">
                        {description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{module.duration_hours || 0}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BarChart3 className="h-3.5 w-3.5" />
                                <span>{module.competencies?.length || 0} {t('competencies') || 'comp.'}</span>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1 px-3"
                            onClick={() => onSelect?.(module)}
                        >
                            {t('view')}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}