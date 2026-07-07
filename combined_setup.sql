-- FEIRM Pedagogik Tizim Schema for Supabase

-- 1. Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    student_group TEXT,
    specialization TEXT,
    entry_year INTEGER,
    status TEXT DEFAULT 'Active',
    progress DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Learning Modules
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_uz_lat TEXT,
    title_uz_cyr TEXT,
    title_ru TEXT,
    description_uz_lat TEXT,
    description_uz_cyr TEXT,
    description_ru TEXT,
    module_type TEXT,
    duration_hours INTEGER,
    difficulty_level TEXT,
    pedagogical_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    module_id UUID REFERENCES learning_modules(id),
    assessment_type TEXT,
    score DECIMAL,
    competency_scores JSONB,
    feedback_uz_lat TEXT,
    feedback_ru TEXT,
    assessed_by TEXT,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Facilitators
CREATE TABLE facilitators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    department TEXT,
    specializations TEXT,
    assigned_groups TEXT,
    role_type TEXT,
    avatar_url TEXT,
    bio_uz_lat TEXT,
    bio_ru TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Portfolio Items
CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    title_uz_lat TEXT,
    title_ru TEXT,
    item_type TEXT,
    description TEXT,
    file_url TEXT,
    related_module_id UUID REFERENCES learning_modules(id),
    competencies_demonstrated TEXT,
    visibility TEXT DEFAULT 'Private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Trajectories
CREATE TABLE trajectories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    trajectory_name_uz_lat TEXT,
    trajectory_name_ru TEXT,
    current_stage TEXT,
    progress_percentage DECIMAL DEFAULT 0,
    status TEXT DEFAULT 'Active',
    ai_recommendations JSONB,
    milestones JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Reflections
CREATE TABLE reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    module_id UUID REFERENCES learning_modules(id),
    reflection_type TEXT,
    content TEXT,
    content_ru TEXT,
    achievements TEXT,
    achievements_ru TEXT,
    challenges TEXT,
    challenges_ru TEXT,
    mood_rating INTEGER,
    facilitator_feedback TEXT,
    facilitator_feedback_ru TEXT,
    ai_analysis JSONB DEFAULT '{}',
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Simulation Scenarios
CREATE TABLE simulation_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_uz_lat TEXT,
    title_ru TEXT,
    description_uz_lat TEXT,
    description_ru TEXT,
    scenario_type TEXT,
    difficulty TEXT,
    duration_minutes INTEGER,
    industry_sector TEXT,
    has_ai_analysis BOOLEAN DEFAULT TRUE,
    related_competencies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Simulation Results
CREATE TABLE simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    scenario_id UUID REFERENCES simulation_scenarios(id),
    score DECIMAL,
    success_criteria_met BOOLEAN,
    completion_time_minutes INTEGER,
    ai_feedback JSONB,
    attempt_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. Update Schema: Add competency columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS professional_competency INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS meta_competency INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS motivation_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reflective_skills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS student_group_id TEXT; -- For internal mapping if needed

-- 2. Clear existing data and seed all 8 students
TRUNCATE students CASCADE;

INSERT INTO students (full_name, student_group, specialization, professional_competency, meta_competency, motivation_level, reflective_skills, progress, status, avatar_url) VALUES
('Sattorov Sardorbek', 'NG-2021-01', 'drilling', 85, 70, 75, 60, 75, 'Active', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'),
('Karimova Malika', 'NG-2021-01', 'geology', 92, 80, 85, 70, 84, 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'),
('Islomov Jasur', 'NG-2021-02', 'production', 65, 55, 60, 50, 58, 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'),
('Abduvaliyeva Shaxnoza', 'NG-2021-02', 'processing', 78, 85, 80, 75, 80, 'Active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200'),
('Xasanov Dilshod', 'NG-2022-01', 'transportation', 45, 50, 70, 40, 42, 'Active', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200'),
('Yoqubova Nigora', 'NG-2022-01', 'drilling', 60, 65, 75, 55, 55, 'Active', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200&h=200'),
('Umarov Farrux', 'NG-2022-02', 'production', 88, 72, 82, 68, 78, 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'),
('Soliyeva Barno', 'NG-2022-02', 'geology', 95, 88, 90, 85, 92, 'Active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200');

-- 3. Seed additional Learning Modules (to match Base44's 6 modules)
TRUNCATE learning_modules CASCADE;
INSERT INTO learning_modules (title_uz_lat, title_ru, module_type, duration_hours, difficulty_level, description_uz_lat, description_ru) VALUES
('Neft va gaz geologiyasi', 'Геология нефти и газа', 'theory', 40, 'beginner', 'Neft va gaz konlarining hosil bo''lishi va joylashishi.', 'Образование и расположение нефтегазовых месторождений.'),
('Burg''ulash texnologiyalari', 'Технологии бурения', 'simulation', 60, 'intermediate', 'Zamonaviy burg''ulash usullari va uskunalarini o''rganish.', 'Изучение современных методов и оборудования для бурения.'),
('Sanoat xavfsizligi', 'Промышленная безопасность', 'laboratory', 30, 'advanced', 'Xavfsiz ish muhitini yaratish va xavflarni boshqarish.', 'Создание безопасной рабочей среды и управление рисками.'),
('Gazni qayta ishlash', 'Переработка газа', 'theory', 45, 'intermediate', 'Tabiiy gazni tozalash va qayta ishlash jarayonlari.', 'Процессы очистки и переработки природного газа.'),
('Logistika va transport', 'Логистика и транспорт', 'project', 50, 'advanced', 'Energetika resurslarini tashish tizimlarini optimallashtirish.', 'Оптимизация систем транспортировки энергетических ресурсов.'),
('Raqamli kon texnologiyalari', 'Технологии цифрового месторождения', 'simulation', 55, 'advanced', 'Konlarni boshqarishda IT-yechimlarni qo''llash.', 'Применение IT-решений в управлении месторождениями.');

-- 4. Seed some Trajectories
TRUNCATE trajectories CASCADE;
INSERT INTO trajectories (student_id, trajectory_name_uz_lat, trajectory_name_ru, current_stage, progress_percentage, status, ai_recommendations) 
SELECT 
    id, 
    CASE 
        WHEN specialization = 'drilling' THEN 'Burg''ulash mutaxassisi yo''li'
        WHEN specialization = 'geology' THEN 'Geolog-tadqiqotchi yo''li'
        ELSE 'Umumiy muhandislik traektoriyasi'
    END,
    CASE 
        WHEN specialization = 'drilling' THEN 'Путь специалиста по бурению'
        WHEN specialization = 'geology' THEN 'Путь геолога-исследователя'
        ELSE 'Общая инженерная траектория'
    END,
    'O''rta darajadagi modullar',
    progress,
    'Active',
    '["Tavsiya etilgan: 2-modulni yakunlang", "SBCM: Professional ko''nikmalarga urg''u bering"]'::jsonb
FROM students 
LIMIT 5;

-- 5. Seed Reflections
TRUNCATE reflections CASCADE;
INSERT INTO reflections (student_id, module_id, reflection_type, content, content_ru, achievements, achievements_ru, mood_rating)
SELECT 
    s.id,
    m.id,
    'Monthly',
    'O''tgan davr mobaynida burg''ulash texnikasini o''rgandim.',
    'За прошедший период я изучил технику бурения.',
    'SBCM modellarini tushunib yetdim.',
    'Я полностью понял модели SBCM.',
    5
FROM students s, learning_modules m
WHERE s.specialization = 'drilling' AND m.title_uz_lat = 'Burg''ulash texnologiyalari'
LIMIT 3;
