export type EventType = {
    id: string;
    title: string;
};

export type Event = {
    id: number;
    dateevent: Date;
    nom: string;
    animaux: number[];
    eventtype: string;
    heuredebutevent?: string;
    lieu?: string;
    heuredebutbalade?: string;
    datefinbalade?: Date;
    heurefinbalade?: string;
    discipline?: string;
    note?: number;
    epreuve?: string;
    dossart?: string;
    placement?: string;
    specialiste?: string;
    depense?: number;
    traitement?: string;
    datefinsoins?: Date;
    commentaire?: string;
    frequencevalue?: string;
    categoriedepense?: string;
    frequencetype?: string;
    notif?: string;
    optionnotif?: string;
    state?: string;
    todisplay?: boolean;
    idparent?: number;
    documents?: string[];
    shared_groups?: number[];
};