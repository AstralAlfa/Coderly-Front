import apiClient from './client';

interface AuthResponse {
    access_token: string;
}

interface RegisterResponse {
    message: string;
}

interface RegisterPayload {
    email: string;
    username: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('auth/login', payload);
    return data;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await apiClient.get<{ message: string }>('/auth/verify-email', {
        params: { token }
    });
    return data;
}
