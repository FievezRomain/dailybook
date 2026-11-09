import { create } from 'zustand';

import type { MainTabId } from '../features/home';
import type { VoiceNoteDraft, VoiceRecording } from '../features/notes';

export type CreateOrigin = 'root' | 'notes' | 'wishes' | 'contacts' | 'groups';

type MainNavigationState = {
  tab: MainTabId;
  createOrigin: CreateOrigin;
  preferredAnimalId?: number;
  voiceRecording?: VoiceRecording;
  voiceDraft?: VoiceNoteDraft;
  animalFeedback?: string;
  agendaFeedback?: string;
  setTab: (tab: MainTabId) => void;
  setCreateOrigin: (createOrigin: CreateOrigin) => void;
  setPreferredAnimalId: (preferredAnimalId?: number) => void;
  setVoiceRecording: (voiceRecording?: VoiceRecording) => void;
  setVoiceDraft: (voiceDraft?: VoiceNoteDraft) => void;
  setAnimalFeedback: (animalFeedback?: string) => void;
  setAgendaFeedback: (agendaFeedback?: string) => void;
};

export const useMainNavigationStore = create<MainNavigationState>((set) => ({
  tab: 'home',
  createOrigin: 'root',
  setTab: (tab) => set({ tab }),
  setCreateOrigin: (createOrigin) => set({ createOrigin }),
  setPreferredAnimalId: (preferredAnimalId) => set({ preferredAnimalId }),
  setVoiceRecording: (voiceRecording) => set({ voiceRecording }),
  setVoiceDraft: (voiceDraft) => set({ voiceDraft }),
  setAnimalFeedback: (animalFeedback) => set({ animalFeedback }),
  setAgendaFeedback: (agendaFeedback) => set({ agendaFeedback }),
}));
