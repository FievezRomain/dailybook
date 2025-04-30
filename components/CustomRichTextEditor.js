import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;

const CustomRichTextEditor = ({ onSave, initialContent = "" }) => {
    const { colors, fonts } = useTheme();
    const webviewRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState([]);

    const injectCommand = (command, value = null) => {
        const injected = value
            ? `document.execCommand("${command}", false, "${value}"); true;`
            : `document.execCommand("${command}", false, null); true;`;
        const syncFormatState = `window.postEditorState && window.postEditorState(); true;`;
        webviewRef.current?.injectJavaScript(injected + syncFormatState);
    };

    const promptForLink = () => {
        Alert.prompt(
            'Ajouter un lien',
            'Entrez l’URL du lien à insérer :',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Ajouter',
                    onPress: (url) => {
                        if (url && url.startsWith('http')) {
                            injectCommand('createLink', url);
                        }
                    }
                }
            ],
            'plain-text',
            'https://'
        );
    };

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.formatStates) {
                setActiveFormats(data.formatStates);
            } else if (typeof data === 'string') {
                onSave(data);
            }
        } catch (err) {
            onSave(event.nativeEvent.data);
        }
    };

    const handleLoadEnd = () => {
        if (initialContent) {
            const escapedContent = initialContent.replace(/'/g, "\\'").replace(/\n/g, "\\n");
            const script = `document.getElementById('editor').innerHTML = '${escapedContent}'; true;`;
            webviewRef.current.injectJavaScript(script);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: "100%"
        },
        toolbar: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 10,
            backgroundColor: colors.quaternary,
            borderBottomWidth: 1,
            alignItems: 'center',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        },
        button: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: colors.background,
            borderRadius: 5,
            marginRight: 8,
            marginBottom: 6
        },
        buttonActive: {
            backgroundColor: colors.primary,
        },
        buttonText: {
            fontWeight: 'bold',
            fontSize: 16,
            color: colors.default_dark
        },
        webview: {
            height: screenHeight * 0.5,
            backgroundColor: colors.quaternary,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5
        }
    });

    const FormatButton = ({ label, onPress, formatKey }) => {
        const isActive = activeFormats.includes(formatKey);
        return (
            <TouchableOpacity onPress={onPress} style={[styles.button, isActive && styles.buttonActive]}>
                <Text style={[styles.buttonText, isActive && { color: 'white' }]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const editorHTML = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-size: 18px; padding: 10px; font-family: -apple-system, sans-serif; }
                    #editor { min-height: 100%; outline: none; line-height: 1.5; padding-bottom: 50px; }
                    html, body {
                        height: 100%;
                        padding: 5;
                    }
                </style>
            </head>
            <body>
                <div id="editor" contenteditable="true"></div>
                <script>
                    const postUpdate = () => {
                        const editor = document.getElementById('editor');
                        const states = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
                        const formatStates = states.filter(f => document.queryCommandState(f));
                        const blockFormat = document.queryCommandValue('formatBlock');
                        if (blockFormat === 'h1') formatStates.push('h1');
                        else if (blockFormat === 'h2') formatStates.push('h2');
                        else if (blockFormat === 'p') formatStates.push('p');
                        ['justifyLeft','justifyCenter','justifyRight'].forEach(j => {
                          if (document.queryCommandState(j)) formatStates.push(j);
                        });
                        window.ReactNativeWebView.postMessage(JSON.stringify({ formatStates }));
                        window.ReactNativeWebView.postMessage(editor.innerHTML);
                    };
                    window.postEditorState = postUpdate;
                    editor.addEventListener('input', postUpdate);
                    document.addEventListener('selectionchange', postUpdate);
                    document.addEventListener('message', function(event) {
                        eval(event.data);
                    });
                    window.onload = function () {
                        document.getElementById('editor').focus();
                        window.scrollTo(0, 0);
                    };
                </script>
            </body>
        </html>
    `;

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <FormatButton label="B" onPress={() => injectCommand('bold')} formatKey="bold" />
                <FormatButton label="I" onPress={() => injectCommand('italic')} formatKey="italic" />
                <FormatButton label="U" onPress={() => injectCommand('underline')} formatKey="underline" />
                <FormatButton label="•" onPress={() => injectCommand('insertUnorderedList')} formatKey="insertUnorderedList" />
                <FormatButton label="1.2..." onPress={() => injectCommand('insertOrderedList')} formatKey="insertOrderedList" />
                <FormatButton label="Title1" onPress={() => injectCommand('formatBlock', 'h1')} formatKey="h1" />
                <FormatButton label="Title2" onPress={() => injectCommand('formatBlock', 'h2')} formatKey="h2" />
                <FormatButton label="P" onPress={() => injectCommand('formatBlock', 'p')} formatKey="p" />
                <FormatButton label="Left" onPress={() => injectCommand('justifyLeft')} formatKey="justifyLeft" />
                <FormatButton label="Center" onPress={() => injectCommand('justifyCenter')} formatKey="justifyCenter" />
                <FormatButton label="Right" onPress={() => injectCommand('justifyRight')} formatKey="justifyRight" />
                { Platform.OS == "ios" && <FormatButton label="🔗" onPress={promptForLink} /> }
            </View>

            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                onMessage={handleMessage}
                onLoadEnd={handleLoadEnd}
                style={styles.webview}
                javaScriptEnabled
                domStorageEnabled
                automaticallyAdjustContentInsets={false}
                keyboardDisplayRequiresUserAction={false}
                androidLayerType='hardware'
                source={{ html: editorHTML }}
            />
        </View>
    );
};

export default CustomRichTextEditor;
