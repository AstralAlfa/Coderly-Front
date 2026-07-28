import apiClient from './client';
import type { Project, ProjectStatus } from '../types';

interface ProjectFilters {
    status?: ProjectStatus;
    tagIds?: string;
}

interface CreateProjectPayload {
    title: string;
    description: string;
    status?: ProjectStatus;
    githubUrl?: string;
    demoUrl?: string;
    tagIds: string[];
}

type UpdateProjectPayload = Partial<CreateProjectPayload>;

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const { data } = await apiClient.get<Project[]>('/projects', {
        params: filters,
    });
    return data;
}

export async function getProject(id: string): Promise<Project> {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
    const { data } = await apiClient.post<Project>('/projects', payload);
    return data;
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, payload);
    return data;
}

export async function deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
}
