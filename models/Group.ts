import { GroupMember } from './GroupMember';

export type Group = {
    id: number;
    name: string;
    members: GroupMember[];
    animals: number[];
    informations?: string;
    nb_members?: number;
    nb_animaux?: number;
    created_at?: string;
    /** UI-only — true pendant la sync optimiste */
    syncing?: boolean;
};