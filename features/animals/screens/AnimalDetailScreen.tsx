import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useAnimalsQuery, useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import InformationsAnimals from '../components/InformationsAnimals';
import AnimalBody from '../components/AnimalBody';
import MedicalBook from '../components/MedicalBook';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function AnimalDetailScreen({ route, navigation }: AppStackScreenProps<'AnimalDetail'>) {
  const { animalId } = route.params;
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const { data: animaux = [] } = useAnimalsQuery();
  const { remove } = useAnimalMutations();
  const animal = animaux.find((a) => a.id === animalId);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const TABS = [
    { label: t('tabs.infos'), icon: 'info-with-circle', iconSet: 'Entypo' },
    { label: t('tabs.carnet'), icon: 'clipboard-pulse-outline', iconSet: 'MaterialCommunity' },
    { label: t('tabs.body'), icon: 'horse', iconSet: 'MaterialCommunity' },
    { label: t('tabs.gallery'), icon: 'images', iconSet: 'Entypo' },
  ] as const;

  const onTabPress = useCallback((index: number) => {
    Haptics.selectionAsync().catch(() => undefined);
    setActiveTab(index);
  }, []);

  const onModify = () => {
    Toast.show({ type: 'success', position: 'top', text1: t('modifySaved') });
  };

  const confirmDelete = () => {
    if (!animal) return;
    remove.mutate(String(animal.id), {
      onSuccess: () => {
        setDeleteModalVisible(false);
        navigation.goBack();
        Toast.show({ type: 'success', position: 'top', text1: t('deleted') });
      },
      onError: (err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
      },
    });
  };

  const styles = {
    hero: { width: '100%', height: '40%' },
    gradientOverlay: { flex: 1, justifyContent: 'flex-end' },
    heroName: { fontSize: 24, color: '#fff', fontFamily: fonts.bodyLarge.fontFamily, marginLeft: 20, marginBottom: 8 },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: fonts.default.fontFamily, marginLeft: 20, marginBottom: 16 },
    backButton: { position: 'absolute', top: 50, left: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8 },
    tabBar: { flexDirection: 'row', backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    tabLabel: { fontSize: 12, fontFamily: fonts.default.fontFamily, marginTop: 2 },
    activeIndicator: { position: 'absolute', bottom: 0, height: 2, width: '100%', backgroundColor: colors.textPrimary },
    heroFallbackLetter: { fontSize: 80, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyLarge.fontFamily },
    content: { flex: 1, backgroundColor: colors.background },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyText: { color: colors.secondary, fontFamily: fonts.default.fontFamily, fontSize: 15, textAlign: 'center' },
  } as const;

  if (!animal) {
    return (
      <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.secondary }}>{t('notFound')}</Text>
      </View>
    );
  }

  const heroInner = (
    <>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradientOverlay}
      >
        <Text style={styles.heroName}>{animal.nom}</Text>
        {animal.espece ? <Text style={styles.heroSub}>{animal.espece}{animal.race ? ` · ${animal.race}` : ''}</Text> : null}
      </LinearGradient>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Entypo name="chevron-left" size={22} color="#fff" />
      </TouchableOpacity>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ModalValidation
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        title={t('confirmDeleteTitle', { name: animal.nom })}
        displayedText={t('confirmDelete', { name: animal.nom })}
        onConfirm={confirmDelete}
      />

      {/* Hero */}
      {animal.image ? (
        <ImageBackground source={{ uri: animal.image }} style={styles.hero} resizeMode="cover">
          {heroInner}
        </ImageBackground>
      ) : (
        <View style={styles.hero}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.heroFallbackLetter}>{animal.nom[0]?.toUpperCase()}</Text>
          </View>
          {heroInner}
        </View>
      )}

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => (
          <TouchableOpacity key={tab.label} style={styles.tabItem} onPress={() => onTabPress(index)}>
            {tab.iconSet === 'Entypo'
              ? <Entypo name={tab.icon as any} size={18} color={activeTab === index ? colors.textPrimary : colors.border} />
              : <MaterialCommunityIcons name={tab.icon as any} size={18} color={activeTab === index ? colors.textPrimary : colors.border} />
            }
            <Text style={[styles.tabLabel, { color: activeTab === index ? colors.textPrimary : colors.border }]}>{tab.label}</Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 0 && (
          <ScrollView>
            <InformationsAnimals animal={animal} onModify={onModify} onDelete={() => setDeleteModalVisible(true)} />
          </ScrollView>
        )}
        {activeTab === 1 && (
          <ScrollView>
            <MedicalBook animal={animal} navigation={navigation} />
          </ScrollView>
        )}
        {activeTab === 2 && (
          <ScrollView>
            <AnimalBody animal={animal} onModify={onModify} />
          </ScrollView>
        )}
        {activeTab === 3 && (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="images" size={42} color={colors.border} />
            <Text style={[styles.emptyText, { marginTop: 12 }]}>{t('galleryComing')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
