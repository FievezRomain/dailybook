import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, FlatList, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import ModalSubMenuWishActions from '../components/ModalSubMenuWishActions';
import ModalWish from '../components/ModalWish';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { useWishesQuery, useWishMutations } from '../../../hooks/queries/useWishesQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import { Wish } from '../../../models/Wish';
import type { UpdateWishPayload } from '../types';
import { AppEmptyState, AppErrorState } from '../../../shared/components/ui';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';

type Props = AppStackScreenProps<'Wish'>;

export default function WishScreen({ navigation }: Props) {
  const { colors, fonts } = useAppTheme();
  const { data: wishes = [], isLoading, isError, refetch } = useWishesQuery();
  const { update, remove } = useWishMutations();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);

  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [modalSubMenuWishVisible, setModalSubMenuWishVisible] = useState(false);
  const [modalWishVisible, setModalWishVisible] = useState(false);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  const openSubMenuWish = (wish: Wish) => {
    setSelectedWish(wish);
    setModalSubMenuWishVisible(true);
  };

  const confirmDelete = () => {
    if (!selectedWish) return;
    remove.mutate(String(selectedWish.id), {
      onSuccess: () => {
        setSelectedWish(null);
        setModalValidationDeleteVisible(false);
        setModalSubMenuWishVisible(false);
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un souhait réussi" });
      },
      onError: (err: any) => Toast.show({ type: 'error', position: 'top', text1: err.message }),
    });
  };

  const changeState = (wish: Wish) => {
    Haptics.selectionAsync().catch(() => undefined);
    update.mutate(
      { id: String(wish.id), body: { ...wish, acquis: !wish.acquis } as unknown as UpdateWishPayload },
      { onError: (err: any) => Toast.show({ type: 'error', position: 'top', text1: err.message }) }
    );
  };

  const getOrderedWishes = () => [...wishes].sort((a: Wish, b: Wish) => Number(a.acquis) - Number(b.acquis));

  const styles = {
    container: { flex: 1, marginTop: 20 },
    itemContainer: { flex: 1, margin: 5 },
    itemContainerSecondColumn: { marginTop: Dimensions.get('window').width * 0.05 },
    image: { width: '100%', aspectRatio: 1, borderRadius: 10 },
    title: { color: colors.textPrimary, marginTop: 5 },
    labelContainer: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: 5, borderRadius: 5, zIndex: 1 },
    price: { marginLeft: 5, color: colors.primary, fontSize: 12 },
    textFontRegular: { fontFamily: fonts.default.fontFamily, color: colors.textPrimary },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Souhaits" />
      <ModalSubMenuWishActions
        modalVisible={modalSubMenuWishVisible}
        setModalVisible={setModalSubMenuWishVisible}
        wish={selectedWish}
        handleRedirect={() => selectedWish?.url && Linking.openURL(selectedWish.url)}
        handleModify={() => setModalWishVisible(true)}
        handleDelete={() => setModalValidationDeleteVisible(true)}
        handleShare={() => {}}
      />
      <ModalWish
        actionType="modify"
        isVisible={modalWishVisible}
        setVisible={setModalWishVisible}
        wish={selectedWish ?? undefined}
        onModify={(wish?: Wish) => {
          setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: "Modification d'un souhait" }), 300);
          if (wish) setSelectedWish(wish);
        }}
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer le souhait ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un souhait"
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={{ paddingHorizontal: 20 }}>
            <ListSkeleton count={4} variant="wish" />
          </View>
        ) : isError ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppErrorState message="Impossible de charger les souhaits." onRetry={() => void refetch()} />
          </View>
        ) : wishes.length === 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            <AppEmptyState icon="gift-outline" title="Aucun souhait enregistré" description="Ajoutez vos envies pour les suivre simplement." />
          </View>
        ) : (
          <FlatList
            data={getOrderedWishes()}
            keyExtractor={(item: Wish) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={[styles.itemContainer, index % 2 !== 0 && styles.itemContainerSecondColumn]}>
                <TouchableOpacity onPress={() => openSubMenuWish(item)}>
                  {item.image ? (
                    <Image
                      source={{ uri: `${item.image}?uid=${firebaseUser?.uid}` }}
                      style={styles.image}
                      cachePolicy="disk"
                    />
                  ) : (
                    <View style={[{ backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }, styles.image]}>
                      <MaterialIcons name="no-photography" size={50} />
                    </View>
                  )}
                  {item.prix != null && (
                    <View style={styles.labelContainer}>
                      <Entypo name="price-tag" size={16} color={colors.primary} />
                      <Text style={[styles.price, styles.textFontRegular]}>{item.prix} €</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, styles.textFontBold]} numberOfLines={1}>{item.nom}</Text>
                    <Text style={styles.textFontRegular} numberOfLines={1}>{item.destinataire}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={update.isPending}
                    onPress={() => changeState(item)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 20, backgroundColor: item.acquis ? colors.minor : colors.textSecondary, marginLeft: 8, opacity: update.isPending ? 0.6 : 1 }}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: item.acquis ? colors.primary : colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                      {item.acquis && <Entypo name="check" size={14} color={colors.background} />}
                    </View>
                    <MaterialCommunityIcons name={item.acquis ? 'gift-open' : 'gift'} size={18} color={item.acquis ? colors.primary : colors.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            numColumns={2}
          />
        )}
      </View>
    </LinearGradient>
  );
}
