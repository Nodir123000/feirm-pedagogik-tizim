import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'reflections';

export async function fetchReflections(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
    }
    if (filters.module_id) {
        query = query.eq('module_id', filters.module_id);
    }
    if (filters.reflection_type) {
        query = query.eq('reflection_type', filters.reflection_type);
    }
    if (filters.is_shared !== undefined) {
        query = query.eq('is_shared', filters.is_shared);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchReflectionById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createReflection(reflectionData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([reflectionData]).select().single()
    );
}

export async function updateReflection(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteReflection(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchReflectionsByStudent(studentId) {
    return fetchReflections({ student_id: studentId });
}

export default {
    fetchReflections,
    fetchReflectionById,
    createReflection,
    updateReflection,
    deleteReflection,
    fetchReflectionsByStudent
};
