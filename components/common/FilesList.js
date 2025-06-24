import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const FilesList = ({ files, onMarkDelete }) => {
  const { colors, fonts } = useTheme();
  const visibleFiles = files.filter(doc => !doc.toDelete);

  const styles = StyleSheet.create({
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.quaternary,
      marginVertical: 4,
      padding: 10,
      borderRadius: 6,
      width: "100%"
    },
    fileName: {
      marginRight: 10,
      width: "90%",
      fontFamily: fonts.default.fontFamily
    },
  });

  return (
    <FlatList
      data={visibleFiles}
      keyExtractor={(item, index) => index}
      scrollEnabled={false}
      style={{marginBottom: 10}}
      renderItem={({ item, index }) => (
        <View style={styles.fileItem}>
          <Text style={styles.fileName}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => onMarkDelete(item.name)}>
            <MaterialIcons name="close" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};



export default FilesList;
