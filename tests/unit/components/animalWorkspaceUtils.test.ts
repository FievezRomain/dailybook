import type { Animal } from '../../../models/Animal';
import type { Event } from '../../../models/Event';
import { compactAnimalDetails, formatAnimalAge, formatAnimalDate, getAnimalMedicalDocuments, getAnimalMedicalEvents, getAnimalPresence, hasAnimalBodyPictureForMonth, isSharedAnimal, normalizeAnimalPictures, resolveAnimalSelection, sortAnimalsForWorkspace } from '../../../features/animals/animalWorkspaceUtils';

const animal = (id: number, nom: string, extra: Partial<Animal> = {}): Animal => ({ id, nom, espece: 'Chien', ...extra });

describe('animalWorkspaceUtils', () => {
  it('identifie uniquement les animaux partagés par un groupe', () => {
    expect(isSharedAnimal(animal(1, 'Partagé', { provenance: 'group' }))).toBe(true);
    expect(isSharedAnimal(animal(2, 'Groupe normalisé', { provenance: ' GROUP ' }))).toBe(true);
    expect(isSharedAnimal(animal(3, 'Propriétaire', { provenance: 'owner' }))).toBe(false);
  });

  it('classe les présents avant les départs puis les décès', () => {
    const result = sortAnimalsForWorkspace([animal(3, 'Mort', { datedeces: '2025-01-01' }), animal(1, 'Présent'), animal(2, 'Parti', { datedepart: '2025-01-01' })]);
    expect(result.map(({ id }) => id)).toEqual([1, 2, 3]);
    expect(getAnimalPresence(result[0])).toBe('present');
    expect(getAnimalPresence(result[1])).toBe('history');
  });

  it('formate les dates, âge et résumé sans valeur vide', () => {
    expect(formatAnimalDate('2022-03-14')).toContain('14 mars 2022');
    expect(formatAnimalDate('14/03/2022')).toContain('14 mars 2022');
    expect(formatAnimalAge('2022-03-14', new Date('2026-03-13'))).toBe('3 ans');
    expect(formatAnimalAge('14/03/2022', new Date('2026-03-13'))).toBe('3 ans');
    expect(compactAnimalDetails(animal(1, 'Milo', { race: 'Berger australien', datenaissance: '2022-03-14' }))).toContain('Chien · Berger australien');
  });

  it('normalise les différentes formes de réponse de galerie', () => {
    expect(normalizeAnimalPictures([{ id: 4, url: 'https://cdn/photo.jpg' }, { filename: 'local.jpg' }, null])).toEqual([
      { id: '4', uri: 'https://cdn/photo.jpg' },
      { id: '1', uri: 'local.jpg' },
    ]);
    expect(normalizeAnimalPictures({ pictures: [] })).toEqual([]);
  });

  it('détecte si la photo de suivi du mois est déjà enregistrée', () => {
    expect(hasAnimalBodyPictureForMonth([
      { id: '1', uri: 'aout.jpg', recordedAt: '2026-08-03' },
    ], new Date(2026, 7, 19))).toBe(true);
    expect(hasAnimalBodyPictureForMonth([
      { id: '1', uri: 'juillet.jpg', recordedAt: '2026-07-31' },
    ], new Date(2026, 7, 19))).toBe(false);
  });

  it('conserve la sélection existante et choisit un fallback selon l’ordre métier si elle disparaît', () => {
    const values = [animal(3, 'Décédé', { datedeces: '2025-01-01' }), animal(2, 'Parti', { datedepart: '2025-01-01' }), animal(1, 'Présent')];
    expect(resolveAnimalSelection(values, 2)).toBe(2);
    expect(resolveAnimalSelection(values, 99)).toBe(1);
    expect(resolveAnimalSelection([], 2)).toBeUndefined();
  });

  it('limite le carnet médical aux soins et rendez-vous de l’animal en conservant l’événement source', () => {
    const events = [
      { id: 10, nom: 'Vaccin', dateevent: '2026-09-01', animaux: [1], eventtype: 'soins', documents: [{ name: 'vaccin.pdf' }] },
      { id: 11, nom: 'Véto', dateevent: '2026-10-01', animaux: [1], eventtype: 'rdv', documents: [{ name: 'radio.jpg' }] },
      { id: 12, nom: 'Balade', dateevent: '2026-10-01', animaux: [1], eventtype: 'balade', documents: [{ name: 'parc.jpg' }] },
      { id: 13, nom: 'Autre animal', dateevent: '2026-10-01', animaux: [2], eventtype: 'soins', documents: [{ name: 'autre.pdf' }] },
      { id: 14, idparent: 10, nom: 'Rappel vaccin', dateevent: '2027-09-01', animaux: [1], eventtype: 'soins', documents: [{ name: 'rappel.pdf' }] },
      { id: 15, nom: 'Soin privé', dateevent: '2026-11-01', animaux: [1], eventtype: 'soins', todisplay: false, documents: [{ name: 'prive.pdf' }] },
    ] as Event[];
    expect(getAnimalMedicalEvents(events, 1).map(({ id }) => id)).toEqual([10, 11]);
    expect(getAnimalMedicalDocuments(events, 1)).toEqual([
      { name: 'vaccin.pdf', eventId: 10, eventDate: '2026-09-01' },
      { name: 'radio.jpg', eventId: 11, eventDate: '2026-10-01' },
    ]);
  });
});
