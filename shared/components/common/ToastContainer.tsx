import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
});

const ToastContainer = forwardRef<View>((props, ref) => {
  return (
    <View style={styles.toastContainer} ref={ref}>
      <Toast />
    </View>
  );
});

export default ToastContainer;
