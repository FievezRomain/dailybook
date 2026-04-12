import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import OfferInformations from '../../../shared/components/common/OfferInformations';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function DiscoverPremiumScreen({ navigation }: AppStackScreenProps<'DiscoverPremium'>) {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.onSurface }}>
      <View style={{ height: '100%', width: '90%', alignSelf: 'center', display: 'flex' }}>
        <TopTabSecondary message1="Découvrez" message2="L'offre premium" />
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <OfferInformations withMessageFunctionality={false} />
        </ScrollView>
      </View>
    </View>
  );
}
