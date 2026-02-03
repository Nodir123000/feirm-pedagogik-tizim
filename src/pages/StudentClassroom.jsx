import React, { useState } from 'react';
import { useLanguage } from '../components/shared/LanguageContext';
import {
    BookOpen,
    Play,
    CheckCircle,
    Circle,
    MessageSquare,
    FileText,
    Info,
    Award,
    ChevronRight,
    Brain,
    Menu,
    X
} from 'lucide-react';
import { getMockModuleDetails } from '../lib/mockModuleData';

const StudentClassroom = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock Data Loading (In real app, would come from route param)
    const mockData = getMockModuleDetails();
    const moduleTitle = { uz: "Neft va gaz geologiyasi", ru: "Геология нефти и газа" };

    // Helper for localized text
    const getLocalizedText = (text) => {
        if (!text) return '';
        if (typeof text === 'object') {
            return text[language] || text['uz_lat'] || text['ru'] || '';
        }
        return t(text);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Sidebar (Timeline) */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden relative`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 truncate">{getLocalizedText(moduleTitle)}</h3>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('module_structure')}</div>

                    {/* Timeline Items */}
                    {mockData.lessons.map((lesson, idx) => (
                        <div key={idx} className={`group flex gap-3 p-3 rounded-xl transition-all border ${idx === 0 ? 'bg-green-50/50 border-green-200 ring-1 ring-green-100' : 'bg-white border-gray-100 hover:border-green-100 hover:shadow-sm'}`}>
                            <div className="pt-1">
                                {idx === 0 ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
                                        <Play className="w-2.5 h-2.5 ml-0.5" />
                                    </div>
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                    {getLocalizedText(lesson.title)}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                    <span>{lesson.duration}</span>
                                    {/* Scientific Badges (Role) */}
                                    {lesson.pedagogical_role && (
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600`}>
                                            {t(lesson.pedagogical_role)}
                                        </span>
                                    )}
                                </div>

                                {/* Cognitive Load Bar */}
                                {lesson.cognitive_load && (
                                    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${lesson.cognitive_load === 'load_high' ? 'bg-red-400 w-full' :
                                                lesson.cognitive_load === 'load_medium' ? 'bg-amber-400 w-2/3' : 'bg-green-400 w-1/3'
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                {!sidebarOpen && (
                    <div className="p-2 border-b bg-white">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600">
                            <Menu className="w-4 h-4" />
                            {t('show_sidebar')}
                        </button>
                    </div>
                )}

                {/* Player / Content Placeholder */}
                <div className="flex-1 bg-black p-4 flex items-center justify-center relative group">
                    <div className="text-center text-white space-y-4">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">1. Nazariyaga kirish</h2>
                            <p className="text-white/60">Video darslik • 45 daqiqa</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Tabs / Interface */}
                <div className="h-1/3 min-h-[300px] bg-white border-t border-gray-200 flex flex-col">
                    <div className="flex border-b border-gray-100 px-4">
                        {[
                            { id: 'overview', icon: Info, label: 'Overview' },
                            { id: 'resources', icon: FileText, label: 'Resources' },
                            { id: 'notes', icon: MessageSquare, label: 'Notes & AI' },
                            { id: 'quiz', icon: Brain, label: 'Quiz' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'border-green-500 text-green-700 bg-green-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-gray-900">Dars haqida</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {mockData.overview?.context && getLocalizedText(mockData.overview.context)}
                                </p>

                                <div className="flex gap-4 mt-6">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-xs font-bold text-blue-800 uppercase mb-1">Methodology</div>
                                        <div className="font-semibold text-blue-900">Munozarali ma'ruza</div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="text-xs font-bold text-purple-800 uppercase mb-1">Competency</div>
                                        <div className="font-semibold text-purple-900">Kognitiv Tahlil</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                {mockData.resources_detailed?.map((res, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-start justify-between group hover:border-green-300 transition-colors cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                                                <FileText className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{getLocalizedText(res.title)}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{t(res.type)} • {res.metadata.learning_time}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                                        <Brain className="w-5 h-5 text-purple-600" />
                                        {t('reflection_log') || 'Reflection Log'}
                                    </h4>
                                    <p className="text-sm text-purple-700 mb-4">
                                        {t('reflection_prompt') || "What was the most challenging part of this lesson? How did you overcome it?"}
                                    </p>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-purple-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                                        placeholder={t('write_reflection') || "Write your thoughts here..."}
                                    />
                                    <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors">
                                        {t('save_entry') || "Save Entry"}
                                    </button>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-3">AI Analysis</h4>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>Based on your interaction, you seem to favor <span className="font-bold text-gray-900">Visual Learning</span>.</p>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-[75%]"></div>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">Confidence: 75%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Facilitator Floating Widget */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                    {/* Message Bubble */}
                    <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-lg border border-gray-100 max-w-xs animate-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <Brain className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 text-sm mb-1">{t('ai_facilitator') || 'AI Guide'}</h5>
                                <p className="text-sm text-gray-600 leading-snug">
                                    This lesson has a <span className="font-bold text-amber-600">High Cognitive Load</span>. I recommend reviewing the "Safety Protocols" glossary before starting the simulation.
                                </p>
                                <button className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                    {t('accept_suggestion') || "Open Glossary"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Avatar / Toggle */}
                    <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105">
                        <MessageSquare className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentClassroom;
