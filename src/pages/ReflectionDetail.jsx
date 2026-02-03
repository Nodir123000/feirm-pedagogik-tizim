import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReflectionById, updateReflection } from '@/entities/Reflection';
import { fetchStudentById } from '@/entities/Student';
import { fetchLearningModuleById } from '@/entities/LearningModule';
import {
    Brain,
    Target,
    MessageSquare,
    Smile,
    Meh,
    Frown,
    Lightbulb,
    TrendingUp,
    CheckCircle2,
    Calendar,
    Briefcase,
    UserCircle,
    Send,
    Sparkles,
    Loader2,
    ArrowLeft,
    ChevronLeft
} from "lucide-react";
import { useLanguage } from '@/components/shared/LanguageContext';
import { cn } from "@/lib/utils";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReflectionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, language, getLocalizedField } = useLanguage();

    const [reflection, setReflection] = useState(null);
    const [student, setStudent] = useState(null);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const reflectionData = await fetchReflectionById(id);
                setReflection(reflectionData);
                setFeedback(reflectionData?.facilitator_feedback || '');

                if (reflectionData?.student_id) {
                    const studentData = await fetchStudentById(reflectionData.student_id);
                    setStudent(studentData);
                }

                if (reflectionData?.module_id) {
                    const moduleData = await fetchLearningModuleById(reflectionData.module_id);
                    setModule(moduleData);
                }
            } catch (err) {
                console.error("Failed to load reflection detail:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSaveFeedback = async () => {
        if (!reflection) return;

        setIsSaving(true);
        try {
            const field = language === 'ru' ? 'facilitator_feedback_ru' : 'facilitator_feedback';
            await updateReflection(reflection.id, { [field]: feedback });
            alert(t('feedback_saved'));
        } catch (err) {
            console.error('Failed to save feedback:', err);
            alert(t('save_failed'));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse">{t('loading')}...</p>
            </div>
        );
    }

    if (!reflection) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <MessageSquare className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-gray-900 mb-2">{t('no_data')}</h2>
                <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> {t('back')}
                </Button>
            </div>
        );
    }

    const getMoodIcon = (rating) => {
        if (rating >= 4) return <Smile className="w-8 h-8 text-green-500" />;
        if (rating >= 3) return <Meh className="w-8 h-8 text-yellow-500" />;
        return <Frown className="w-8 h-8 text-red-500" />;
    };

    // Mock data for competency mapping
    const competencyData = [
        { subject: t('technical'), A: 85, fullMark: 100 },
        { subject: t('analytical'), A: 70, fullMark: 100 },
        { subject: t('communication'), A: 60, fullMark: 100 },
        { subject: t('ethics'), A: 90, fullMark: 100 },
        { subject: t('problem_solving'), A: 75, fullMark: 100 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Navbar / Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all group"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Brain className="w-5 h-5 text-indigo-600" />
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                {t('smart_reflection_log')}
                            </h1>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                            {t('ai_insight_included')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end px-4 border-r border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('student')}</p>
                        <p className="text-sm font-black text-gray-900">{student?.full_name}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Module Info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                </div>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('module')}</h4>
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t('mood')}</span>
                                {getMoodIcon(reflection.mood_rating)}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                            {module ? getLocalizedField(module, 'title') : t('general_reflection')}
                        </h2>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 mb-4">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            {t('reflection_content')}
                        </h3>

                        <div className="grid gap-6">
                            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50">
                                <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">
                                    {t('gibbs_description')}
                                </h5>
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {getLocalizedField(reflection, 'content') || t('no_content_written')}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100/50">
                                    <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">
                                        {t('achievements')}
                                    </h5>
                                    <p className="text-sm text-gray-700 font-bold">
                                        {getLocalizedField(reflection, 'achievements') || "-"}
                                    </p>
                                </div>
                                <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100/50">
                                    <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">
                                        {t('challenges')}
                                    </h5>
                                    <p className="text-sm text-gray-700 font-bold">
                                        {getLocalizedField(reflection, 'challenges') || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI & Feedback */}
                <div className="space-y-8">
                    {/* Competency Mapping */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h4 className="text-sm font-black text-gray-900 mb-10 flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            {t('competency_mapping')}
                        </h4>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                                    <PolarGrid stroke="#f1f5f9" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Radar
                                        name="Competency"
                                        dataKey="A"
                                        stroke="#4f46e5"
                                        fill="#4f46e5"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 border border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4 text-indigo-100" />
                            </div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-100">
                                {t('cognitive_level')}
                            </h4>
                        </div>
                        <div className="mb-8">
                            <p className="text-4xl font-black mb-1">Applying</p>
                            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tight">
                                {t('bloom_taxonomy')}
                            </p>
                        </div>
                        <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                    {t('ai_insight')}
                                </h4>
                            </div>
                            <p className="text-xs font-bold italic leading-relaxed text-indigo-50">
                                "Student demonstrates strong ability to link theory to practice in drilling operations."
                            </p>
                        </div>
                    </div>

                    {/* Facilitator Feedback */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                        <h4 className="text-sm font-black text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                            </div>
                            {t('facilitator_comments')}
                        </h4>
                        <Textarea
                            placeholder={t('add_feedback')}
                            className="min-h-[150px] border-gray-100 bg-gray-50/50 rounded-2xl resize-none focus:ring-amber-500/20 p-5 font-bold text-gray-700"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        <Button
                            onClick={handleSaveFeedback}
                            disabled={isSaving}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 font-black gap-3 text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {t('save_feedback')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
