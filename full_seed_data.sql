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

INSERT INTO students (full_name, student_group, specialization, professional_competency, meta_competency, motivation_level, reflective_skills, progress, status) VALUES
('Sattorov Sardorbek', 'NG-2021-01', 'drilling', 85, 70, 75, 60, 75, 'Active'),
('Karimova Malika', 'NG-2021-01', 'geology', 92, 80, 85, 70, 84, 'Active'),
('Islomov Jasur', 'NG-2021-02', 'production', 65, 55, 60, 50, 58, 'Active'),
('Abduvaliyeva Shaxnoza', 'NG-2021-02', 'processing', 78, 85, 80, 75, 80, 'Active'),
('Xasanov Dilshod', 'NG-2022-01', 'transportation', 45, 50, 70, 40, 42, 'Active'),
('Yoqubova Nigora', 'NG-2022-01', 'drilling', 60, 65, 75, 55, 55, 'Active'),
('Umarov Farrux', 'NG-2022-02', 'production', 88, 72, 82, 68, 78, 'Active'),
('Soliyeva Barno', 'NG-2022-02', 'geology', 95, 88, 90, 85, 92, 'Active');

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
INSERT INTO trajectories (student_id, trajectory_name, current_stage, progress_percentage, status, ai_recommendations) 
SELECT 
    id, 
    CASE 
        WHEN specialization = 'drilling' THEN 'Burg''ulash mutaxassisi yo''li'
        WHEN specialization = 'geology' THEN 'Geolog-tadqiqotchi yo''li'
        ELSE 'Umumiy muhandislik traektoriyasi'
    END,
    'O''rta darajadagi modullar',
    progress,
    'Active',
    '["Tavsiya etilgan: 2-modulni yakunlang", "SBCM: Professional ko''nikmalarga urg''u bering"]'::jsonb
FROM students 
LIMIT 5;

-- 5. Seed Reflections
TRUNCATE reflections CASCADE;
INSERT INTO reflections (student_id, module_id, reflection_type, content, achievements, mood_rating)
SELECT 
    s.id,
    m.id,
    'Monthly',
    'O''tgan davr mobaynida burg''ulash texnikasini o''rgandim.',
    'SBCM modellarini tushunib yetdim.',
    5
FROM students s, learning_modules m
WHERE s.specialization = 'drilling' AND m.title_uz_lat = 'Burg''ulash texnologiyalari'
LIMIT 3;
