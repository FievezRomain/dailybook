import { buildOtherButtons } from '../otherButtons';
import type { Group } from '../../../../models/Group';

const baseLabels = ['Wishlist', 'Contacts', 'Notes'];

describe('buildOtherButtons', () => {
  it('keeps base shortcuts available while groups are not loaded', () => {
    const buttons = buildOtherButtons(undefined, 'Vos groupes apparaitront ici');

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.label)).toEqual(baseLabels);
  });

  it('adds a disabled groups placeholder when no group exists', () => {
    const buttons = buildOtherButtons([], 'Vos groupes apparaitront ici');

    expect(buttons.map((button) => button.label)).toEqual([...baseLabels, 'Vos groupes apparaitront ici']);
    expect(buttons[3]).toMatchObject({ id: 'group-default', disabled: true });
  });

  it('adds typed navigation params for each group', () => {
    const groups: Group[] = [
      { id: 42, name: 'Ecurie du Soleil', members: [], animals: [] },
    ];

    const buttons = buildOtherButtons(groups, 'Vos groupes apparaitront ici');

    expect(buttons[3]).toMatchObject({
      id: 'group-42',
      label: 'Ecurie du Soleil',
      screen: 'GroupDetail',
      params: { groupId: '42' },
    });
  });
});
