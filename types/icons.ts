import type { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Re-export of the MaterialCommunityIcons name type for strict icon prop typing.
 */
export type MaterialCommunityIconsName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
