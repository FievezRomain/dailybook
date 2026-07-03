export type Wish = {
    id: number;
    nom: string;
    destinataire: string;
    acquis: boolean;
    url?: string;
    /**
     * Le backend stocke le prix en `str` (Pydantic `prix: str | None`).
     * Conserver le type string côté mobile pour rester aligné.
     * Les conversions numériques (parseFloat) restent locales aux composants.
     */
    prix?: string | null;
    image?: string;
    previousimage?: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};