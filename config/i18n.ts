import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// ── French translations ──────────────────────────────────────────────────────
import frCommon      from '../translation/fr/common.json';
import frAuth        from '../translation/fr/auth.json';
import frAnimals     from '../translation/fr/animals.json';
import frEvents      from '../translation/fr/events.json';
import frNotes       from '../translation/fr/notes.json';
import frStatistics  from '../translation/fr/statistics.json';
import frContacts    from '../translation/fr/contacts.json';
import frGroups      from '../translation/fr/groups.json';
import frObjectifs   from '../translation/fr/objectifs.json';
import frWishes      from '../translation/fr/wishes.json';
import frNotifications from '../translation/fr/notifications.json';
import frOnboarding  from '../translation/fr/onboarding.json';

// ── English translations ─────────────────────────────────────────────────────
import enCommon      from '../translation/en/common.json';
import enAuth        from '../translation/en/auth.json';
import enAnimals     from '../translation/en/animals.json';
import enEvents      from '../translation/en/events.json';
import enNotes       from '../translation/en/notes.json';
import enStatistics  from '../translation/en/statistics.json';
import enContacts    from '../translation/en/contacts.json';
import enGroups      from '../translation/en/groups.json';
import enObjectifs   from '../translation/en/objectifs.json';
import enWishes      from '../translation/en/wishes.json';
import enNotifications from '../translation/en/notifications.json';
import enOnboarding  from '../translation/en/onboarding.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'fr';
const supportedLocales = ['fr', 'en'];
const lng = supportedLocales.includes(deviceLocale) ? deviceLocale : 'fr';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng,
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: [
      'common', 'auth', 'animals', 'events', 'notes',
      'statistics', 'contacts', 'groups', 'objectifs',
      'wishes', 'notifications', 'onboarding',
    ],
    resources: {
      fr: {
        common:        frCommon,
        auth:          frAuth,
        animals:       frAnimals,
        events:        frEvents,
        notes:         frNotes,
        statistics:    frStatistics,
        contacts:      frContacts,
        groups:        frGroups,
        objectifs:     frObjectifs,
        wishes:        frWishes,
        notifications: frNotifications,
        onboarding:    frOnboarding,
      },
      en: {
        common:        enCommon,
        auth:          enAuth,
        animals:       enAnimals,
        events:        enEvents,
        notes:         enNotes,
        statistics:    enStatistics,
        contacts:      enContacts,
        groups:        enGroups,
        objectifs:     enObjectifs,
        wishes:        enWishes,
        notifications: enNotifications,
        onboarding:    enOnboarding,
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
