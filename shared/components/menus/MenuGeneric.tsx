import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AppDivider } from '../ui';

interface MenuGenericItem {
  label: string;
  onPress: () => void;
}

interface MenuGenericProps {
  anchor?: React.ReactNode;
  items?: MenuGenericItem[];
}

const MenuGeneric: React.FC<MenuGenericProps> = ({ anchor, items = [] }) => {
  const { colors, fonts } = useAppTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        {anchor}
      </TouchableOpacity>
      <Modal transparent animationType="fade" visible={visible} statusBarTranslucent onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.menu, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {items.map((item, index) => (
              <View key={item.label}>
                {index > 0 && <AppDivider />}
                <TouchableOpacity
                  onPress={() => { setVisible(false); item.onPress(); }}
                  style={styles.item}
                >
                  <Text style={{ fontFamily: fonts.default.fontFamily, color: colors.textPrimary, fontSize: 15 }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 10,
    borderWidth: 0.5,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
});

export default MenuGeneric;
