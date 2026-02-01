-- Seed Data for FEIRM Pedagogik Tizim

-- Clear existing data (optional, but good for a fresh start)
TRUNCATE students, learning_modules, facilitators, simulation_scenarios, assessments, trajectories, portfolio_items, reflections, simulation_results CASCADE;

-- 1. Insert Students
INSERT INTO students (id, full_name, student_group, specialization, entry_year, status, progress) VALUES
(uuid_generate_v4(), 'Иванова Анна Сергеевна', 'NG-2021-01', 'Geology', 2021, 'Active', 75),
(uuid_generate_v4(), 'Петров Дмитрий Викторович', 'NG-2021-02', 'Drilling', 2021, 'Active', 62),
(uuid_generate_v4(), 'Sattorov Sardorbek', 'NG-2022-01', 'Production', 2022, 'Active', 45),
(uuid_generate_v4(), 'Karimova Malika', 'NG-2022-02', 'Processing', 2022, 'Active', 58);

-- 2. Insert Learning Modules
INSERT INTO learning_modules (id, title_uz_lat, title_ru, module_type, duration_hours, difficulty_level) VALUES
(uuid_generate_v4(), 'Neft va gaz geologiyasi asoslari', 'Основы геологии нефти и газа', 'theory', 40, 'beginner'),
(uuid_generate_v4(), 'Burg''ulash uskunalarini boshqarish', 'Управление буровым оборудованием', 'simulation', 60, 'intermediate'),
(uuid_generate_v4(), 'Sanoat xavfsizligi va ekologiya', 'Промышленная безопасность и экология', 'laboratory', 30, 'advanced');

-- 3. Insert Facilitators
INSERT INTO facilitators (id, full_name, department, specializations, assigned_groups, role_type) VALUES
(uuid_generate_v4(), 'Ахмедов Рустам Каримович', 'Department of Geology', 'Geology, Exploration', 'NG-2021-01, NG-2022-01', 'mentor'),
(uuid_generate_v4(), 'Nasirova Gulnora', 'Department of Engineering', 'Drilling, Production', 'NG-2021-02, NG-2022-02', 'facilitator');

-- 4. Insert Simulation Scenarios
INSERT INTO simulation_scenarios (id, title_uz_lat, title_ru, scenario_type, difficulty, duration_minutes, industry_sector) VALUES
(uuid_generate_v4(), 'Favqulodda vaziyatda burg''ulashni to''xtatish', 'Аварийная остановка бурения', 'Technical', 'High', 45, 'Drilling'),
(uuid_generate_v4(), 'Gaz separatorini sozlash', 'Настройка газового сепаратора', 'Operational', 'Medium', 30, 'Processing');

-- Link some data (using subqueries to avoid hardcoding IDs)
DO $$
DECLARE
    student_id UUID;
    module_id UUID;
    scenario_id UUID;
BEGIN
    SELECT id INTO student_id FROM students WHERE full_name = 'Иванова Анна Сергеевна' LIMIT 1;
    SELECT id INTO module_id FROM learning_modules WHERE title_ru = 'Основы геологии нефти и газа' LIMIT 1;
    SELECT id INTO scenario_id FROM simulation_scenarios WHERE title_ru = 'Настройка газового сепаратора' LIMIT 1;

    -- 5. Insert Assessments
    INSERT INTO assessments (student_id, module_id, assessment_type, score, assessed_by) VALUES
    (student_id, module_id, 'facilitator_assessment', 85, 'Ахмедов Рустам Каримович');

    -- 6. Insert Trajectories
    INSERT INTO trajectories (student_id, trajectory_name, current_stage, progress_percentage, status) VALUES
    (student_id, 'Senior Geologist Path', 'Deep Well Analysis', 40, 'Active');

    -- 7. Insert Simulation Results
    INSERT INTO simulation_results (student_id, scenario_id, score, success_criteria_met, attempt_number) VALUES
    (student_id, scenario_id, 92, true, 1);
END $$;
