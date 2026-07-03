import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { getFileUrl } from '../../../../services/aws/FileStorageService';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { BaladeEvent } from '../../../../models/Event';
import { Animal } from '../../../../models/Animal';

const AnimalAvatar = ({
  animal,
  avatarStyle,
  avatarTextStyle,
  textFontRegular,
}: {
  animal: Animal;
  avatarStyle: object;
  avatarTextStyle: object;
  textFontRegular: object;
}) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (animal.image) {
      getFileUrl(animal.image, 'animal', String(animal.id))
        .then((u) => setUrl(u))
        .catch(() => {});
    }
  }, [animal.image, animal.id]);
  return url ? (
    <Image style={avatarStyle} source={{ uri: url }} cachePolicy="disk" />
  ) : (
    <Text style={[avatarTextStyle, textFontRegular]}>{animal.nom?.[0] ?? '?'}</Text>
  );
};

const BaladeCard = ({
  eventInfos,
  animaux,
  setSubMenu,
}: {
  eventInfos: BaladeEvent;
  animaux: Animal[];
  setSubMenu: (v: boolean) => void;
}) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();

  const styles = {
    eventTextContainer: { flexDirection: 'column' },
    eventTitle: { marginBottom: 10, fontSize: 16 },
    avatarText: { color: colors.background, textAlign: 'center' },
    avatar: { width: 20, height: 20, borderRadius: 10, zIndex: 1, justifyContent: 'center' },
    headerEventContainer: { flexDirection: 'row' },
    titleAndAnimalsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    contentEventContainer: { flexDirection: 'column', justifyContent: 'space-between', flexWrap: 'wrap' },
    eventCommentaire: { fontSize: 14 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    text: { color: colors.textPrimary },
  } as const;

  const getAnimalById = (id: number) => animaux.find((a) => a.id === id);
  const isValidString = (str: unknown): boolean => str !== null && str !== undefined && String(str).trim() !== '';

  return (
    <View style={styles.eventTextContainer}>
      <View style={styles.headerEventContainer}>
        <View style={styles.titleAndAnimalsContainer}>
          <View style={{ width: '70%' }}>
            <Text style={[styles.eventTitle, styles.text, styles.textFontBold]}>{eventInfos.nom}  </Text>
          </View>
          <View style={{ flexDirection: 'row', marginRight: 5 }}>
            {eventInfos !== undefined && animaux.length !== 0 &&
              eventInfos.animaux.map((eventAnimalId: number) => {
                const animal = getAnimalById(eventAnimalId);
                if (!animal) return null;
                return (
                  <View key={animal.id} style={{ marginRight: -3 }}>
                    <View style={{ height: 20, width: 20, backgroundColor: colors.textPrimary, borderRadius: 10, justifyContent: 'center' }}>
                      <AnimalAvatar animal={animal} avatarStyle={styles.avatar} avatarTextStyle={styles.avatarText} textFontRegular={styles.textFontRegular} />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </View>
      <View style={styles.contentEventContainer}>
        {isValidString(eventInfos.lieu) && (
          <View style={{ paddingRight: 5, paddingBottom: 5 }}>
            <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}>
              <Text style={[{ fontStyle: 'italic', color: colors.textPrimary }, styles.textFontRegular]}>Lieu : </Text>
              {eventInfos.lieu}
            </Text>
          </View>
        )}
        {isValidString(eventInfos.heuredebutbalade) && (
          <View style={{ paddingRight: 5, paddingBottom: 5 }}>
            <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}>
              <Text style={[{ fontStyle: 'italic', color: colors.textPrimary }, styles.textFontRegular]}>Heure de début : </Text>
              {eventInfos.heuredebutbalade}
            </Text>
          </View>
        )}
        {isValidString(eventInfos.commentaire) && (
          <View style={{ paddingRight: 5, paddingBottom: 5 }}>
            <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}>
              <Text style={[{ fontStyle: 'italic', color: colors.textPrimary }, styles.textFontRegular]}>Commentaire : </Text>
              {eventInfos.commentaire}
            </Text>
          </View>
        )}
        {eventInfos.created_by != null && eventInfos.created_by.email !== firebaseUser?.email && (
          <View>
            <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}>
              <Text style={[{ fontStyle: 'italic', color: colors.textPrimary }, styles.textFontRegular]}>Créer par : </Text>
              {eventInfos.created_by?.name}
            </Text>
          </View>
        )}
        {eventInfos.made_by !== null && !!eventInfos.shared_groups && (
          <View>
            <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}>
              <Text style={[{ fontStyle: 'italic', color: colors.textPrimary }, styles.textFontRegular]}>Fait par : </Text>
              {eventInfos.made_by?.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BaladeCard;
