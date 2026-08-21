import type { Animal } from '../../../models/Animal';
import { AxiosError } from 'axios';
import { animalFormFingerprint, animalToWizardForm, apiDate, buildAnimalPayload, buildAnimalUpdatePayload, buildChangedAnimalHistory, formDateLabel, getAnimalSaveError, isAnimalBodyValid, isAnimalProfileValid } from '../../../features/animals/animalFormUtils';

describe('animalFormUtils', () => {
  it('normalizes API dates and numeric values for creation', () => {
    expect(buildAnimalPayload({ nom: ' Milo ', espece: ' Chien ', datenaissance: '12/04/2021', poids: '12,5', quantity: '250' })).toMatchObject({ nom: 'Milo', espece: 'Chien', datenaissance: '2021-04-12', poids: 12.5, quantity: 250 });
    expect(apiDate('2026-08-02')).toBe('2026-08-02');
    expect(formDateLabel('2026-08-02')).toBe('02/08/2026');
  });

  it('prefills all editable values and keeps the update id', () => {
    const animal = { id: 7, nom: 'Milo', espece: 'Chien', datenaissance: '12/04/2021', datearrivee: '02/08/2022', food: 'Croquettes', quantity: 250, unity: 'g', informations: 'Calme' } as Animal;
    const form = animalToWizardForm(animal);
    expect(form).toMatchObject({ nom: 'Milo', datenaissance: '2021-04-12', datearrivee: '2022-08-02', food: 'Croquettes', quantity: '250', unity: 'g', informations: 'Calme' });
    expect(buildAnimalUpdatePayload({ ...form, datenaissance: '2022-05-13' }, 7)).toMatchObject({ id: 7, datenaissance: '2022-05-13', datearrivee: '2022-08-02' });
  });

  it('validates only required profile and entered numeric values', () => {
    expect(isAnimalProfileValid({ nom: 'Milo', espece: 'Chien' })).toBe(true);
    expect(isAnimalProfileValid({ nom: 'Milo' })).toBe(false);
    expect(isAnimalBodyValid({ poids: '12,5', taille: '', quantity: '250' })).toBe(true);
    expect(isAnimalBodyValid({ poids: 'douze' })).toBe(false);
  });

  it('detects semantic dirtiness independently of key order and blank values', () => {
    expect(animalFormFingerprint({ nom: 'Milo', race: '' })).toBe(animalFormFingerprint({ nom: ' Milo ' }));
  });

  it('creates history entries only for changed physical values', () => {
    const animal = { id: 7, nom: 'Milo', espece: 'Chien', poids: 12.5, taille: 42, food: 'Croquettes', quantity: 200, unity: 'g' } as Animal;
    expect(buildChangedAnimalHistory({ poids: '12,5', taille: '44', food: 'Pâtée', quantity: '200', unity: 'g' }, animal, '2026-08-10')).toEqual([
      { idAnimal: 7, item: 'taille', value: 44, unity: undefined, datemodification: '2026-08-10' },
      { idAnimal: 7, item: 'food', value: 'Pâtée', unity: undefined, datemodification: '2026-08-10' },
    ]);
  });

  it('records a quantity history entry when only its unit changes', () => {
    const animal = { id: 7, nom: 'Milo', espece: 'Chien', quantity: 250, unity: 'g' } as Animal;
    expect(buildChangedAnimalHistory({ quantity: '250', unity: 'kg' }, animal, '2026-08-10')).toEqual([
      { idAnimal: 7, item: 'quantity', value: 250, unity: 'kg', datemodification: '2026-08-10' },
    ]);
  });

  it('distinguishes timeout, 404 and server errors while preserving actionable copy', () => {
    const timeout = new AxiosError('timeout', 'ECONNABORTED');
    const notFound = new AxiosError('missing', undefined, undefined, undefined, { status: 404, statusText: 'Not Found', headers: {}, config: {} as never, data: undefined });
    const server = new AxiosError('server', undefined, undefined, undefined, { status: 500, statusText: 'Server Error', headers: {}, config: {} as never, data: undefined });
    expect(getAnimalSaveError(timeout, 'create').title).toBe('Connexion interrompue');
    expect(getAnimalSaveError(notFound, 'edit').title).toBe('Animal introuvable');
    expect(getAnimalSaveError(server, 'create')).toEqual({ title: 'Enregistrement impossible', message: 'Le serveur a rencontré un problème. Vos informations sont conservées.' });
  });
});
