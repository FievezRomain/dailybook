export interface LinkedAnimalData { id: string; name: string; imageUrl?: string | null; initials?: string; color?: string }

export function getLinkedAnimalsPresentation(animals: readonly LinkedAnimalData[], maxVisible = 2) {
  const visible = animals.slice(0, maxVisible);
  const remaining = Math.max(0, animals.length - visible.length);
  const label = animals.length <= 2 ? animals.map((animal) => animal.name).join(' · ') : `${animals.length} animaux`;
  return { visible, remaining, label, accessibilityLabel: animals.length ? `Animaux liés : ${animals.map((animal) => animal.name).join(', ')}` : 'Aucun animal lié' };
}
