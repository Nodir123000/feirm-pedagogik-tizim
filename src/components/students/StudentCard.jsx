import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '../shared/LanguageContext';
import { motion } from 'framer-motion';

const specializationColors = {
    drilling: 'bg-blue-100 text-blue-700',
    production: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-amber-100 text-amber-700',
    transportation: 'bg-violet-100 text-violet-700',
    geology: 'bg-rose-100 text-rose-700',
};

export default function StudentCard({ student, onSelect, index = 0 }) {
    const { t } = useLanguage();

    const avgProgress = Math.round(
        ((student.professional_competency || 0) +
            (student.meta_competency || 0) +
            (student.motivation_level || 0) +
            (student.reflective_skills || 0)) / 4
    );

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card
                className="p-5 border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer"
                onClick={() => onSelect?.(student)}
            >
                <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-slate-100">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold">
                            {getInitials(student.full_name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-slate-900 truncate">
                                    {student.full_name}
                                </h3>
                                <p className="text-sm text-slate-500">{student.group}</p>
                            </div>
                            {student.specialization && (
                                <Badge className={`${specializationColors[student.specialization]} shrink-0`}>
                                    {t(student.specialization)}
                                </Badge>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">{t('average_progress')}</span>
                                <span className="font-medium text-slate-700">{avgProgress}%</span>
                            </div>
                            <Progress value={avgProgress} className="h-2" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-md">
                                <span className="text-slate-500">Prof.</span>
                                <span className="font-medium text-blue-600">{student.professional_competency || 0}%</span>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-md">
                                <span className="text-slate-500">Meta</span>
                                <span className="font-medium text-emerald-600">{student.meta_competency || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}