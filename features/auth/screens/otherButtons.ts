import type { AppStackParamList } from '../../../navigation/types';
import type { Group } from '../../../models/Group';
import type { MaterialCommunityIconsName } from '../../../types/icons';

type BaseRouteName = 'Wish' | 'Contact' | 'Note';

export type BaseButtonItem = {
  id: string | number;
  icon: MaterialCommunityIconsName;
  label: string;
  screen: BaseRouteName;
  disabled?: false;
};

export type GroupButtonItem = {
  id: string;
  icon: MaterialCommunityIconsName;
  label: string;
  screen: 'GroupDetail';
  params: AppStackParamList['GroupDetail'];
  disabled?: false;
};

export type DisabledButtonItem = {
  id: string;
  icon: MaterialCommunityIconsName;
  label: string;
  disabled: true;
};

export type OtherButtonItem = BaseButtonItem | GroupButtonItem | DisabledButtonItem;

const BASE_BUTTONS: BaseButtonItem[] = [
  { id: 1, icon: 'heart', label: 'Wishlist', screen: 'Wish' },
  { id: 2, icon: 'contacts', label: 'Contacts', screen: 'Contact' },
  { id: 3, icon: 'note-edit-outline', label: 'Notes', screen: 'Note' },
];

export function buildOtherButtons(groups: Group[] | undefined, noGroupsLabel: string): OtherButtonItem[] {
  if (!groups) return BASE_BUTTONS;

  const groupButtons: OtherButtonItem[] =
    groups.length > 0
      ? groups.map((group) => ({
          id: `group-${group.id}`,
          icon: 'account-group',
          label: group.name,
          screen: 'GroupDetail',
          params: { groupId: String(group.id) },
        }))
      : [{ id: 'group-default', icon: 'account-group', label: noGroupsLabel, disabled: true }];

  return [...BASE_BUTTONS, ...groupButtons];
}
