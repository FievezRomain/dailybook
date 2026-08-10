import { buildEventCreationPayload, buildEventUpdatePayload, eventToDuplicateWizardForm, eventToWizardForm, formatEventCreationSummary, formatEventShareMessage, getReminderLabel } from '../../../features/events/eventCreationUtils';
import type { Event } from '../../../models/Event';

describe('event creation payload', () => {
  it('maps wizard data to the backend contract', () => {
    const payload = buildEventCreationPayload({ eventType: 'depense', nom: ' Croquettes ', dateevent: '2026-08-09', animaux: [1], depense: '24,50', categoriedepense: 'alimentation', notif: 'JourJ', optionnotif: '30m' });
    expect(payload).toMatchObject({ eventtype: 'depense', nom: 'Croquettes', dateevent: '2026-08-09', animaux: [1], depense: 24.5, categoriedepense: 'alimentation', notif: 'JourJ', optionnotif: '30 minutes avant' });
  });

  it('uses a safe fallback name for optional titles', () => {
    expect(buildEventCreationPayload({ eventType: 'rdv', dateevent: '2026-08-09', animaux: [2] }).nom).toBe('Rendez-vous');
  });

  it('formats reminder and summary labels', () => {
    expect(getReminderLabel('1h')).toBe('1 heure avant');
    expect(formatEventCreationSummary({ eventType: 'soins', nom: 'Vaccin', dateevent: '2026-08-09' })).toContain('Vaccin · 9 août');
  });

  it('hydrates an existing event and preserves backend fields when updating it', () => {
    const event = {
      id: 7,
      eventtype: 'soins',
      nom: 'Vaccin annuel',
      dateevent: '2026-08-09',
      animaux: [1, 2],
      traitement: 'Vaccin',
      state: 'completed',
      idparent: 3,
      frequencetype: 'year',
      frequencevalue: '1',
    } as Event;

    const form = eventToWizardForm(event);

    expect(form).toMatchObject({ eventType: 'soins', traitement: 'Vaccin', animaux: [1, 2], state: 'completed', idparent: 3 });
    expect(buildEventUpdatePayload(form, event.id)).toMatchObject({ id: 7, eventtype: 'soins', traitement: 'Vaccin', state: 'completed', idparent: 3, frequencetype: 'year', frequencevalue: '1' });
  });

  it('creates an independent editable copy without inherited sharing or completion', () => {
    const event = { id: 8, eventtype: 'autre', nom: 'Vermifuge', dateevent: '2026-08-10', animaux: [2], state: 'completed', idparent: 4, shared_groups: [9] } as Event;
    const copy = eventToDuplicateWizardForm(event);

    expect(copy).toMatchObject({ eventType: 'autre', nom: 'Copie de Vermifuge', state: 'pending', animaux: [2] });
    expect(copy.idparent).toBeUndefined();
    expect(copy.shared_groups).toBeUndefined();
  });

  it('formats a concise message for the native share sheet', () => {
    const event = { id: 9, eventtype: 'rdv', nom: 'Dentiste', dateevent: '2026-08-12', heuredebutevent: '14:30', animaux: [1] } as Event;
    expect(formatEventShareMessage(event, ['Vasco'])).toBe('Dentiste · 12 août 2026 à 14:30 — Vasco');
  });
});
