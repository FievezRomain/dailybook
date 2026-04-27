let counter = 1;

type MockEvent = {
  id: number;
  nom: string;
  dateevent: string;
  animaux: number[];
  eventtype: string;
  [key: string]: unknown;
};

export function createMockEvent(overrides: Partial<MockEvent> = {}): MockEvent {
  const id = counter++;
  return {
    id,
    nom: `Sortie_${id}`,
    dateevent: '2025-06-15',
    animaux: [1],
    eventtype: 'balade',
    ...overrides,
  };
}

export const createMockBaladeEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'balade', note: 4, ...o });

export const createMockEntrainementEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'entrainement', discipline: 'Dressage', ...o });

export const createMockConcoursEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'concours', epreuve: 'Complet', placement: '1', ...o });

export const createMockSoinsEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'soins', traitement: 'Vermifuge', ...o });

export const createMockRdvEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'rdv', specialiste: 'Vétérinaire', ...o });

export const createMockDepenseEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'depense', depense: 150, ...o });

export const createMockAutreEvent = (o: Partial<MockEvent> = {}) =>
  createMockEvent({ eventtype: 'autre', ...o });

export function resetEventCounter() {
  counter = 1;
}
