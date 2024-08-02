import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast } from "react-native-toast-message/lib/src/Toast";

// Style pour positionner les toasts au-dessus de la modal
const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0, // ou ajustez la position en fonction de la hauteur de la modal
    zIndex: 9999, // Assure que les toasts sont au-dessus de la modal
  },
});

// Composant ToastContainer avec React.forwardRef
const ToastContainer = forwardRef((props, ref) => {
  return (
    <View style={styles.toastContainer} ref={ref}>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
});

export default ToastContainer;
