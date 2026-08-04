import { useState, useEffect } from "react";
import {
    getIncomingRequests,
    getOutgoingRequests,
    getAcceptedRequests,
    acceptRequest,
    declineRequest,
    type ContactRequest,
} from "../api/contactRequests";
import { useAuth } from "../hooks/useAuth";


export default function Requests() {
    const { user: currentUser } = useAuth();
    const [incoming, setIncoming] = useState<ContactRequest[]>([]);
    const [outgoing, setOutgoing] = useState<ContactRequest[]>([]);
    const [accepted, setAccepted] = useState<ContactRequest[]>([]);

    function loadAll () {
        getIncomingRequests().then(setIncoming);
        getOutgoingRequests().then(setOutgoing);
        getAcceptedRequests().then(setAccepted);
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function handleAccept(id: string) {
        await acceptRequest(id);
        loadAll();
    }

    async function handleDecline(id: string) {
        await declineRequest(id);
        loadAll();
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="font-display text-2xl mb-6">Контакты</h1>

            <section className="mb-8">
                <h2 className="font-mono text-sm text-blueprint-text/60 mb-3">Входящие запросы</h2>
                {incoming.length === 0 ? (
                    <p className="font-body text-sm text-blueprint-text/50">Пусто</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {incoming.map((req) => (
                            <div
                                key={req.id}
                                className="flex justify-between items-center bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-3"
                            >
                                <span className="font-body">{req.requester.username}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="font-mono text-xs px-3 py-1 border border-status-done text-status-done rounded hover:bg-status-done/10"
                                    >
                                        Принять
                                    </button>
                                    <button
                                        onClick={() => handleDecline(req.id)}
                                        className="font-mono text-xs px-3 py-1 border border-blueprint-stamp text-blueprint-stamp rounded hover:bg-blueprint-stamp/10"
                                    >
                                        Отклонить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="mb-8">
                <h2 className="font-mono text-sm text-blueprint-text/60 mb-3">Исходящие запросы</h2>
                {outgoing.filter((r) => r.status === 'PENDING').length === 0 ? (
                    <p className="font-body text-sm text-blueprint-text/50">Пусто</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {outgoing
                            .filter((r) => r.status === 'PENDING')
                            .map((req) => (
                                <div
                                    key={req.id}
                                    className="bg-blueprint-panel border border-blueprint-grid/50 rounded px-4 py-3 font-body"
                                >
                                    {req.recipient.username} -- ожидание
                                </div>
                            ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="font-mono text-sm text-blueprint-text/60 mb-3">Принятые контакты</h2>
                {accepted.length === 0 ? (
                    <p className="font-body text-sm text-blueprint-text/50">Пока нет</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {accepted.map((req) => {
                            const other = req.requester.username === currentUser?.id ? req.recipient : req.requester;
                            return (
                                <div
                                    key={req.id}
                                    className="bg-blueprint-panel border border-status-done/50 rounded px-4 py-3 font-body flex flex-col gap-1"
                                >
                                    <span className="font-mono text-sm">{other.username}</span>
                                    {other.phone && <span className="text-sm text-blueprint-text/70">📞 {other.phone}</span>}
                                    {other.telegramUsername && (
                                        <span className="text-sm text-blueprint-text/70">✈️ @{other.telegramUsername}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}