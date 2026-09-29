import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { spacing } from '../../../../theme/scales';
import { Button } from '../actions';
import { TopBar } from '../navigation';
import { VascoBottomSheet } from './BottomSheet';
import { Dialog } from './Dialog';

export interface FormSheetProps {
  open?: boolean;
  title: string;
  children: ReactNode;
  onBack: () => void;
  onClose: () => void;
  footerLabel?: string;
  onFooterPress?: () => void;
  footerDisabled?: boolean;
  footerLoading?: boolean;
  footer?: ReactNode;
  dirty?: boolean;
  confirmBackWhenDirty?: boolean;
  material?: Material;
  testID?: string;
}

type HostedConfiguration = Omit<FormSheetProps, 'children' | 'open'>;
const FormSheetHostContext = createContext<((configuration: HostedConfiguration) => void) | null>(null);

/** Enveloppe unique des formulaires d'ajout et de modification Vasco. */
export function FormSheet(props: FormSheetProps) {
  const register = useContext(FormSheetHostContext);
  if (register) return <HostedFormSheet {...props} register={register} />;
  return <FormSheetModal {...props} />;
}

function HostedFormSheet({ children, open: _open, register, ...configuration }: FormSheetProps & { register: (configuration: HostedConfiguration) => void }) {
  useLayoutEffect(() => register(configuration), [configuration.title, configuration.onBack, configuration.onClose, configuration.footerLabel, configuration.onFooterPress, configuration.footerDisabled, configuration.footerLoading, configuration.footer, configuration.dirty, configuration.confirmBackWhenDirty, configuration.material, configuration.testID, register]);
  return <>{children}</>;
}

export interface FormSheetHostProps {
  children: ReactNode;
  fallbackTitle?: string;
}

/** Garde une seule modal montée pendant que le contenu du parcours change. */
export function FormSheetHost({ children, fallbackTitle = 'Formulaire' }: FormSheetHostProps) {
  const [configuration, setConfiguration] = useState<HostedConfiguration>({
    title: fallbackTitle,
    onBack: () => undefined,
    onClose: () => undefined,
  });

  return <FormSheetModal {...configuration}>
    <FormSheetHostContext.Provider value={setConfiguration}>
      {children}
    </FormSheetHostContext.Provider>
  </FormSheetModal>;
}

function FormSheetModal({
  open = true,
  title,
  children,
  onBack,
  onClose,
  footerLabel,
  onFooterPress,
  footerDisabled,
  footerLoading,
  footer,
  dirty = false,
  confirmBackWhenDirty = false,
  material = 'solid',
  testID,
}: FormSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(open);
  const [confirmClose, setConfirmClose] = useState(false);
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => setSheetOpen(open), [open]);
  const handleDismiss = () => { if (footerLoading) return; setSheetOpen(false); if (dirty) setConfirmClose(true); else onClose(); };
  const renderedFooter = footer ?? (footerLabel && onFooterPress ? <View style={{ paddingHorizontal: spacing.md }}><Button label={footerLabel} onPress={onFooterPress} fullWidth size="large" disabled={footerDisabled} loading={footerLoading} /></View> : undefined);

  return <>
    <VascoBottomSheet open={sheetOpen} onClose={handleDismiss} title={title} material={material} formHandle dismissible={!footerLoading} height={Math.max(componentTokens.formSheet.minHeight, Math.min(componentTokens.formSheet.maxHeight, windowHeight * componentTokens.formSheet.heightRatio))} header={<TopBar title={title} context="detail" material={material} onBack={footerLoading ? () => undefined : confirmBackWhenDirty && dirty ? handleDismiss : onBack} />} footer={renderedFooter} contentContainerStyle={{ gap: 0, paddingHorizontal: 0, paddingTop: 0 }} testID={testID}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets contentContainerStyle={{ flexGrow: 1, gap: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>{children}</ScrollView>
    </VascoBottomSheet>
    <Dialog open={confirmClose} type="destructive" title="Abandonner les modifications ?" description="Les informations non enregistrées seront perdues." cancelLabel="Continuer" confirmLabel="Abandonner" onClose={() => { setConfirmClose(false); setSheetOpen(true); }} onConfirm={() => { setConfirmClose(false); onClose(); }} testID={testID ? `${testID}-close-confirmation` : undefined} />
  </>;
}
