export type Wish = {
    id: number;
    nom: string;
    destinataire: string;
    acquis: boolean;
    url?: string;
    prix?: number;
    image?: string;
    previousimage?: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};