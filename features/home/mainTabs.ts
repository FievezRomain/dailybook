import type { BottomBarItem } from '../../shared/components/ui';
export type MainTabId = 'home' | 'agenda' | 'animals' | 'tracking' | 'more';
export const tabs: readonly BottomBarItem<MainTabId>[] = [{ id: 'home', label: 'Accueil', icon: 'home' }, { id: 'tracking', label: 'Suivi', icon: 'tracking' }, { id: 'agenda', label: 'Agenda', icon: 'agenda' }, { id: 'animals', label: 'Animaux', icon: 'animals' }, { id: 'more', label: 'Plus', icon: 'more' }];
