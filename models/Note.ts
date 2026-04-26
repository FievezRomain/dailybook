export type Note = {
    id: number;
    titre: string;
    note: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};