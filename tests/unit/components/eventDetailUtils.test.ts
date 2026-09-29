import { getEventDetailRows } from '../../../features/events/eventDetailUtils';
import type { Event } from '../../../models/Event';

describe('event detail information', () => {
  it('shows every valued business field and omits empty values', () => {
    const event = {
      id: 7,
      nom: 'Concours régional',
      dateevent: '2026-08-22',
      heuredebutevent: '09:30',
      animaux: [1],
      eventtype: 'concours',
      state: 'completed',
      lieu: 'Namur',
      discipline: 'Agility',
      epreuve: 'Club 1',
      dossart: '24',
      placement: '2e',
      note: 4,
      depense: 35.5,
      shared_groups: [{ id: 3, name: 'Écurie' }],
      documents: [{ name: 'resultats.pdf' }],
      created_by: { id: '2', name: 'Alice', email: 'alice@example.com' },
      commentaire: 'Très bon parcours',
    } as Event;

    const rows = getEventDetailRows(event, ['Vasco']);
    expect(Object.fromEntries(rows.map((row) => [row.label, row.value]))).toMatchObject({
      Type: 'Concours',
      État: 'Terminé',
      Animaux: 'Vasco',
      Discipline: 'Agility',
      Épreuve: 'Club 1',
      Dossard: '24',
      Classement: '2e',
      Note: '★★★★☆ · 4/5',
      Dépense: '35,50 €',
      'Partagé avec': 'Écurie',
      Documents: 'resultats.pdf',
      'Créé par': 'Alice',
      Description: 'Très bon parcours',
    });
    expect(rows.some((row) => row.label === 'Spécialiste')).toBe(false);
  });

  it('hides residual values that are not available in the event type form', () => {
    const event = {
      id: 8,
      nom: 'Soin',
      dateevent: '2026-08-22',
      animaux: [1],
      eventtype: 'soins',
      note: 5,
      placement: '1er',
      specialiste: 'Dr Martin',
      categoriedepense: 'formation',
      traitement: 'Pommade',
      depense: 12,
    } as Event;
    const labels = getEventDetailRows(event, ['Vasco']).map((row) => row.label);
    expect(labels).toContain('Traitement');
    expect(labels).toContain('Dépense');
    expect(labels).not.toContain('Note');
    expect(labels).not.toContain('Classement');
    expect(labels).not.toContain('Spécialiste');
    expect(labels).not.toContain('Catégorie de dépense');
  });

  it('calcule la durée d’une balade à partir de ses heures de début et de fin', () => {
    const event = {
      id: 9,
      nom: 'Balade en forêt',
      dateevent: '2026-08-22',
      heuredebutevent: '09:15',
      datefinbalade: '2026-08-22',
      heurefinbalade: '11:00',
      animaux: [1],
      eventtype: 'balade',
    } as Event;

    expect(Object.fromEntries(getEventDetailRows(event, ['Vasco']).map((row) => [row.label, row.value]))).toMatchObject({
      'Fin de la balade': '22 août 2026 · 11 h 00',
      'Durée de la balade': '1 h 45 min',
    });
  });
});
