export type ObjectifEtape = {
    id: number;
    etape: string;
    state: string | boolean;
    order: number;
}

export type Objectif = {
    id: number;
    datedebut: Date;
    datefin: Date;
    title: string;
    animaux: number[];
    temporalityobjectif?: string;
    sousetapes: ObjectifEtape[];
    sharedgroups?: number[];
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};
