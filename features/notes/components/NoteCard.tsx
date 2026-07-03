import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ModalSubMenuNoteActions from './ModalSubMenuNoteActions';
import ModalNote from './ModalNote';
import Toast from 'react-native-toast-message';
import { deleteNote } from '../../../services/api/NoteService';
import LoggerService from '../../../services/logs/LoggerService';
// @ts-ignore - react-native-htmlview has no type declarations
import HTMLView from 'react-native-htmlview';
import { useAppTheme } from '../../../theme/useAppTheme';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';

const NoteCard = ({
  note,
  handleNoteChange,
  handleNoteDelete,
}: {
  note: any;
  handleNoteChange: (note: any) => void;
  handleNoteDelete: (note: any) => void;
}) => {
  const { colors, fonts } = useAppTheme();
  const [focus, setFocus] = useState(false);
  const [modalSubMenuNoteVisible, setModalSubMenuNoteVisible] = useState(false);
  const [modalNote, setModaleNote] = useState(false);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  const handleDelete = () => setModalValidationDeleteVisible(true);

  const confirmDelete = () => {
    deleteNote(note.id)
      .then(() => {
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'une note réussie" });
        handleNoteDelete(note);
      })
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de la suppression d'une note : " + err.message);
      });
  };

  const onPressOptions = () => setModalSubMenuNoteVisible(true);
  const handleModify = () => setModaleNote(true);

  const onModify = (noteModified: any) => {
    setTimeout(
      () => Toast.show({ type: 'success', position: 'top', text1: "Modification d'une note" }),
      300,
    );
    handleNoteChange(noteModified);
  };

  const getPreviewHTML = (htmlContent: string, length: number): string => {
    if (!htmlContent) return '';
    let plainText = htmlContent
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<div>/gi, '')
      .replace(/<\/div>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const trimmedText = plainText.substring(0, length);
    return trimmedText.length >= length ? `${trimmedText}...` : trimmedText;
  };

  const htmlStyles = {
    p: { fontSize: 14 },
    a: { fontWeight: 'bold' },
  } as const;

  const styles = {
    card: {
      flexDirection: 'column',
      width: '100%',
      marginBottom: 10,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
      padding: 5,
    },
    header: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceVariant,
      padding: 10,
      justifyContent: 'space-between',
      borderTopEndRadius: 5,
      borderTopStartRadius: 5,
    },
    icons: { flexDirection: 'row' },
    content: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      padding: 5,
      borderBottomEndRadius: 5,
      borderBottomStartRadius: 5,
    },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  } as const;

  return (
    <>
      <ModalSubMenuNoteActions
        note={note}
        setModalVisible={setModalSubMenuNoteVisible}
        modalVisible={modalSubMenuNoteVisible}
        handleModify={handleModify}
        handleDelete={handleDelete}
      />
      <ModalNote
        actionType="modify"
        isVisible={modalNote}
        setVisible={setModaleNote}
        note={note}
        onModify={onModify}
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer la note ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'une note"
      />
      <TouchableOpacity style={styles.card} onPress={() => setFocus(!focus)}>
        <View style={styles.header}>
          <Text style={styles.textFontBold}>{note.titre}</Text>
          <View style={styles.icons}>
            {focus ? (
              <Ionicons name="chevron-up" size={20} color={colors.textPrimary} />
            ) : (
              <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
            )}
            <TouchableOpacity onPress={onPressOptions}>
              <Entypo name="dots-three-horizontal" size={20} color={colors.textPrimary} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          {focus ? (
            <HTMLView value={note.note} stylesheet={htmlStyles} />
          ) : (
            <HTMLView value={getPreviewHTML(note.note, 33)} stylesheet={htmlStyles} />
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default NoteCard;
