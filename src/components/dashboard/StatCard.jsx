import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
    const colorClasses = {
        blue: {
            border: "border-blue-200",
            bg: "from-blue-50 to-blue-100",
            text: "text-blue-900",
            iconBg: "bg-blue-200",
            iconRing: "ring-blue-300",
            iconText: "text-blue-700",
            subtitleText: "text-blue-700",
        },
        emerald: {
            border: "border-emerald-200",
            bg: "from-emerald-50 to-emerald-100",
            text: "text-emerald-900",
            iconBg: "bg-emerald-200",
            iconRing: "ring-emerald-300",
            iconText: "text-emerald-700",
            subtitleText: "text-emerald-700",
        },
        amber: {
            border: "border-amber-200",
            bg: "from-amber-50 to-amber-100",
            text: "text-amber-900",
            iconBg: "bg-amber-200",
            iconRing: "ring-amber-300",
            iconText: "text-amber-700",
            subtitleText: "text-amber-700",
        },
        violet: {
            border: "border-violet-200",
            bg: "from-violet-50 to-violet-100",
            text: "text-violet-900",
            iconBg: "bg-violet-200",
            iconRing: "ring-violet-300",
            iconText: "text-violet-700",
            subtitleText: "text-violet-700",
        },
        rose: {
            border: "border-rose-200",
            bg: "from-rose-50 to-rose-100",
            text: "text-rose-900",
            iconBg: "bg-rose-200",
            iconRing: "ring-rose-300",
            iconText: "text-rose-700",
            subtitleText: "text-rose-700",
        },
        slate: {
            border: "border-slate-200",
            bg: "from-slate-50 to-slate-100",
            text: "text-slate-900",
            iconBg: "bg-slate-200",
            iconRing: "ring-slate-300",
            iconText: "text-slate-700",
            subtitleText: "text-slate-700",
        },
        cyan: {
            border: "border-cyan-200",
            bg: "from-cyan-50 to-cyan-100",
            text: "text-cyan-900",
            iconBg: "bg-cyan-200",
            iconRing: "ring-cyan-300",
            iconText: "text-cyan-700",
            subtitleText: "text-cyan-700",
        },
        indigo: {
            border: "border-indigo-200",
            bg: "from-indigo-50 to-indigo-100",
            text: "text-indigo-900",
            iconBg: "bg-indigo-200",
            iconRing: "ring-indigo-300",
            iconText: "text-indigo-700",
            subtitleText: "text-indigo-700",
        },
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            <Card className={`relative overflow-hidden border-2 ${colors.border} bg-gradient-to-br ${colors.bg} hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full`}>
                <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className={`text-sm font-medium ${colors.text}`}>{title}</h3>
                        {Icon && (
                            <div className={`rounded-full ${colors.iconBg} p-2 ring-2 ${colors.iconRing}`}>
                                <Icon className={`h-5 w-5 ${colors.iconText}`} />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className={`text-3xl font-bold ${colors.text}`}>{value}</div>
                        {subtitle && (
                            <p className={`text-xs ${colors.subtitleText} font-medium mt-1`}>{subtitle}</p>
                        )}
                        {trend && (
                            <div className={`flex items-center gap-1 text-xs mt-2 ${trend > 0 ? 'text-emerald-700' : 'text-rose-700'} font-semibold`}>
                                <span>{trend > 0 ? '↑' : '↓'}</span>
                                <span>{Math.abs(trend)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
