import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getFileUrl, uploadFile, deleteFile } from '../../../services/aws/FileStorageService';

import { getAnimalBodyPictures, addAnimalBodyPicture, deleteAnimalBodyPicture } from '../../../services/api/AnimalsService';
import { isSameMonth } from 'date-fns';
import * as Localization from 'expo-localization';
import Toast from 'react-native-toast-message';
import AvatarPicker from '../../../shared/components/inputs/AvatarPicker';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';

const { width } = Dimensions.get('window');

const CarouselImageItem = ({
  item,
  locale,
  onDelete,
  textFontBold,
  textFontRegular,
}: {
  item: any;
  locale: string;
  onDelete: (item: any) => void;
  textFontBold: object;
  textFontRegular: object;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.filename) {
      getFileUrl(item.filename, 'animal', item.idanimal ?? '')
        .then((u) => setImageUrl(u))
        .catch(() => {});
    }
  }, [item.filename, item.idanimal]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={{ uri: imageUrl ?? undefined }}
        style={{ width: '90%', height: '100%', borderRadius: 12 }}
        contentFit="contain"
        cachePolicy="disk"
      />
      <TouchableOpacity
        onPress={() => onDelete(item)}
        style={{
          position: 'absolute',
          top: 10,
          right: 25,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          width: 35,
          height: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={[textFontBold, { color: 'white', fontSize: 20 }]}>×</Text>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 8, left: 30, backgroundColor: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 5 }}>
        <Text style={[textFontRegular, { color: 'white', fontSize: 12 }]}>
          {new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(
            new Date(item.date_enregistrement),
          )}
        </Text>
      </View>
    </View>
  );
};

const AnimalImageCarousel = ({ animalId }: { animalId: string }) => {
  const { colors, fonts } = useAppTheme();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalConfirmDeleteVisible, setModalConfirmDeleteVisible] = useState(false);
  const [itemFocused, setItemFocused] = useState<any>({});
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const locale = Localization.getLocales()[0].languageTag;

  const [currentIndex, setCurrentIndex] = useState(0);
  const DOT_LIMIT = 5;
  const half = Math.floor(DOT_LIMIT / 2);
  const start = Math.max(0, currentIndex - half);
  const end = Math.min(images.length, start + DOT_LIMIT);
  const visibleDots = images.slice(start, end);

  const LIMIT_PICTURE_BY_MONTH = 1;

  useEffect(() => {
    fetchImages();
  }, [animalId]);

  const fetchImages = async () => {
    try {
      const response = await getAnimalBodyPictures(animalId);
      const now = new Date();
      const currentMonthImages = response.filter((img: any) => isSameMonth(new Date(img.date_enregistrement), now));
      setImages(response);
      setCurrentMonthCount(currentMonthImages.length);
      setCurrentIndex(response.length > 0 ? response.length - 1 : 0);
    } catch (error) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (uri: string) => {
    if (uri) {
      setLoading(true);
      const parts = uri.split('/');
      const filename = parts[parts.length - 1];
      const data = { idanimal: animalId, filename };

      await uploadFile(uri, filename, 'image/jpeg', 'animal', animalId);
      await addAnimalBodyPicture(animalId, { filename } as unknown as FormData);
      await fetchImages();

      Toast.show({ type: 'success', position: 'top', text1: "Ajout d'une photo réussie" });
    }
  };

  const handleDeleteImage = async () => {
    setLoading(true);
    await deleteFile(itemFocused.filename, 'animal', animalId);
    await deleteAnimalBodyPicture(itemFocused.id);
    await fetchImages();

    Toast.show({ type: 'success', position: 'top', text1: "Suppression d'une photo réussie" });
  };

  const styles = StyleSheet.create({
    button: {
      marginTop: 15,
      alignSelf: 'center',
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 20,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!images.length) {
    return (
      <View style={{ marginBottom: 20 }}>
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <ModalDefaultNoValue text="Vous n'avez aucune photo à afficher." />
        </View>
        <AvatarPicker
          onChange={handleAddImage}
          ButtonComponent={({ onPress }: { onPress: () => void }) => (
            <TouchableOpacity
              onPress={onPress}
              disabled={currentMonthCount >= LIMIT_PICTURE_BY_MONTH}
              style={[
                styles.button,
                { backgroundColor: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? colors.secondary : colors.accent },
              ]}
            >
              <Text style={[styles.textFontRegular, { textTransform: 'uppercase', color: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? 'gray' : 'white' }]}>
                {currentMonthCount >= LIMIT_PICTURE_BY_MONTH
                  ? 'Limite de photos atteinte ce mois-ci'
                  : 'Ajouter une photo pour ce mois'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <>
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer cette image ?"
        title="Suppression d'une image"
        onConfirm={handleDeleteImage}
        setVisible={setModalConfirmDeleteVisible}
        visible={modalConfirmDeleteVisible}
      />
      <View style={{ marginBottom: 20 }}>
        <Carousel
          width={width}
          height={200}
          data={images}
          defaultIndex={currentIndex}
          onSnapToItem={(index) => setCurrentIndex(index)}
          scrollAnimationDuration={500}
          renderItem={({ item }) => (
            <CarouselImageItem
              item={item}
              locale={locale}
              onDelete={(i) => { setItemFocused(i); setModalConfirmDeleteVisible(true); }}
              textFontBold={styles.textFontBold}
              textFontRegular={styles.textFontRegular}
            />
          )}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          {visibleDots.map((_, index) => {
            const dotIndex = start + index;
            return (
              <View
                key={dotIndex}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                  backgroundColor: dotIndex === currentIndex ? colors.accent : colors.tertiary,
                }}
              />
            );
          })}
        </View>
        {currentMonthCount < LIMIT_PICTURE_BY_MONTH && (
          <AvatarPicker
            onChange={handleAddImage}
            ButtonComponent={({ onPress }: { onPress: () => void }) => (
              <TouchableOpacity
                onPress={onPress}
                disabled={currentMonthCount >= LIMIT_PICTURE_BY_MONTH}
                style={[
                  styles.button,
                  { backgroundColor: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? colors.secondary : colors.accent },
                ]}
              >
                <Text style={[styles.textFontRegular, { color: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? 'gray' : 'white' }]}>
                  {currentMonthCount >= LIMIT_PICTURE_BY_MONTH
                    ? 'Limite de photos atteinte ce mois-ci'
                    : 'Ajouter une photo pour ce mois'}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
};

export default AnimalImageCarousel;
