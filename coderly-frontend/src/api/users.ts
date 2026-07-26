import apiClient from './client';
import type { User } from '../types';

interface UpdateProfilePayload {
    username?: string;
    bio?: string;
    github?: string;
}

export async function getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
}

export async function getProfile(username: string): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${username}`);
    return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.patch<User>('/users/me', payload);
    return data;
}
