export type Animal = {
    id: number;
    nom: string;
    espece: string;
    datenaissance?: string;
    datearrivee?: string;
    datedepart?: string;
    datedeces?: string;
    race?: string;
    taille?: number;
    poids?: number;
    sexe?: string;
    food?: string;
    quantity?: number;
    unity?: string;
    couleur?: string;
    nompere?: string;
    nommere?: string;
    numeroidentification?: string;
    image?: string;
    /** URL de lecture signée, distincte du nom de fichier persistant `image`. */
    imageUrl?: string;
    previousimage?: string;
    informations?: string;
    provenance?: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};
