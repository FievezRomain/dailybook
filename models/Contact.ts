export type Contact = {
    id: number;
    nom: string;
    profession: string;
    telephone: string;
    email: string;
    emailproprietaire: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};