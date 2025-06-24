export type ObjectifEtape = {
    id: number;
    etape: string;
    state: string;
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
};