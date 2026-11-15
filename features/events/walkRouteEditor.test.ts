import { buildDraftRoutePoints, removeDraftWaypoint } from './walkRouteEditor';

const start = { latitude: 46.77, longitude: 2.72 };
const first = { latitude: 46.78, longitude: 2.73 };
const second = { latitude: 46.79, longitude: 2.74 };

describe('walkRouteEditor', () => {
  it('conserve tous les marqueurs dans leur ordre et referme une boucle', () => {
    expect(buildDraftRoutePoints(start, [first, second], 'loop')).toEqual([start, first, second, start]);
  });

  it('ne referme pas un aller simple', () => {
    expect(buildDraftRoutePoints(start, [first, second], 'one_way')).toEqual([start, first, second]);
  });

  it('retire uniquement le marqueur sélectionné', () => {
    expect(removeDraftWaypoint([first, second], 0)).toEqual([second]);
  });
});
