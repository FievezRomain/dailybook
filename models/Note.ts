export type Note = {
    id: number;
    titre: string;
    note: string;
    is_pinned?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};