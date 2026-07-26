import apiClient from './client';
import type { Tag } from '../types';

export async function getTags(): Promise<Tag[]> {
    const { data } = await apiClient.get<Tag[]>('/tags');
    return data;
}
