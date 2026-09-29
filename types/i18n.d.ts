import 'i18next';
import type frCommon      from '../translation/fr/common.json';
import type frAuth        from '../translation/fr/auth.json';
import type frAnimals     from '../translation/fr/animals.json';
import type frEvents      from '../translation/fr/events.json';
import type frNotes       from '../translation/fr/notes.json';
import type frStatistics  from '../translation/fr/statistics.json';
import type frContacts    from '../translation/fr/contacts.json';
import type frGroups      from '../translation/fr/groups.json';
import type frObjectifs   from '../translation/fr/objectifs.json';
import type frWishes      from '../translation/fr/wishes.json';
import type frNotifications from '../translation/fr/notifications.json';
import type frOnboarding  from '../translation/fr/onboarding.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common:        typeof frCommon;
      auth:          typeof frAuth;
      animals:       typeof frAnimals;
      events:        typeof frEvents;
      notes:         typeof frNotes;
      statistics:    typeof frStatistics;
      contacts:      typeof frContacts;
      groups:        typeof frGroups;
      objectifs:     typeof frObjectifs;
      wishes:        typeof frWishes;
      notifications: typeof frNotifications;
      onboarding:    typeof frOnboarding;
    };
  }
}
