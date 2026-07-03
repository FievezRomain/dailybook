import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDivider } from '../ui';
import Back from './Back';
import { useAppTheme } from '../../../theme/useAppTheme';
import { fontSizes, fonts as fontTokens } from '../../../theme/tokens';

interface TopTabSecondaryProps {
  message1?: string;
  message2?: string;
  btnList?: React.ReactNode[];
}

const TopTabSecondary: React.FC<TopTabSecondaryProps> = ({ message1, message2, btnList }) => {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={20}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.container, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Back />
          {message2 ? (
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {message2}
            </Text>
          ) : null}
        </View>
        {btnList && btnList.length > 0 ? (
          <View style={styles.actions}>
            {btnList.map((node, i) => (
              <View key={i} style={{ marginLeft: 12 }}>{node}</View>
            ))}
          </View>
        ) : null}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fontTokens.semiBold,
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TopTabSecondary;
