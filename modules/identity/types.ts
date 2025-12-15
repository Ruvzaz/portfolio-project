export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'admin' | 'user';
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}