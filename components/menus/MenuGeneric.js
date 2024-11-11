import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';

const MenuGeneric = () => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
      <View
        style={{
          paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchorPosition='bottom'
          anchor={<Button onPress={openMenu}>Show menu</Button>}>
          <Menu.Item onPress={closeMenu} title="Item 1" />
          <Menu.Item onPress={closeMenu} title="Item 2" />
          <Divider />
          <Menu.Item onPress={closeMenu} title="Item 3" />
        </Menu>
      </View>
  );
};

export default MenuGeneric;