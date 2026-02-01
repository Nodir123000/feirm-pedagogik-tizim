import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'students';

export async function fetchStudents(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_group) {
        query = query.eq('student_group', filters.student_group);
    }
    if (filters.full_name) {
        query = query.ilike('full_name', `%${filters.full_name}%`);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchStudentById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createStudent(studentData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([studentData]).select().single()
    );
}

export async function updateStudent(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteStudent(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchStudentsByGroup(groupName) {
    return fetchStudents({ student_group: groupName });
}

export default {
    fetchStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudentsByGroup
};
