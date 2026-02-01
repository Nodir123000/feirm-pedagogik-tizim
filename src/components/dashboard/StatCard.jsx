import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        violet: "bg-violet-50 text-violet-600 border-violet-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        slate: "bg-slate-50 text-slate-600 border-slate-100",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="p-6 border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <p className="text-3xl font-bold text-slate-900">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                        )}
                        {trend && (
                            <div className={`flex items-center gap-1 text-xs mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>{trend > 0 ? '↑' : '↓'}</span>
                                <span>{Math.abs(trend)}%</span>
                            </div>
                        )}
                    </div>
                    {Icon && (
                        <div className={`p-3 rounded-xl ${colorClasses[color]} border`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}