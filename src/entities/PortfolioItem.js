import { supabase, handleResponse } from '../lib/supabase';

const TABLE_NAME = 'portfolio_items';

export async function fetchPortfolioItems(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
    }
    if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
    }
    if (filters.item_type) {
        query = query.eq('item_type', filters.item_type);
    }

    return handleResponse(query.order('created_at', { ascending: false }));
}

export async function fetchPortfolioItemById(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).select('*').eq('id', entityId).single()
    );
}

export async function createPortfolioItem(itemData) {
    return handleResponse(
        supabase.from(TABLE_NAME).insert([itemData]).select().single()
    );
}

export async function updatePortfolioItem(entityId, updateData) {
    return handleResponse(
        supabase.from(TABLE_NAME).update(updateData).eq('id', entityId).select().single()
    );
}

export async function deletePortfolioItem(entityId) {
    return handleResponse(
        supabase.from(TABLE_NAME).delete().eq('id', entityId)
    );
}

export async function fetchPortfolioItemsByStudent(studentId) {
    return fetchPortfolioItems({ student_id: studentId });
}

export default {
    fetchPortfolioItems,
    fetchPortfolioItemById,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    fetchPortfolioItemsByStudent
};
