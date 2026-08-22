import { useRegistrationDraft } from '../../../features/auth/stores/useRegistrationDraft';

describe('useRegistrationDraft', () => {
  beforeEach(() => useRegistrationDraft.getState().reset());

  it('conserve l’identité entre les étapes', () => {
    useRegistrationDraft.getState().setIdentity({ firstName: 'Camille', email: 'camille@example.fr' });
    expect(useRegistrationDraft.getState()).toEqual(expect.objectContaining({ firstName: 'Camille', email: 'camille@example.fr' }));
  });

  it('efface le brouillon explicitement', () => {
    useRegistrationDraft.getState().setIdentity({ firstName: 'Camille', email: 'camille@example.fr' });
    useRegistrationDraft.getState().setSecurity({ password: 'MotDePasse!123', confirmation: 'MotDePasse!123' });
    useRegistrationDraft.getState().reset();
    expect(useRegistrationDraft.getState()).toEqual(expect.objectContaining({ firstName: '', email: '', password: '', confirmation: '' }));
  });

  it('conserve la sécurité lors d’un retour entre les étapes', () => {
    useRegistrationDraft.getState().setSecurity({ password: 'MotDePasse!123', confirmation: 'MotDePasse!123' });
    expect(useRegistrationDraft.getState()).toEqual(expect.objectContaining({ password: 'MotDePasse!123', confirmation: 'MotDePasse!123' }));
  });
});
