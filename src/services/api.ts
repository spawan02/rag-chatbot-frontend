import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = `${base}/api/v1`;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

export interface ChatMessage {
    query: string;
    answer: string;
}

export interface SessionResponse {
    sessionId: string;
}

export interface ChatResponse {
    answer: string;
}

export const chatAPI = {
    startSession: async (): Promise<string> => {
        const response = await api.post<SessionResponse>("/start-session");
        return response.data.sessionId;
    },

    getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
        const response = await api.get<ChatMessage[]>("/history", {
            params: { sessionId },
        });
        return response.data;
    },

    sendMessage: async (sessionId: string, query: string): Promise<string> => {
        const response = await api.post<ChatResponse>("/chat", {
            sessionId,
            query,
        });
        return response.data.answer;
    },

    resetSession: async (sessionId: string): Promise<void> => {
        await api.post("/reset-session", { sessionId });
    },
};
