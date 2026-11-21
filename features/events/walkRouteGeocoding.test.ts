import { geocodeWalkRouteStartAddress } from './walkRouteGeocoding';

describe('walk route start geocoding', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses the normalized IGN label and coordinates', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      features: [{
        geometry: { coordinates: [2.398, 47.083] },
        properties: { label: '12 Rue de la Mairie 18000 Bourges' },
      }],
    }), { status: 200 }));

    await expect(geocodeWalkRouteStartAddress(' 12 rue de la Mairie, Bourges ')).resolves.toEqual({
      latitude: 47.083,
      longitude: 2.398,
      label: '12 Rue de la Mairie 18000 Bourges',
    });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=12+rue+de+la+Mairie%2C+Bourges'));
  });

  it('rejects an address that IGN cannot locate', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ features: [] }), { status: 200 }));
    await expect(geocodeWalkRouteStartAddress('Adresse inconnue')).rejects.toThrow('IGN_ADDRESS_NOT_FOUND');
  });
});
