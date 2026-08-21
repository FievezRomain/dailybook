import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import type { Material } from "../../../../theme/materials";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { Card } from "./Card";
import { DomainBody, DomainCaption, DomainTitle } from "./DomainCardParts";
import { Icon } from "../icons";

export type WishStatus = "planned" | "completed";
export interface WishCardProps {
  title: string;
  description?: string;
  status: WishStatus;
  metadata?: string;
  priceLabel?: string;
  imageUrl?: string;
  imageAspectRatio?: number;
  material?: Material;
  onPress?: () => void;
  onMore?: () => void;
  testID?: string;
}
export function WishCard({
  title,
  description,
  status,
  metadata,
  priceLabel,
  imageUrl,
  imageAspectRatio = 1,
  material = "solid",
  onPress,
  onMore,
  testID,
}: WishCardProps) {
  const { colors } = useAppTheme();
  const label = status === "completed" ? "Réalisé" : "À organiser";
  return (
    <Card
      material={material}
      onPress={onPress}
      accessibilityLabel={`${title}, ${label}`}
      testID={testID}
      style={{ width: "100%", padding: 0, gap: 0 }}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: imageUrl
            ? Math.max(0.72, Math.min(1.35, imageAspectRatio))
            : 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surfaceVariant,
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl, cacheKey: imageUrl.split('?')[0] }}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityLabel={`Image de ${title}`}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Icon name="gift" size="xxl" color={colors.primaryDark} decorative />
        )}
        {priceLabel ? (
          <View
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              maxWidth: "88%",
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: colors.surface,
            }}
          >
            <DomainCaption numberOfLines={0} color={colors.primaryDark}>
              {priceLabel}
            </DomainCaption>
          </View>
        ) : null}
      </View>
      <View style={{ width: "100%", gap: 7, padding: 12 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <DomainTitle numberOfLines={0}>{title}</DomainTitle>
          </View>
        </View>
        {description ? (
          <DomainBody numberOfLines={0}>{description}</DomainBody>
        ) : null}
        {metadata || onMore ? (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              {metadata ? (
                <DomainCaption numberOfLines={0} color={colors.primaryDark}>
                  {metadata}
                </DomainCaption>
              ) : null}
            </View>
            {onMore ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Plus d’actions"
                onPress={onMore}
                hitSlop={10}
                style={{
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="moreHorizontal" size="md" color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </Card>
  );
}
