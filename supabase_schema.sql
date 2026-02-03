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
