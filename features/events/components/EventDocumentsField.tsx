import { View } from 'react-native';
import { Field, PremiumGate } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { spacing } from '../../../theme/scales';
import { isPremiumSubscription } from '../../../shared/utils/subscriptionUtils';
import { EventDocumentPicker } from './EventDocumentPicker';

const EMPTY_DOCUMENTS: NonNullable<ReturnType<typeof useEventWizardStore.getState>['formData']['documents']> = [];

export function EventDocumentsField({ onComparePlans }: { onComparePlans: () => void }) {
  const premium = isPremiumSubscription(useAuthStore((state) => state.user?.subscription));
  const documents = useEventWizardStore((state) => state.formData.documents ?? EMPTY_DOCUMENTS);
  const setField = useEventWizardStore((state) => state.setField);

  return <Field label="Documents médicaux" filled={documents.length > 0}>
    <View style={{ gap: spacing.sm }}>
      {premium
        ? <EventDocumentPicker documents={documents} onChange={(items) => setField('documents', items)} />
        : <PremiumGate title="Documents médicaux Premium" message="L’ajout d’un document médical nécessite un abonnement Premium." onComparePlans={onComparePlans} testID="event-documents-premium" />}
    </View>
  </Field>;
}
