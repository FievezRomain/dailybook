export type Contact = {
    id: number;
    nom: string;
    profession?: string | null;
    telephone?: string | null;
    email?: string | null;
    emailproprietaire?: string | null;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};