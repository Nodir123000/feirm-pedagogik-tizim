import { useState } from 'react';
import {
    Sparkles,
    BookOpen,
    Gamepad2,
    Target,
    ArrowRight,
    Loader2,
    Wand2,
    Cpu,
    Bot,
    Zap,
    Globe,
    Settings2,
    FileJson,
    CheckCircle2,
    Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContentGenerator() {
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [activeTab, setActiveTab] = useState('Module'); // Module, Scenario, Assessment

    const generate = () => {
        setGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setGeneratedContent({
                title: "Advanced Pedagogical Structures in Digital Age",
                type: activeTab,
                ai_confidence: "98.4%",
                estimated_load: "45 minutes",
                raw_json: JSON.stringify({
                    title: "Sample Generated Title",
                    difficulty: "Advanced",
                    competencies: ["Analytical Thinking", "Digital Governance"],
                    duration: 45
                }, null, 2)
            });
            setGenerating(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        AI Content Lab
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Facilitator toolset for generating AI-powered learning modules, simulation scenarios, and complex assessments.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-black text-purple-700 uppercase tracking-widest">Model: FEIRM-LLM-v2</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Controls */}
                <div className="lg:col-span-12">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 mb-8 max-w-2xl mx-auto">
                        {['Module', 'Scenario', 'Assessment'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                    activeTab === tab
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-100 scale-105"
                                        : "text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                {tab === 'Module' && <BookOpen className="w-4 h-4" />}
                                {tab === 'Scenario' && <Gamepad2 className="w-4 h-4" />}
                                {tab === 'Assessment' && <Target className="w-4 h-4" />}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generator Form */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Context / Theme</label>
                            <textarea
                                placeholder={`Describe the ${activeTab.toLowerCase()} you want to generate...`}
                                className="w-full h-32 p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600 transition-all text-sm font-medium resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Complexity</label>
                                <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold appearance-none">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Expert</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Primary Language</label>
                                <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold appearance-none">
                                    <option>Uzbek (Latin)</option>
                                    <option>Uzbek (Cyrillic)</option>
                                    <option>Russian</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={generate}
                            disabled={generating}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-purple-100"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Create AI {activeTab}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Area */}
                <div className="lg:col-span-7">
                    <div className="bg-gray-900 rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden group border border-white/5 shadow-2xl">
                        {/* Glossy Background Effect */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[100px] pointer-events-none" />

                        {generating ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500" />
                                    <Cpu className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-white font-black tracking-widest uppercase text-xs">Processing Neurons</p>
                                    <p className="text-purple-400/60 text-[10px] font-bold">Synthesizing pedagogical framework...</p>
                                </div>
                            </div>
                        ) : generatedContent ? (
                            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500 rounded-xl">
                                            <Zap className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-extrabold text-lg">{generatedContent.title}</h4>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[9px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-widest">Confidence: {generatedContent.ai_confidence}</span>
                                                <span className="text-[9px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-widest">Load: {generatedContent.estimated_load}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Preview Structured Data</p>
                                        <pre className="bg-black/50 p-6 rounded-2xl border border-white/5 text-purple-300 text-xs font-mono overflow-auto max-h-64 scrollbar-hide">
                                            {generatedContent.raw_json}
                                        </pre>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <button className="py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                                        Refine Result
                                    </button>
                                    <button className="py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-900/40">
                                        Push to Production
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="p-10 bg-white/5 rounded-full mb-6">
                                    <Wand2 className="w-12 h-12 text-white/10" />
                                </div>
                                <p className="text-white/30 font-black tracking-widest uppercase text-xs">Awaiting Context Input</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}