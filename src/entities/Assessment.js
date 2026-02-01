import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'assessments';

export async function fetchAssessments(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
    }
    if (filters.module_id) {
        query = query.eq('module_id', filters.module_id);
    }
    if (filters.assessment_type) {
        query = query.eq('assessment_type', filters.assessment_type);
    }
    if (filters.assessed_by) {
        query = query.eq('assessed_by', filters.assessed_by);
    }
    if (filters.assessment_date_start) {
        query = query.gte('assessment_date', filters.assessment_date_start);
    }
    if (filters.assessment_date_end) {
        query = query.lte('assessment_date', filters.assessment_date_end);
    }

    return handleResponse(query.order('assessment_date', { ascending: false }));
}

export async function fetchAssessmentById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createAssessment(assessmentData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([assessmentData]).select().single()
    );
}

export async function updateAssessment(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteAssessment(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchAssessmentsByStudent(studentId) {
    return fetchAssessments({ student_id: studentId });
}

export async function fetchAssessmentsByModule(moduleId) {
    return fetchAssessments({ module_id: moduleId });
}

export default {
    fetchAssessments,
    fetchAssessmentById,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    fetchAssessmentsByStudent,
    fetchAssessmentsByModule
};
