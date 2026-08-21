import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { componentTokens } from "../../../../theme/componentTokens";
import { alpha } from "../../../../theme/primitives";
import { radii, spacing, typography } from "../../../../theme/scales";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { Button } from "../actions";
import { TextField } from "../forms";
import { formatTimePart, wrapTimePart } from "./timeUtils";

export interface TimePickerProps {
  open: boolean;
  hour: number;
  minute: number;
  onChange: (value: { hour: number; minute: number }) => void;
  onConfirm: () => void;
  onClose: () => void;
  input?: "wheel" | "keyboard";
  testID?: string;
}
export function TimePicker({
  open,
  hour,
  minute,
  onChange,
  onConfirm,
  onClose,
  input = "wheel",
  testID,
}: TimePickerProps) {
  const { colors } = useAppTheme();
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.lg,
          backgroundColor: colors.overlay,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer le sélecteur d’heure"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <View
          accessibilityRole="summary"
          accessibilityLabel="Choisir l’heure"
          testID={testID}
          style={{
            width: "100%",
            maxWidth: componentTokens.picker.time.width,
            gap: 18,
            padding: 20,
            borderRadius: radii.modal,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            shadowColor: alpha.black16,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fonts.semiBold,
              fontSize: typography.sizes.lg,
              lineHeight: 24,
            }}
          >
            Choisir l’heure
          </Text>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fonts.bold,
              fontSize: typography.sizes.xxxl,
              lineHeight: 38,
              letterSpacing: -0.3,
              textAlign: "center",
            }}
          >
            {formatTimePart(hour)} : {formatTimePart(minute)}
          </Text>
          {input === "wheel" ? (
            <>
              <TimePartRow
                value={hour}
                max={23}
                onSelect={(value) => onChange({ hour: value, minute })}
              />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: typography.fonts.regular,
                  fontSize: typography.sizes.control,
                  lineHeight: 20,
                  textAlign: "center",
                }}
              >
                Heures 00 à 23 · minutes 00 à 59
              </Text>
              <TimePartRow
                value={minute}
                max={59}
                onSelect={(value) => onChange({ hour, minute: value })}
              />
            </>
          ) : (
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <TextField
                label="Heures"
                value={formatTimePart(hour)}
                keyboardType="number-pad"
                onChangeText={(value) =>
                  onChange({
                    hour: Math.min(23, Math.max(0, Number(value) || 0)),
                    minute,
                  })
                }
                containerStyle={{ flex: 1 }}
              />
              <TextField
                label="Minutes"
                value={formatTimePart(minute)}
                keyboardType="number-pad"
                onChangeText={(value) =>
                  onChange({
                    hour,
                    minute: Math.min(59, Math.max(0, Number(value) || 0)),
                  })
                }
                containerStyle={{ flex: 1 }}
              />
            </View>
          )}
          <Button label="Confirmer" fullWidth onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}
const TIME_ITEM_WIDTH = 52;
const TIME_ITEM_GAP = 8;
const TIME_ITEM_STEP = TIME_ITEM_WIDTH + TIME_ITEM_GAP;

function TimePartRow({
  value,
  max,
  onSelect,
}: {
  value: number;
  max: number;
  onSelect: (value: number) => void;
}) {
  const { colors } = useAppTheme();
  const listRef = useRef<FlatList<number>>(null);
  const scrollingRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const values = useMemo(
    () => Array.from({ length: max + 1 }, (_, index) => index),
    [max],
  );
  useEffect(() => {
    if (!viewportWidth || scrollingRef.current) return;
    listRef.current?.scrollToOffset({
      offset: value * TIME_ITEM_STEP,
      animated: false,
    });
  }, [max, value, viewportWidth]);
  const selectFromScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    momentum = false,
  ) => {
    const next = Math.min(
      max,
      Math.max(
        0,
        Math.round(event.nativeEvent.contentOffset.x / TIME_ITEM_STEP),
      ),
    );
    if (next !== value) onSelect(next);
    if (momentum || Math.abs(event.nativeEvent.velocity?.x ?? 0) < 0.01)
      scrollingRef.current = false;
  };
  const select = (next: number) => {
    onSelect(next);
    listRef.current?.scrollToOffset({
      offset: next * TIME_ITEM_STEP,
      animated: true,
    });
  };
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max, now: value }}
      accessibilityActions={[{ name: "decrement" }, { name: "increment" }]}
      onAccessibilityAction={({ nativeEvent }) =>
        select(
          wrapTimePart(
            value,
            nativeEvent.actionName === "increment" ? 1 : -1,
            max,
          ),
        )
      }
      onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
    >
      <FlatList
        ref={listRef}
        data={values}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        directionalLockEnabled
        snapToInterval={TIME_ITEM_STEP}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          gap: TIME_ITEM_GAP,
          paddingHorizontal: Math.max(0, (viewportWidth - TIME_ITEM_WIDTH) / 2),
        }}
        getItemLayout={(_, index) => ({
          length: TIME_ITEM_STEP,
          offset: TIME_ITEM_STEP * index,
          index,
        })}
        keyExtractor={(item) => String(item)}
        onScrollBeginDrag={() => {
          scrollingRef.current = true;
        }}
        onMomentumScrollBegin={() => {
          scrollingRef.current = true;
        }}
        onMomentumScrollEnd={(event) => selectFromScroll(event, true)}
        onScrollEndDrag={(event) => selectFromScroll(event)}
        renderItem={({ item }) => {
          const selected = item === value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={formatTimePart(item)}
              accessibilityState={{ selected }}
              onPress={() => select(item)}
              style={{
                width: TIME_ITEM_WIDTH,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: radii.pill,
                backgroundColor: selected
                  ? colors.primary
                  : colors.surfaceVariant,
              }}
            >
              <Text
                style={{
                  color: selected ? colors.textOnPrimary : colors.textPrimary,
                  fontFamily: typography.fonts.medium,
                  fontSize: typography.sizes.control,
                }}
              >
                {formatTimePart(item)}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
