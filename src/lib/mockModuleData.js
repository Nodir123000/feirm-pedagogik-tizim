// Mock pedagogical data for module details
// This would normally come from the database
export const getMockModuleDetails = (module) => {
    return {
        overview: {
            context: { uz: "Sanoat jarayonlarini raqamlashtirish va samaradorlikni oshirish.", ru: "Цифровизация промышленных процессов и повышение эффективности." },
            audience: { uz: "Soha mutaxassislari va talabalar", ru: "Профильные специалисты и студенты" },
            connection: { uz: "Kelajakdagi kasbiy o'sish poydevori", ru: "Фундамент для будущего профессионального роста" },
            // Scientific Expansion
            methodology: { uz: "Aralash ta'lim modellari (Blended Learning) va muammoli o'qitish.", ru: "Модели смешанного обучения (Blended Learning) и проблемное обучение." },
            keywords: [
                { uz: "Raqamli egizaklar", ru: "Цифровые двойники" },
                { uz: "Katta ma'lumotlar", ru: "Big Data" },
                { uz: "Sanoat 4.0", ru: "Индустрия 4.0" }
            ],
            duration_breakdown: {
                theory: 30,
                practice: 50,
                assessment: 20
            }
        },
        bloomLevels: [
            { level: 'bloom_remember', description: 'bloom_remember' },
            { level: 'bloom_understand', description: 'bloom_understand' },
            { level: 'bloom_apply', description: 'bloom_apply' },
            { level: 'bloom_analyze', description: 'bloom_analyze' },
            { level: 'bloom_evaluate', description: 'bloom_evaluate' },
            { level: 'bloom_create', description: 'bloom_create' }
        ],
        professionalCompetencies: [
            'comp_technical',
            'comp_safety',
            'comp_industry',
            'comp_optimization', // New
            'comp_sustainability' // New
        ],
        metaCompetencies: [
            'comp_critical',
            'comp_communication',
            'comp_self_directed',
            'comp_digital_literacy', // New
            'comp_emotional_intelligence' // New
        ],
        lessons: [
            {
                title: 'lesson_intro',
                duration: '2 hrs',
                approach: 'facilitator_guided',
                pedagogical_role: 'role_acquisition', // acquisition
                cognitive_load: 'load_low', // low
                bloom_alignment: 'bloom_remember',
                learning_mode: 'mode_synchronous'
            },
            {
                title: 'lesson_theory_deep_dive',
                duration: '4 hrs',
                approach: 'interactive_lecture',
                pedagogical_role: 'role_acquisition',
                cognitive_load: 'load_medium',
                bloom_alignment: 'bloom_understand',
                learning_mode: 'mode_asynchronous'
            },
            {
                title: 'lesson_practical',
                duration: '3 hrs',
                approach: 'hands_on_practice',
                pedagogical_role: 'role_practice',
                cognitive_load: 'load_high',
                bloom_alignment: 'bloom_apply',
                learning_mode: 'mode_synchronous'
            },
            {
                title: 'lesson_simulation_prep',
                duration: '2 hrs',
                approach: 'demonstration',
                pedagogical_role: 'role_inquiry',
                cognitive_load: 'load_medium',
                bloom_alignment: 'bloom_analyze',
                learning_mode: 'mode_collaborative'
            },
            {
                title: 'lesson_advanced',
                duration: '2 hrs',
                approach: 'collaborative_learning',
                pedagogical_role: 'role_production',
                cognitive_load: 'load_high',
                bloom_alignment: 'bloom_evaluate',
                learning_mode: 'mode_peer'
            },
            {
                title: 'lesson_assessment',
                duration: '1 hr',
                approach: 'self_assessment',
                pedagogical_role: 'role_assessment',
                cognitive_load: 'load_high',
                bloom_alignment: 'bloom_create',
                learning_mode: 'mode_asynchronous'
            }
        ],
        // SCIENTIFIC EXPANSION: Detailed Objectives
        objectives_detailed: [
            {
                description: 'bloom_understand',
                domain: 'domain_cognitive', // cognitive, affective, psychomotor
                level: 'bloom_understand',
                competencies: ['comp_technical', 'comp_digital_literacy']
            },
            {
                description: 'bloom_apply',
                domain: 'domain_psychomotor',
                level: 'bloom_apply',
                competencies: ['comp_safety']
            },
            {
                description: 'bloom_evaluate',
                domain: 'domain_affective',
                level: 'bloom_evaluate',
                competencies: ['comp_ethical', 'comp_communication']
            }
        ],
        // SCIENTIFIC EXPANSION: Assessment Configuration
        assessment_config: {
            rubrics: [
                {
                    criteria: 'rubric_accuracy',
                    weight: 40,
                    levels: {
                        exceeds: 'rubric_exceeds_desc',
                        meets: 'rubric_meets_desc',
                        below: 'rubric_below_desc'
                    }
                },
                {
                    criteria: 'rubric_safety',
                    weight: 30,
                    levels: {
                        exceeds: 'rubric_safety_exceeds',
                        meets: 'rubric_safety_meets',
                        below: 'rubric_safety_below'
                    }
                }
            ],
            competency_matrix: [
                { method: 'assess_quiz', competencies: ['comp_technical'] },
                { method: 'assess_simulation', competencies: ['comp_technical', 'comp_safety', 'comp_decision_making'] }
            ]
        },
        // SCIENTIFIC EXPANSION: Facilitator (Community of Inquiry & Cognitive Apprenticeship)
        facilitator_detailed: [
            {
                phase: 'phase_pre',
                presence: 'presence_teaching', // CoI
                activity: { uz: "O'quv dizaynini loyihalash", ru: "Проектирование учебного дизайна" },
                strategy: 'strat_modeling' // Cognitive Apprenticeship
            }
        ],
        // SCIENTIFIC EXPANSION: Resources (IEEE LOM & Scaffolding)
        resources_detailed: [
            {
                title: { uz: "Asosiy o'quv qo'llanma", ru: "Основное учебное руководство" },
                type: 'res_reading',
                metadata: {
                    interactivity: 'inter_expositive', // IEEE LOM
                    difficulty: 'diff_medium',
                    learning_time: '2h'
                },
                citation: "Author, A. (Year). Title. Publisher."
            }
        ],
        // SCIENTIFIC EXPANSION: Analytics (SBCM, MPMS, AI)
        analytics_detailed: {
            sbcm_stats: [
                { dimension: 'motivational_value', score: 85, max: 100 },
                { dimension: 'cognitive_activity', score: 72, max: 100 },
                { dimension: 'technological_comp', score: 90, max: 100 },
                { dimension: 'reflective_evaluative', score: 65, max: 100 }
            ],
            mpms_monitoring: {
                level: 3, // 1=Group, 2=Individual, 3=Diagnostic
                average_progress: 78,
                at_risk_students: 2,
                total_students: 24
            },
            ai_recommendations: [
                {
                    type: 'simulation_ready',
                    module_id: 'drilling_sim_01',
                    reason: { uz: "Texnologik kompetensiya yuqori", ru: "Высокая технологическая компетенция" }
                },
                {
                    type: 'develop_reflective',
                    resource_id: 'reflection_log_01',
                    reason: { uz: "Refleksiv ko'nikmalarni rivojlantirish kerak", ru: "Необходимо развить рефлексивные навыки" }
                }
            ]
        },
        formativeAssessment: [
            'assess_feedback',
            'assess_checkpoints',
            'assess_quiz', // New
            'assess_peer'
        ],
        summativeAssessment: [
            'assess_performance',
            'assess_simulation',
            'assess_final_project', // New
            'assess_portfolio'
        ],
        facilitatorRole: [
            'role_guide',
            'role_engage',
            'role_feedback',
            'role_mentor', // New
            'role_model'
        ],
        studentActivities: [
            'activity_explore',
            'activity_research', // New
            'activity_collab',
            'activity_case'
        ],
        reflectionPoints: [
            { stage: 'prior_knowledge', description: 'reflection_prior' },
            { stage: 'during_checkpoints', description: 'reflection_during' },
            { stage: 'post_analysis', description: 'reflection_post' },
            { stage: 'transfer_planning', description: 'reflection_transfer' } // New
        ],
        prerequisites: [
            'required_knowledge',
            'comp_safety',
            'comp_basic_math' // New
        ],
        resources: [
            'resource_industry',
            'resource_authentic',
            'resource_digital_library', // New
            'resource_simulation'
        ]
    };
};
