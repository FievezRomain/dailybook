import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { componentTokens } from "../../../../theme/componentTokens";
import { radii, typography } from "../../../../theme/scales";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { Icon } from "../icons";

export interface AnimalSelectorItemProps {
  name: string;
  imageUrl?: string | null;
  selected: boolean;
  onPress: () => void;
  selectionRole?: "checkbox" | "radio";
  selectionOrder?: number;
  disabled?: boolean;
  sharedFromGroup?: boolean;
  testID?: string;
}

export function AnimalSelectorItem({
  name,
  imageUrl,
  selected,
  onPress,
  selectionRole = "checkbox",
  selectionOrder,
  disabled = false,
  sharedFromGroup = false,
  testID,
}: AnimalSelectorItemProps) {
  const { colors } = useAppTheme();
  const metrics = componentTokens.content.animalSelector;
  const initial = name.trim().charAt(0).toLocaleUpperCase("fr-FR") || "?";
  const picture = (
    <View
      style={{
        width: metrics.imageSize,
        height: metrics.imageSize,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radii.full,
        backgroundColor: colors.surfaceVariant,
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityElementsHidden
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Text
          accessibilityElementsHidden
          style={{
            color: colors.primaryDark,
            fontFamily: typography.fonts.bold,
            fontSize: typography.sizes.xxl,
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
  const ring = selected ? (
    <LinearGradient
      colors={[colors.primaryLight, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: metrics.ringSize,
        height: metrics.ringSize,
        padding: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radii.full,
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radii.full,
          backgroundColor: colors.surface,
        }}
      >
        {picture}
      </View>
    </LinearGradient>
  ) : (
    <View
      style={{
        width: metrics.ringSize,
        height: metrics.ringSize,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radii.full,
        backgroundColor: colors.surfaceVariant,
      }}
    >
      {picture}
    </View>
  );
  const label = `${selectionOrder ? `${name}, sélection ${selectionOrder}` : name}${sharedFromGroup ? ", partagé via un groupe" : ""}`;
  return (
    <Pressable
      accessibilityRole={selectionRole}
      accessibilityLabel={label}
      accessibilityState={{ selected, checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => ({
        width: metrics.width,
        height: metrics.height,
        alignItems: "center",
        gap: 10,
        opacity: disabled ? 0.45 : pressed ? 0.84 : 1,
      })}
    >
      <View>
        {ring}
        {selected && selectionOrder ? (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 22,
              height: 22,
              paddingHorizontal: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radii.full,
              backgroundColor: colors.primaryDark,
            }}
          >
            <Text
              style={{
                color: colors.textOnPrimary,
                fontFamily: typography.fonts.bold,
                fontSize: typography.sizes.xs,
              }}
            >
              {selectionOrder}
            </Text>
          </View>
        ) : null}
        {sharedFromGroup ? (
          <View
            accessibilityElementsHidden
            style={{
              position: "absolute",
              right: -3,
              bottom: -1,
              width: 22,
              height: 22,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radii.full,
              borderWidth: 2,
              borderColor: colors.surface,
              backgroundColor: colors.primaryDark,
            }}
          >
            <Icon name="group" size="sm" color={colors.textOnPrimary} />
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          width: metrics.width,
          height: 20,
          color: colors.textPrimary,
          fontFamily: typography.fonts.medium,
          fontSize: typography.sizes.control,
          lineHeight: 20,
          letterSpacing: 0.1,
          textAlign: "center",
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
}
