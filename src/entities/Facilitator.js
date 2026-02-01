import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'facilitators';

export async function fetchFacilitators(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.department) {
        query = query.eq('department', filters.department);
    }
    if (filters.specializations) {
        query = query.eq('specializations', filters.specializations);
    }
    if (filters.role_type) {
        query = query.eq('role_type', filters.role_type);
    }
    if (filters.assigned_groups) {
        query = query.eq('assigned_groups', filters.assigned_groups);
    }

    return handleResponse(query.order('full_name', { ascending: true }));
}

export async function fetchFacilitatorById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createFacilitator(facilitatorData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([facilitatorData]).select().single()
    );
}

export async function updateFacilitator(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deleteFacilitator(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchFacilitatorsByDepartment(department) {
    return fetchFacilitators({ department });
}

export default {
    fetchFacilitators,
    fetchFacilitatorById,
    createFacilitator,
    updateFacilitator,
    deleteFacilitator,
    fetchFacilitatorsByDepartment
};
