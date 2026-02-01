import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'learning_modules';

export async function fetchLearningModules(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.module_type) {
        query = query.eq('module_type', filters.module_type);
    }
    if (filters.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level);
    }
    if (filters.specializations) {
        query = query.eq('specializations', filters.specializations);
    }
    if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchLearningModuleById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createLearningModule(moduleData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([moduleData]).select().single()
    );
}

export async function updateLearningModule(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteLearningModule(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchActiveLearningModules() {
    return fetchLearningModules({ is_active: true });
}

export async function fetchLearningModulesByType(moduleType) {
    return fetchLearningModules({ module_type: moduleType });
}

export default {
    fetchLearningModules,
    fetchLearningModuleById,
    createLearningModule,
    updateLearningModule,
    deleteLearningModule,
    fetchActiveLearningModules,
    fetchLearningModulesByType
};
