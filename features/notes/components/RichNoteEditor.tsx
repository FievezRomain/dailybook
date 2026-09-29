import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { radii, spacing, typography } from "../../../theme/scales";
import { useAppTheme } from "../../../theme/useAppTheme";

const editorHtml = String.raw`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>html,body{margin:0;padding:0;background:transparent}#editor{min-height:190px;padding:14px;outline:none;font:16px/1.5 sans-serif;word-break:break-word}h1,h2,h3{margin:8px 0}ul,ol{padding-left:24px}</style></head><body><div id="editor" contenteditable="true" role="textbox" aria-multiline="true"></div><script>
const e=document.getElementById('editor');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/_([^_]+)_/g,'<em>$1</em>').replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:)[^)]+)\)/gi,'<a href="$2">$1</a>');
function setMarkdown(md){const rows=String(md||'').split(/\n/);let list=null,out='';for(const row of rows){let m;if((m=/^[-*] (.*)$/.exec(row))){if(list!=='ul'){if(list)out+='</'+list+'>';list='ul';out+='<ul>'}out+='<li>'+inline(m[1])+'</li>'}else if((m=/^\d+\. (.*)$/.exec(row))){if(list!=='ol'){if(list)out+='</'+list+'>';list='ol';out+='<ol>'}out+='<li>'+inline(m[1])+'</li>'}else{if(list){out+='</'+list+'>';list=null}if((m=/^(#{1,6}) (.*)$/.exec(row)))out+='<h'+m[1].length+'>'+inline(m[2])+'</h'+m[1].length+'>';else out+='<div>'+inline(row)+'</div>'}}if(list)out+='</'+list+'>';e.innerHTML=out}
function nodeMd(n){if(n.nodeType===3)return n.nodeValue||'';if(n.nodeType!==1)return '';const tag=n.tagName.toLowerCase();if(['script','style','iframe','object','embed','img'].includes(tag))return '';const body=[...n.childNodes].map(nodeMd).join('');if(tag==='strong'||tag==='b')return '**'+body+'**';if(tag==='em'||tag==='i')return '_'+body+'_';if(/^h[1-6]$/.test(tag))return '\n\n'+'#'.repeat(Number(tag[1]))+' '+body+'\n\n';if(tag==='br')return '\n';if(tag==='li')return body; if(tag==='ul')return '\n'+[...n.children].map(x=>'- '+nodeMd(x)).join('\n')+'\n';if(tag==='ol')return '\n'+[...n.children].map((x,i)=>(i+1)+'. '+nodeMd(x)).join('\n')+'\n';if(tag==='a'){const h=n.getAttribute('href')||'';return /^(https?:|mailto:|tel:)/i.test(h)?'['+body+']('+h+')':body}if(tag==='div'||tag==='p')return body+'\n';return body}
function emit(){const markdown=nodeMd(e).replace(/\n{3,}/g,'\n\n').trim();window.ReactNativeWebView.postMessage(JSON.stringify({type:'change',markdown}))}e.addEventListener('input',emit);window.editor={setMarkdown,command:(name,value)=>{e.focus();document.execCommand(name,false,value||null);emit()}};</script></body></html>`;

export interface RichNoteEditorHandle { flush: () => void }

export const RichNoteEditor = forwardRef<RichNoteEditorHandle, {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  disabled?: boolean;
}>(function RichNoteEditor({
  value,
  onChange,
  errorMessage,
  disabled = false,
}, forwardedRef) {
  const { colors } = useAppTheme();
  const webRef = useRef<WebView>(null);
  const ready = useRef(false);
  const latestValue = useRef(value);
  const lastEditorValue = useRef(value);
  latestValue.current = value;
  useEffect(() => {
    if (ready.current && value !== lastEditorValue.current) {
      webRef.current?.injectJavaScript(
        `window.editor.setMarkdown(${JSON.stringify(value)});true;`,
      );
      lastEditorValue.current = value;
    }
  }, [value]);
  useEffect(() => {
    if (disabled)
      webRef.current?.injectJavaScript(
        `document.getElementById('editor').contentEditable='false';true;`,
      );
  }, [disabled]);
  const command = (name: string, commandValue?: string) =>
    webRef.current?.injectJavaScript(
      `window.editor.command(${JSON.stringify(name)},${JSON.stringify(commandValue ?? null)});true;`,
    );
  useImperativeHandle(forwardedRef, () => ({
    flush: () => webRef.current?.injectJavaScript('emit();true;'),
  }), []);
  const receive = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        markdown?: string;
      };
      if (message.type === "change" && typeof message.markdown === "string") {
        lastEditorValue.current = message.markdown;
        onChange(message.markdown);
      }
    } catch {
      /* Ignore non-editor messages. */
    }
  };
  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          color: colors.textPrimary,
          fontFamily: typography.fonts.semiBold,
          fontSize: typography.sizes.sm,
        }}
      >
        Contenu
      </Text>
      <View
        accessibilityRole="toolbar"
        accessibilityLabel="Mise en forme de la note"
        style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}
      >
        {[
          ["B", "Gras", "bold"],
          ["I", "Italique", "italic"],
          ["Titre", "Titre", "formatBlock", "h2"],
          ["• Liste", "Liste à puces", "insertUnorderedList"],
          ["1. Liste", "Liste numérotée", "insertOrderedList"],
        ].map(([label, accessibilityLabel, name, commandValue]) => (
          <Pressable
            key={accessibilityLabel}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            disabled={disabled}
            onPress={() => command(name, commandValue)}
            style={({ pressed }) => ({
              minHeight: 44,
              minWidth: 44,
              paddingHorizontal: spacing.sm,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radii.md,
              backgroundColor: pressed
                ? colors.surfaceDim
                : colors.surfaceVariant,
              opacity: disabled ? 0.5 : 1,
            })}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily:
                  label === "B"
                    ? typography.fonts.bold
                    : typography.fonts.medium,
                fontStyle: label === "I" ? "italic" : "normal",
              }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View
        style={{
          height: 220,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: errorMessage ? colors.error : colors.border,
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
        }}
      >
        <WebView
          ref={webRef}
          source={{ html: editorHtml }}
          originWhitelist={["about:*"]}
          javaScriptEnabled
          javaScriptCanOpenWindowsAutomatically={false}
          domStorageEnabled={false}
          allowFileAccess={false}
          allowUniversalAccessFromFileURLs={false}
          mixedContentMode="never"
          onMessage={receive}
          onShouldStartLoadWithRequest={(request) =>
            request.url.startsWith("about:")
          }
          onLoadEnd={() => {
            ready.current = true;
            lastEditorValue.current = latestValue.current;
            webRef.current?.injectJavaScript(
              `window.editor.setMarkdown(${JSON.stringify(latestValue.current)});true;`,
            );
          }}
          style={{ backgroundColor: "transparent" }}
          scrollEnabled
        />
      </View>
      {errorMessage ? (
        <Text
          accessibilityRole="alert"
          style={{
            color: colors.error,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.xs,
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: typography.fonts.regular,
          fontSize: typography.sizes.xs,
        }}
      >
        {value.length}/500
      </Text>
    </View>
  );
});
