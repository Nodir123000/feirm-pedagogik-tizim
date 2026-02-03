import React, { useState } from 'react';
import { useLanguage } from '../components/shared/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import {
    Target,
    Brain,
    Cpu,
    Eye,
    ArrowRight,
    CheckCircle2,
    Layers,
    Workflow
} from 'lucide-react';

const componentData = {
    motivational: {
        icon: Target,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        elements: [
            { ru: 'Профессиональная мотивация', uz_lat: "Kasbiy motivatsiya", uz_cyr: "Касбий мотивация" },
            { ru: 'Ценностные ориентации', uz_lat: "Qadriyat yo'nalishlari", uz_cyr: "Қадрият йўналишлари" },
            { ru: 'Профессиональные интересы', uz_lat: "Kasbiy qiziqishlar", uz_cyr: "Касбий қизиқишлар" },
            { ru: 'Готовность к обучению', uz_lat: "O'qishga tayyorgarlik", uz_cyr: "Ўқишга тайёргарлик" },
        ]
    },
    cognitive: {
        icon: Brain,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        elements: [
            { ru: 'Профессиональные знания', uz_lat: "Kasbiy bilimlar", uz_cyr: "Касбий билимлар" },
            { ru: 'Аналитические умения', uz_lat: "Tahliliy ko'nikmalar", uz_cyr: "Таҳлилий кўникмалар" },
            { ru: 'Системное мышление', uz_lat: "Tizimli fikrlash", uz_cyr: "Тизимли фикрлаш" },
            { ru: 'Решение задач', uz_lat: "Masalalarni yechish", uz_cyr: "Масалаларни ечиш" },
        ]
    },
    technological: {
        icon: Cpu,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        elements: [
            { ru: 'Работа с симуляторами', uz_lat: "Simulyatorlar bilan ishlash", uz_cyr: "Симуляторлар билан ишлаш" },
            { ru: 'Цифровые навыки', uz_lat: "Raqamli ko'nikmalar", uz_cyr: "Рақамли кўникмалар" },
            { ru: 'Практические умения', uz_lat: "Amaliy ko'nikmalar", uz_cyr: "Амалий кўникмалар" },
            { ru: 'Технологическая адаптация', uz_lat: "Texnologik moslashuv", uz_cyr: "Технологик мослашув" },
        ]
    },
    reflective: {
        icon: Eye,
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-50',
        borderColor: 'border-violet-200',
        elements: [
            { ru: 'Самооценка', uz_lat: "O'z-o'zini baholash", uz_cyr: "Ўз-ўзини баҳолаш" },
            { ru: 'Критическая рефлексия', uz_lat: "Tanqidiy refleksiya", uz_cyr: "Танқидий рефлексия" },
            { ru: 'Планирование развития', uz_lat: "Rivojlanishni rejalashtirish", uz_cyr: "Ривожланишни режалаштириш" },
            { ru: 'Метапознание', uz_lat: "Metabilim", uz_cyr: "Метабилим" },
        ]
    }
};

export default function SBCM() {
    const { t, language, getLocalizedField } = useLanguage();
    const [selectedComponent, setSelectedComponent] = useState('motivational');

    const getLocalizedText = (item) => {
        return language === 'uz_lat' ? item.uz_lat : language === 'uz_cyr' ? item.uz_cyr : item.ru;
    };

    const components = [
        {
            key: 'motivational',
            title: { ru: 'Мотивационно-ценностный', uz_lat: "Motivatsion-qadriyat", uz_cyr: "Мотивацион-қадрият" },
            description: { ru: 'Формирование профессиональной мотивации и ценностных ориентаций', uz_lat: "Kasbiy motivatsiya va qadriyat yo'nalishlarini shakllantirish", uz_cyr: "Касбий мотивация ва қадрият йўналишларини шакллантириш" }
        },
        {
            key: 'cognitive',
            title: { ru: 'Когнитивно-деятельностный', uz_lat: "Kognitiv-faoliyat", uz_cyr: "Когнитив-фаолият" },
            description: { ru: 'Развитие знаний, умений и навыков профессиональной деятельности', uz_lat: "Kasbiy faoliyat bilim, ko'nikma va malakalarini rivojlantirish", uz_cyr: "Касбий фаолият билим, кўникма ва малакаларини ривожлантириш" }
        },
        {
            key: 'technological',
            title: { ru: 'Технологический', uz_lat: "Texnologik", uz_cyr: "Технологик" },
            description: { ru: 'Владение современными технологиями и симуляционными средствами', uz_lat: "Zamonaviy texnologiyalar va simulyatsion vositalarni egallash", uz_cyr: "Замонавий технологиялар ва симуляцион воситаларни эгаллаш" }
        },
        {
            key: 'reflective',
            title: { ru: 'Рефлексивно-оценочный', uz_lat: "Refleksiv-baholash", uz_cyr: "Рефлексив-баҳолаш" },
            description: { ru: 'Способность к самооценке и саморазвитию', uz_lat: "O'z-o'zini baholash va rivojlanish qobiliyati", uz_cyr: "Ўз-ўзини баҳолаш ва ривожланиш қобилияти" }
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 p-8 text-white"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                            <Layers className="h-6 w-6" />
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                            SBCM Model
                        </Badge>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Simulation-Based Competency Model
                    </h1>
                    <p className="text-blue-200 text-lg max-w-3xl">
                        {language === 'ru' ?
                            'Структурная модель формирования профессиональных компетенций будущих специалистов нефтегазовой отрасли' :
                            language === 'uz_cyr' ?
                                'Нефт-газ соҳасининг бўлажак мутахассисларининг касбий компетенцияларини шакллантириш структур модели' :
                                "Neft-gaz sohasi bo'lajak mutaxassislarining kasbiy kompetensiyalarini shakllantirish struktur modeli"
                        }
                    </p>
                </div>
            </motion.div>

            {/* Visual Model */}
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-blue-600" />
                        {language === 'ru' ? 'Структура модели SBCM' : language === 'uz_cyr' ? 'SBCM модели структураси' : 'SBCM modeli tuzilmasi'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {components.map((comp, index) => {
                            const data = componentData[comp.key];
                            const Icon = data.icon;
                            const isSelected = selectedComponent === comp.key;

                            return (
                                <motion.div
                                    key={comp.key}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    onClick={() => setSelectedComponent(comp.key)}
                                    className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${isSelected ? `${data.borderColor} ${data.bgColor} shadow-lg scale-105` : 'border-slate-200 hover:border-slate-300 bg-white'}
                  `}
                                >
                                    <div className="absolute top-4 right-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${data.color} shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    <div className="pr-16">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                        bg-gradient-to-br ${data.color}
                      `}>
                                                {index + 1}
                                            </span>
                                            <h3 className="font-semibold text-slate-900">
                                                {getLocalizedText(comp.title)}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">
                                            {getLocalizedText(comp.description)}
                                        </p>

                                        <div className="space-y-2">
                                            {data.elements.slice(0, 3).map((element, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                    <span>{getLocalizedText(element)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Flow Arrows */}
                    <div className="hidden md:flex items-center justify-center gap-4 my-6">
                        {[1, 2, 3].map((i) => (
                            <ArrowRight key={i} className="h-6 w-6 text-slate-300" />
                        ))}
                    </div>

                    {/* Result */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center"
                    >
                        <h3 className="text-lg font-bold mb-2">
                            {language === 'ru' ? 'Результат' : language === 'uz_cyr' ? 'Натижа' : 'Natija'}
                        </h3>
                        <p className="text-emerald-100">
                            {language === 'ru' ?
                                'Специалист, готовый к работе в условиях цифровой трансформации нефтегазовой отрасли' :
                                language === 'uz_cyr' ?
                                    'Нефт-газ соҳасининг рақамли трансформацияси шароитида ишлашга тайёр мутахассис' :
                                    "Neft-gaz sohasining raqamli transformatsiyasi sharoitida ishlashga tayyor mutaxassis"
                            }
                        </p>
                    </motion.div>
                </CardContent>
            </Card>

            {/* Detailed View */}
            <Tabs value={selectedComponent} onValueChange={setSelectedComponent}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-slate-100">
                    {components.map((comp) => (
                        <TabsTrigger key={comp.key} value={comp.key} className="text-xs md:text-sm">
                            {getLocalizedText(comp.title).split('-')[0]}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {components.map((comp) => {
                    const data = componentData[comp.key];
                    const Icon = data.icon;

                    return (
                        <TabsContent key={comp.key} value={comp.key}>
                            <Card className="border-slate-200/60">
                                <CardHeader className={`${data.bgColor} border-b ${data.borderColor}`}>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${data.color} shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        {getLocalizedText(comp.title)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-slate-600 mb-6">
                                        {getLocalizedText(comp.description)}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {data.elements.map((element, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200"
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {getLocalizedText(element)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}