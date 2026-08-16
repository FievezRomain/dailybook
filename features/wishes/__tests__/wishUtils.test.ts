import type { Wish } from '@models/Wish';

import { wishFormSchema } from '../../../business/validators/wish';
import { buildWishPayload, buildWishUpdatePayload, filterWishesByTab, getWishMetadata, getWishPriceLabel } from '../wishUtils';

const wishes: Wish[] = [
  { id: 1, nom: 'Nouveau licol', destinataire: 'Milo', acquis: false, prix: '89 €' },
  { id: 2, nom: 'Tapis', destinataire: '', acquis: true, prix: '95 €' },
];

describe('wishUtils', () => {
  it('filters planned and acquired wishes without inventing archived data', () => {
    expect(filterWishesByTab(wishes, 'planned')).toEqual([wishes[0]]);
    expect(filterWishesByTab(wishes, 'acquired')).toEqual([wishes[1]]);
    expect(filterWishesByTab(wishes, 'archived')).toEqual([]);
  });

  it('formats only metadata exposed by the backend', () => {
    expect(getWishPriceLabel(wishes[0])).toBe('Budget estimé · 89 €');
    expect(getWishPriceLabel(wishes[1])).toBe('Prix réalisé · 95 €');
    expect(getWishMetadata(wishes[0])).toBe('Milo');
    expect(getWishMetadata(wishes[1])).toBe('Pour moi');
  });

  it('omits blank optional fields and normalizes the decimal separator', () => {
    expect(buildWishPayload({ nom: '  Nouveau licol ', url: ' ', prix: ' 89,50 ', destinataire: '' })).toEqual({
      nom: 'Nouveau licol',
      url: undefined,
      prix: '89.50',
      destinataire: undefined,
    });
  });

  it('preserves production fields when updating a wish', () => {
    expect(buildWishUpdatePayload({ nom: 'Tapis bleu', url: '', prix: '', destinataire: '' }, wishes[1])).toEqual({
      id: 2,
      nom: 'Tapis bleu',
      url: undefined,
      prix: undefined,
      destinataire: undefined,
      acquis: true,
      image: undefined,
    });
  });

  it('accepts blank optional values and rejects malformed values', () => {
    expect(wishFormSchema.safeParse({ nom: 'Licol', url: '', prix: '', destinataire: '' }).success).toBe(true);
    expect(wishFormSchema.safeParse({ nom: 'Licol', url: 'seller', prix: '89 euros', destinataire: '' }).success).toBe(false);
  });
});