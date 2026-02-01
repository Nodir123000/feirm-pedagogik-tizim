import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'simulation_results';

export async function fetchSimulationResults(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
    }
    if (filters.scenario_id) {
        query = query.eq('scenario_id', filters.scenario_id);
    }
    if (filters.success_criteria_met !== undefined) {
        query = query.eq('success_criteria_met', filters.success_criteria_met);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchSimulationResultById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createSimulationResult(resultData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([resultData]).select().single()
    );
}

export async function updateSimulationResult(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteSimulationResult(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchSimulationResultsByStudent(studentId) {
    return fetchSimulationResults({ student_id: studentId });
}

export default {
    fetchSimulationResults,
    fetchSimulationResultById,
    createSimulationResult,
    updateSimulationResult,
    deleteSimulationResult,
    fetchSimulationResultsByStudent
};
