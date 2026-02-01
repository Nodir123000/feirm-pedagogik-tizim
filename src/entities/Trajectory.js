import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'trajectories';

export async function fetchTrajectories(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
    }
    if (filters.current_stage) {
        query = query.eq('current_stage', filters.current_stage);
    }
    if (filters.is_active !== undefined) {
        query = query.eq('status', filters.is_active ? 'Active' : 'Inactive');
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchTrajectoryById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createTrajectory(trajectoryData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([trajectoryData]).select().single()
    );
}

export async function updateTrajectory(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteTrajectory(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchTrajectoriesByStudent(studentId) {
    return fetchTrajectories({ student_id: studentId });
}

export default {
    fetchTrajectories,
    fetchTrajectoryById,
    createTrajectory,
    updateTrajectory,
    deleteTrajectory,
    fetchTrajectoriesByStudent
};
