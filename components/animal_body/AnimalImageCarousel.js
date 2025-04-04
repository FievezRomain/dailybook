import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import { useTheme } from 'react-native-paper';
import FileStorageService from '../../services/FileStorageService';
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import animalsServiceInstance from '../../services/AnimalsService';
import { isSameMonth } from 'date-fns'; 
import * as Localization from 'expo-localization';
import Toast from "react-native-toast-message";
import AvatarPicker from '../AvatarPicker';
import ModalDefaultNoValue from '../Modals/ModalDefaultNoValue';

const { width } = Dimensions.get('window');

const AnimalImageCarousel = ({ animalId }) => {
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();
    const { colors, fonts } = useTheme();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const response = await animalsServiceInstance.getAnimalBodyPictures(animalId, currentUser.email);

        const now = new Date();
        const currentMonthImages = response.filter(img =>
            isSameMonth(new Date(img.date_enregistrement), now)
        );
        setImages(response);
        setCurrentMonthCount(currentMonthImages.length);
        setCurrentIndex(response.length > 0 ? response.length - 1 : 0);
    } catch (error) {
        console.error("Erreur chargement images:", error);
        setImages([]);
    } finally {
        setLoading(false);
    }
  };

  const handleAddImage = async ( uri ) => {
    if( uri ){
        setLoading(true);

        let filename = uri.split("/");
        filename = filename[filename.length-1];

        let data = {idanimal: animalId, filename: filename};

        await fileStorageService.uploadFile(uri, filename, "image/jpeg", currentUser.uid);

        await animalsServiceInstance.addAnimalBodyPicture(data);

        await fetchImages();

        Toast.show({
            type: "success",
            position: "top",
            text1: "Ajout d'une photo réussie"
        });
    }
  };

  const handleDeleteImage = async ( id, filename ) => {
    setLoading(true);

    let data = {id: id, email: currentUser.email};

    await fileStorageService.deleteFile( filename, currentUser.uid );

    await animalsServiceInstance.deleteAnimalBodyPicture( data );

    await fetchImages();

    Toast.show({
        type: "success",
        position: "top",
        text1: "Suppression d'une photo réussie"
    });
  };

  const styles = StyleSheet.create({
    button: {
      marginTop: 15,
      alignSelf: 'center',
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    textFontRegular:{
        fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
        fontFamily: fonts.bodyMedium.fontFamily
    },
    textFontBold:{
        fontFamily: fonts.bodyLarge.fontFamily
    }
  });

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!images.length) return (
    <View style={{marginBottom: 20}}>

        <View style={{width: "90%", alignSelf: "center"}}>
            <ModalDefaultNoValue
                text={"Vous n'avez aucune photo à afficher."}
            />
        </View>
        <AvatarPicker
            setImage={handleAddImage}
            setValue={() => {}}
            ButtonComponent={({ onPress }) => (
                <TouchableOpacity
                    onPress={onPress}
                    disabled={currentMonthCount >= LIMIT_PICTURE_BY_MONTH}
                    style={[
                        styles.button,
                        { backgroundColor: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? colors.disabled : colors.accent },
                    ]}
                >
                    <Text style={[styles.textFontRegular, { color: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? 'gray' : 'white' }]}>
                        {currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? "Limite de photos atteinte ce mois-ci" : "Ajouter une photo pour ce mois"}
                    </Text>
                </TouchableOpacity>
            )}
        />
    </View>
    
  );

  return (
    <View style={{ marginBottom: 20 }}>
        <Carousel
            width={width}
            height={200}
            data={images}
            defaultIndex={currentIndex}
            onSnapToItem={(index) => setCurrentIndex(index)}
            scrollAnimationDuration={500}
            renderItem={({ item }) => (
            <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                    source={{uri:  fileStorageService.getFileUrl( item.filename, currentUser.uid ) }}
                    style={{ width: '90%', height: '100%', borderRadius: 12 }}
                    contentFit="contain"
                    cachePolicy="disk"
                />
                <TouchableOpacity
                    onPress={() => handleDeleteImage(item.id, item.filename)}
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
                    <Text style={[styles.textFontBold, { color: 'white', fontSize: 20 }]}>×</Text>
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 8, left: 30, backgroundColor: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 5 }}>
                    <Text style={[styles.textFontRegular ,{ color: 'white', fontSize: 12 }]}>
                        {new Intl.DateTimeFormat(locale, {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        }).format(new Date(item.date_enregistrement))}
                    </Text>
                </View>
            </View>
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

        {currentMonthCount < LIMIT_PICTURE_BY_MONTH && 
            <AvatarPicker
                setImage={handleAddImage}
                setValue={() => {}}
                ButtonComponent={({ onPress }) => (
                    <TouchableOpacity
                        onPress={onPress}
                        disabled={currentMonthCount >= LIMIT_PICTURE_BY_MONTH}
                        style={[
                            styles.button,
                            { backgroundColor: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? colors.disabled : colors.accent },
                        ]}
                    >
                        <Text style={[styles.textFontRegular, { color: currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? 'gray' : 'white' }]}>
                            {currentMonthCount >= LIMIT_PICTURE_BY_MONTH ? "Limite de photos atteinte ce mois-ci" : "Ajouter une photo pour ce mois"}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        }
        

        
    </View>
  );
};

export default AnimalImageCarousel;
