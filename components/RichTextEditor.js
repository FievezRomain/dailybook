import React, { useImperativeHandle, forwardRef }from 'react';
import { View, Text } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import sanitizeHtml from 'sanitize-html';
import { useTheme } from 'react-native-paper';

const RichTextEditor = forwardRef(({ defaultValue, onChange }, ref) => {
  const { colors, fonts } = useTheme();
  const richText = React.useRef();

  // Expose the dismissKeyboard method to the parent via ref
  useImperativeHandle(ref, () => ({
    dismissKeyboard() {
        if (richText.current) {
            richText.current.blurContentEditor(); // This will simulate closing the keyboard
        }
    }
  }));

  
  const handleChange = (html) => {
    onChange(html);  // Appelle la fonction de changement avec le HTML 
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, borderRadius: 5, overflow: 'hidden'}}>
        <RichEditor
          ref={richText}
          editorStyle={{backgroundColor: colors.quaternary, borderRadius: 5}}
          initialContentHTML={defaultValue}
          onChange={handleChange}
          placeholder='Votre texte ici'
        />
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.keyboard,
            actions.setStrikethrough,
            actions.setUnderline,
            actions.undo,
            actions.redo
          ]}
          selectedIconTint={colors.tertiary}
        />
      </View>
    </View>
  );
})

export default RichTextEditor;
