import { GroupMember } from './GroupMember';

export type GroupAnimal = {
    id: number;
    nom: string;
    espece?: string | null;
    image?: string | null;
};

export type GroupBucket<T> = {
    type: 'pending' | 'accepted';
    items: T[];
};

export type Group = {
    id: number;
    name: string;
    informations?: string | null;
    nb_members?: number | null;
    nb_animaux?: number | null;
    created_at?: string | null;
    data?: {
        members?: GroupBucket<GroupMember>[];
        animals?: GroupBucket<GroupAnimal>[];
    } | null;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};