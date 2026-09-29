import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('P7.f visual refinements', () => {
  it('keeps objective cards on the shared one-point outline', () => {
    const source = read('shared/components/ui/content/ObjectiveCard.tsx');
    expect(source).toContain('borderWidth: 1');
    expect(source).not.toContain("status === 'overdue' ? 2 : 1");
  });

  it('does not truncate wish content', () => {
    const source = read('shared/components/ui/content/WishCard.tsx');
    expect(source).toContain('<DomainTitle numberOfLines={0}>');
    expect(source).toContain('<DomainBody numberOfLines={0}>{description}</DomainBody>');
    expect(source).toContain('{priceLabel}');
    expect(source).toContain('<DomainCaption numberOfLines={0} color={colors.primaryDark}>');
    expect(source).toContain('<DomainCaption numberOfLines={0}');
    expect(source).not.toContain('numberOfLines={1}');
  });

  it('aggregates every animal when the Tous filter is active', () => {
    const source = read('features/objectifs/screens/TrackingScreen.tsx');
    expect(source).toMatch(/statisticsAnimalSelection\s*===\s*["']all["']\s*\?\s*animals\.map\(\(animal\)\s*=>\s*animal\.id\)\s*:\s*statisticsAnimalSelection/);
    expect(source).toContain('animalIds={selectedAnimalIds}');
  });

  it('supports ordered multi-selection for statistics', () => {
    const tracking = read('features/objectifs/screens/TrackingScreen.tsx');
    const selector = read('shared/components/ui/selection/AnimalSelectorItem.tsx');
    expect(tracking).toContain('selectionOrder={selectionOrder}');
    expect(tracking).toContain("mode=\"multiple\"");
    expect(selector).toContain('selectionOrder?: number');
  });

  it('reuses the event animal selection pattern for objectives', () => {
    const source = read('features/objectifs/screens/ObjectiveFormSheetScreen.tsx');
    expect(source).toContain('<Checkbox');
    expect(source).toContain('<ListItem');
    expect(source).toContain('objective-add-step');
  });

  it('keeps one stable Agenda and Animals root with account navigation', () => {
    const source = read('app/navigation/MainNavigator.tsx');
    expect(source.match(/<AgendaScreen/g)).toHaveLength(1);
    expect(source.match(/<AnimalsWorkspaceScreen/g)).toHaveLength(1);
    expect(source.match(/onAccount=\{openSettings\}/g)?.length).toBeGreaterThanOrEqual(5);
    expect(source).toContain('display: tab === "home" ? "flex" : "none"');
    expect(source).toContain('display: tab === "animals" ? "flex" : "none"');
  });

  it('keeps the Agenda date for detail returns and only forwards it to event creation from Agenda', () => {
    const agenda = read('features/events/screens/AgendaScreen.tsx');
    const navigator = read('app/navigation/MainNavigator.tsx');
    expect(agenda).toContain('useCalendarUIStore');
    expect(agenda).toContain('target === "event" ? selectedDate : undefined');
    expect(navigator).toContain('if (initialEventDate) setEventWizardFormData({ dateevent: initialEventDate })');
  });

  it('renders Premium gates inside Statistics and medical documents', () => {
    const tracking = read('features/objectifs/screens/TrackingScreen.tsx');
    const animals = read('features/animals/screens/AnimalsWorkspaceScreen.tsx');
    expect(tracking).toContain('testID="statistics-premium-gate"');
    expect(tracking).not.toContain('onStatisticsLocked');
    expect(animals).toContain('testID="medical-documents-premium-gate"');
  });

  it('restores the historical comparison rows without bottom subscription actions', () => {
    const source = read('shared/components/ui/patterns/PremiumPlansComparison.tsx');
    expect(source).toContain("Gestion d'animaux");
    expect(source).toContain("Suivi de l'évolution physique de l'animal");
    expect(source).not.toContain('Découvrir Premium');
    expect(source).not.toContain('Je continue avec la version gratuite');
  });

  it('auto-dismisses shared snackbars after four seconds by default', () => {
    const source = read('shared/components/ui/feedback/Snackbar.tsx');
    expect(source).toContain('duration = 4000');
    expect(source).toContain('setTimeout(() => onHidden?.(), duration)');
  });

  it('keeps shared tabs transparent and medical documents in event details', () => {
    const tabs = read('shared/components/ui/navigation/TabBar.tsx');
    const details = read('features/events/screens/EventCreateDetailsScreen.tsx');
    const options = read('features/events/screens/EventCreateOptionsScreen.tsx');
    expect(tabs).not.toContain('backgroundColor: colors.surface');
    expect(details).toContain('<EventDocumentsField onComparePlans={onComparePlans} />');
    expect(options).not.toContain('Documents médicaux');
  });

  it('keeps event document selectors referentially stable when empty', () => {
    const source = read('features/events/components/EventDocumentsField.tsx');
    expect(source).toContain('EMPTY_DOCUMENTS');
    expect(source).not.toContain('state.formData.documents ?? []');
  });

  it('separates objective animals and steps into four wizard stages', () => {
    const screen = read('features/objectifs/screens/ObjectiveFormSheetScreen.tsx');
    const store = read('stores/useObjectiveWizardStore.ts');
    expect(screen).toContain('total={4}');
    expect(screen).toContain("step === 2 ? 'Définir les étapes'");
    expect(store).toContain('Math.min(3, step)');
    expect(screen).toContain('Ajoutez au moins une étape pour créer l’objectif.');
  });

  it('keeps rich-note JavaScript escapes intact and suppresses unmount dismissals', () => {
    const editor = read('features/notes/components/RichNoteEditor.tsx');
    const sheet = read('shared/components/ui/overlays/BottomSheet.tsx');
    expect(editor).toContain('const editorHtml = String.raw');
    expect(sheet).toContain('unmountingRef.current = true');
    expect(sheet).toContain('onDismiss={handleDismiss}');
  });

  it('uses the historical animal selector affordance in Agenda filters', () => {
    const agenda = read('features/events/screens/AgendaScreen.tsx');
    expect(agenda).toContain('<AnimalSelectorMore');
    expect(agenda).toContain('agenda-animal-more');
  });

  it('does not send the wish URL twice on iOS', () => {
    const source = read('features/wishes/screens/WishDetailScreen.tsx');
    expect(source).toContain("Platform.OS === 'ios'");
    expect(source).toContain('url: wish.url || undefined');
    expect(source).not.toContain('lines.push(wish.url)');
  });
});
