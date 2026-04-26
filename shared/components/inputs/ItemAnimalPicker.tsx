import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useAuthStore } from '../../../stores/useAuthStore';
import { getFileUrl } from '../../../services/aws/FileStorageService';

interface AnimalItem {
  id: number | string;
  nom: string;
  image?: string | null;
  provenance?: string;
}

interface ItemAnimalPickerProps {
  isSelected: boolean;
  showBadge: boolean;
  item: AnimalItem;
  selectedIndex: number;
}

const ItemAnimalPicker: React.FC<ItemAnimalPickerProps> = ({
  isSelected,
  showBadge,
  item,
  selectedIndex,
}) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.image && item.id !== 'select_all') {
      getFileUrl(item.image, 'animal', String(item.id))
        .then((url) => setImageUrl(url))
        .catch(() => {});
    }
  }, [item.image, item.id]);

  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { stiffness: 150, damping: 20 });
    opacity.value = withSpring(1, { stiffness: 150, damping: 20 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const truncateAnimalName = (name: string): string => {
    if (name.length <= 15) {
      return name;
    }
    const truncated = name.slice(0, 15);
    const lastSpaceIndex = truncated.indexOf(' ');
    if (lastSpaceIndex !== -1) {
      return truncated.slice(0, lastSpaceIndex);
    }
    return truncated + '...';
  };

  const styles = StyleSheet.create({
    containerAvatar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      marginLeft: 5,
    },
    avatar: { width: 60, height: 60, borderRadius: 50, zIndex: 1, justifyContent: 'center' },
    containerAvatarWithoutImage: {
      height: 65,
      width: 65,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerWithGradient: {
      width: 70,
      height: 70,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerAvatarWithImage: {
      width: 65,
      height: 65,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { textAlign: 'center', color: colors.background, fontSize: 30 },
    badge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: colors.accent,
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    badgeText: { color: colors.background, fontSize: 10 },
    defaultText: { color: colors.quaternary },
    selectedText: { color: colors.accent },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    iconGroup: {
      position: 'absolute',
      bottom: 12,
      right: -5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Animated.View style={[styles.containerAvatar, { position: 'relative' }, animatedStyle]}>
      {item.image !== null ? (
        <LinearGradient
          colors={isSelected ? [colors.accent, colors.tertiary] : ['transparent', 'transparent']}
          style={styles.containerWithGradient}
          start={{ x: 0.2, y: 0 }}
        >
          <View
            style={[
              styles.containerAvatarWithImage,
              isSelected ? { backgroundColor: colors.background } : { backgroundColor: 'transparent' },
            ]}
          >
            {imageUrl ? (
              <Image style={styles.avatar} source={{ uri: imageUrl }} />
            ) : null}
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={isSelected ? [colors.accent, colors.quaternary] : ['transparent', 'transparent']}
          style={styles.containerWithGradient}
          start={{ x: 0.2, y: 0 }}
        >
          <View
            style={[
              styles.containerAvatarWithoutImage,
              isSelected ? { backgroundColor: colors.background } : { backgroundColor: 'transparent' },
            ]}
          >
            <View
              style={[
                styles.avatar,
                isSelected
                  ? { backgroundColor: colors.default_dark }
                  : { backgroundColor: colors.quaternary },
              ]}
            >
              <Text style={[styles.avatarText, styles.textFontRegular]}>
                {item.id === 'select_all' ? '+' : item.nom[0]}
              </Text>
            </View>
          </View>
        </LinearGradient>
      )}
      {showBadge && (
        <View style={styles.badge}>
          <Text style={[styles.badgeText, styles.textFontBold]}>{selectedIndex + 1}</Text>
        </View>
      )}
      {item.provenance === 'group' && (
        <View style={styles.iconGroup}>
          <FontAwesome
            name={'group'}
            color={isSelected ? colors.accent : colors.quaternary}
            size={15}
          />
        </View>
      )}
      <Text style={[isSelected ? styles.selectedText : styles.defaultText, styles.textFontRegular]}>
        {truncateAnimalName(item.nom)}
      </Text>
    </Animated.View>
  );
};

export default ItemAnimalPicker;
