import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'simulation_scenarios';

export async function fetchSimulationScenarios(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.scenario_type) {
        query = query.eq('scenario_type', filters.scenario_type);
    }
    if (filters.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level);
    }
    if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchSimulationScenarioById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createSimulationScenario(scenarioData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([scenarioData]).select().single()
    );
}

export async function updateSimulationScenario(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteSimulationScenario(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchActiveSimulationScenarios() {
    return fetchSimulationScenarios({ is_active: true });
}

export default {
    fetchSimulationScenarios,
    fetchSimulationScenarioById,
    createSimulationScenario,
    updateSimulationScenario,
    deleteSimulationScenario,
    fetchActiveSimulationScenarios
};
