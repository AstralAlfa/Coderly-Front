import apiClient from './client';

export type ContactRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

interface ContactRequestUser {
    id: string;
    username: string;
    phone?: string;
    telegramUsername?: string;
}

export interface ContactRequest {
    id: string;
    status: ContactRequestStatus;
    createdAt: string;
    requester: ContactRequestUser;
    recipient: ContactRequestUser;
}

export async function sendContactRequest(recipientId: string): Promise<ContactRequest> {
    const { data } = await apiClient.post<ContactRequest>('/contact-requests', { recipientId });
    return data;
}

export async function getIncomingRequests(): Promise<ContactRequest[]> {
    const { data } = await apiClient.get<ContactRequest[]>('/contact-requests/incoming');
    return data;
}

export async function getOutgoingRequests(): Promise<ContactRequest[]> {
    const { data } = await apiClient.get<ContactRequest[]>('/contact-requests/outgoing');
    return data;
}

export async function getAcceptedRequests(): Promise<ContactRequest[]> {
    const { data } = await apiClient.get<ContactRequest[]>('/contact-requests/accepted');
    return data;
}

export async function acceptRequest(id: string): Promise<ContactRequest> {
    const { data } = await apiClient.patch<ContactRequest>(`/contact-requests/${id}/accept`);
    return data;
}

export async function declineRequest(id: string): Promise<ContactRequest> {
    const { data } = await apiClient.patch<ContactRequest>(`/contact-requests/${id}/decline`);
    return data;
}
