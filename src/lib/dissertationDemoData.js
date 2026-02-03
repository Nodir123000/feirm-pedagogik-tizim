// Mock data for dissertation concepts demonstration
// SBCM, MPMS, FEIRM, ASM, SDME

/**
 * SBCM - Simulation-Based Competency Model
 * 4 компонента: мотивационно-ценностный, когнитивно-деятельностный, 
 * технологический, рефлексивно-оценочный
 */
export const getSBCMDemoData = () => ({
    motivationalComponent: {
        intrinsicMotivation: 78,
        professionalValues: 85,
        careerOrientation: 72,
        learningInterest: 88
    },
    cognitiveComponent: {
        theoreticalKnowledge: 75,
        practicalSkills: 82,
        problemSolving: 79,
        criticalThinking: 81
    },
    technologicalComponent: {
        anyLogicProficiency: 65,
        simulationTools: 70,
        digitalLiteracy: 88,
        industryTech: 73
    },
    reflectiveComponent: {
        selfAssessment: 76,
        metacognition: 72,
        adaptability: 84,
        continuousImprovement: 80
    }
});

/**
 * MPMS - Multi-Tiered Pedagogical Monitoring System
 * 3 уровня: групповой, индивидуальный, компонентный
 */
export const getMPMSDemoData = () => ({
    // Уровень 1: Групповая аналитика
    groupLevel: {
        totalStudents: 45,
        averageProgress: 76.5,
        competencyDistribution: {
            high: 12,
            medium: 28,
            low: 5
        },
        bloomLevelDistribution: {
            remember: 95,
            understand: 88,
            apply: 76,
            analyze: 65,
            evaluate: 52,
            create: 38
        }
    },

    // Уровень 2: Индивидуальные траектории
    individualTrajectories: [
        {
            studentId: 1,
            name: "Алишер Каримов",
            currentLevel: "Intermediate",
            progressTrend: "ascending",
            recommendations: [
                "Усилить работу с симуляциями AnyLogic",
                "Развивать навыки критического анализа",
                "Участвовать в групповых проектах"
            ],
            adaptiveActions: [
                "Предложен дополнительный модуль по бурению",
                "Рекомендовано участие в peer review"
            ]
        },
        {
            studentId: 2,
            name: "Нодира Усманова",
            currentLevel: "Advanced",
            progressTrend: "stable",
            recommendations: [
                "Перейти к сложным производственным кейсам",
                "Взять роль ментора для других студентов"
            ],
            adaptiveActions: [
                "Открыт доступ к продвинутым симуляциям"
            ]
        }
    ],

    // Уровень 3: Диагностика по компонентам SBCM
    componentDiagnostics: {
        byStudent: {
            studentId: 1,
            motivational: { score: 78, trend: "up", lastUpdate: "2024-01-25" },
            cognitive: { score: 75, trend: "stable", lastUpdate: "2024-01-25" },
            technological: { score: 65, trend: "up", lastUpdate: "2024-01-24" },
            reflective: { score: 76, trend: "up", lastUpdate: "2024-01-25" }
        }
    }
});

/**
 * AI Recommendations (для траекторий и адаптации)
 */
export const getAIRecommendations = () => [
    {
        type: "module_suggestion",
        priority: "high",
        title: "Рекомендуется модуль: Бурение скважин",
        description: "На основе ваших результатов в симуляциях добычи, рекомендуем изучить модуль по бурению для углубления знаний.",
        icon: "BookOpen",
        action: "view_module",
        moduleId: "drilling-basics"
    },
    {
        type: "competency_gap",
        priority: "medium",
        title: "Развитие рефлексивных навыков",
        description: "Заполните рефлексивный дневник после завершения последней симуляции для улучшения метакогнитивных навыков.",
        icon: "Brain",
        action: "open_reflection"
    },
    {
        type: "peer_learning",
        priority: "low",
        title: "Групповой проект доступен",
        description: "Присоединяйтесь к команде для работы над кейсом 'Оптимизация добычи нефти'.",
        icon: "Users",
        action: "join_project"
    },
    {
        type: "simulation_ready",
        priority: "high",
        title: "Новая симуляция доступна",
        description: "Вы готовы к симуляции 'Управление нефтяной скважиной в критических условиях'.",
        icon: "Gamepad2",
        action: "start_simulation",
        simulationId: "critical-well-management"
    }
];

/**
 * Reflection Points (для рефлексивно-оценочного компонента)
 */
export const getReflectionDemoData = () => [
    {
        id: 1,
        studentName: "Алишер Каримов",
        moduleTitle: "Основы бурения",
        reflectionType: "post_module",
        date: "2024-01-25",
        achievements: "Успешно завершил симуляцию бурения вертикальной скважины. Понял принципы работы буровой установки.",
        challenges: "Сложности с расчетом давления в скважине. Нужно повторить теоретический материал.",
        moodRating: 4,
        nextSteps: "Изучить дополнительные материалы по гидравлике. Пройти повторную симуляцию."
    },
    {
        id: 2,
        studentName: "Нодира Усманова",
        moduleTitle: "Добыча нефти",
        reflectionType: "during_module",
        date: "2024-01-24",
        achievements: "Разобралась с методами интенсификации добычи.",
        challenges: "Не хватает практического опыта с реальным оборудованием.",
        moodRating: 5,
        nextSteps: "Запланировать экскурсию на производство."
    }
];

/**
 * Simulation Scenarios (SDME - Simulation-Driven Modular Environment)
 */
export const getSimulationDemoData = () => [
    {
        id: 1,
        title_ru: "Управление процессом бурения",
        title_uz_lat: "Burg'ulash jarayonini boshqarish",
        description_ru: "Симуляция управления буровой установкой с учетом геологических условий и технических ограничений.",
        scenarioType: "drilling",
        difficulty: "intermediate",
        duration: 45,
        industrySector: "Бурение",
        hasAIAnalysis: true,
        relatedCompetencies: ["Технические навыки", "Принятие решений", "Безопасность"],
        completionRate: 68,
        averageScore: 75.5,
        studentsCompleted: 31
    },
    {
        id: 2,
        title_ru: "Оптимизация добычи нефти",
        title_uz_lat: "Neft qazib olishni optimallashtirish",
        description_ru: "Комплексная симуляция управления нефтяной скважиной с анализом экономической эффективности.",
        scenarioType: "production",
        difficulty: "advanced",
        duration: 60,
        industrySector: "Добыча",
        hasAIAnalysis: true,
        relatedCompetencies: ["Аналитическое мышление", "Экономическая оценка", "Системный подход"],
        completionRate: 42,
        averageScore: 68.3,
        studentsCompleted: 19
    },
    {
        id: 3,
        title_ru: "Реагирование на аварийные ситуации",
        title_uz_lat: "Favqulodda vaziyatlarga javob berish",
        description_ru: "Симуляция действий при возникновении нештатных ситуаций на буровой площадке.",
        scenarioType: "emergency",
        difficulty: "advanced",
        duration: 30,
        industrySector: "Безопасность",
        hasAIAnalysis: true,
        relatedCompetencies: ["Быстрое реагирование", "Командная работа", "Протоколы безопасности"],
        completionRate: 55,
        averageScore: 72.1,
        studentsCompleted: 25
    }
];

/**
 * Student Progress with SBCM Components
 */
export const getStudentProgressDemo = () => ({
    studentId: 1,
    fullName: "Алишер Каримов",
    group: "NG-2024",
    overallProgress: 76,

    // SBCM Components Progress
    sbcmComponents: {
        motivational: {
            current: 78,
            history: [65, 70, 72, 75, 78],
            target: 85
        },
        cognitive: {
            current: 75,
            history: [60, 68, 72, 74, 75],
            target: 85
        },
        technological: {
            current: 65,
            history: [50, 55, 58, 62, 65],
            target: 80
        },
        reflective: {
            current: 76,
            history: [62, 68, 71, 74, 76],
            target: 85
        }
    },

    // Competencies (Professional + Meta)
    competencies: {
        professional: {
            drilling: 78,
            production: 72,
            safety: 85,
            equipment: 68
        },
        meta: {
            criticalThinking: 81,
            communication: 76,
            teamwork: 79,
            selfLearning: 84
        }
    },

    // Bloom's Taxonomy Levels
    bloomLevels: {
        remember: 95,
        understand: 88,
        apply: 76,
        analyze: 65,
        evaluate: 52,
        create: 38
    },

    // Recent Activities
    recentActivities: [
        { type: "simulation", title: "Бурение скважины", score: 82, date: "2024-01-25" },
        { type: "reflection", title: "Рефлексия по модулю", completed: true, date: "2024-01-25" },
        { type: "module", title: "Основы добычи", progress: 65, date: "2024-01-24" }
    ]
});

/**
 * FEIRM Demo Data (Facilitator role examples)
 */
export const getFEIRMDemoData = () => ({
    facilitatorActivities: [
        {
            type: "guidance",
            description: "Индивидуальная консультация по результатам симуляции",
            student: "Алишер Каримов",
            date: "2024-01-25",
            outcome: "Определены точки роста в технологическом компоненте"
        },
        {
            type: "feedback",
            description: "Обратная связь по групповому проекту",
            group: "NG-2024",
            date: "2024-01-24",
            outcome: "Улучшена командная коммуникация"
        }
    ],
    studentCenteredActivities: [
        {
            type: "exploration",
            title: "Исследование методов интенсификации добычи",
            participants: 12,
            status: "active"
        },
        {
            type: "problem_solving",
            title: "Кейс: Оптимизация работы скважины",
            participants: 8,
            status: "completed"
        }
    ]
});
