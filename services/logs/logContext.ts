import { AppErrorCode } from '../../types/AppErrorCode';

const tagValues: Record<string, readonly string[]> = {
  feature: ['animals', 'events', 'notes', 'contacts', 'wishes', 'groups', 'objectives', 'auth', 'statistics', 'profile'],
  operation: ['create', 'update', 'modify', 'edit', 'delete', 'upload', 'parse', 'record_cleanup'],
  app_mode: ['development', 'staging', 'production'],
};
const flags = ['hasId', 'hasTitle', 'hasImage', 'hasBirthDate', 'hasDeathDate', 'hasAnimals', 'hasPhone', 'hasEmail', 'hasCreatedWish'];
const counts = ['step', 'memberCount', 'selectedAnimalCount'];
const errorCodes: readonly string[] = Object.values(AppErrorCode);

/** Allowlisted technical values only. Unknown fields are not forwarded to Sentry. */
export function filterLogContext(context?: Record<string, unknown>): {
  tags: Record<string, string>;
  data: Record<string, string | boolean | number>;
} {
  const tags: Record<string, string> = {};
  const data: Record<string, string | boolean | number> = {};
  if (!context) return { tags, data };
  const read = (key: string): unknown => Object.getOwnPropertyDescriptor(context, key)?.value;
  for (const [key, allowed] of Object.entries(tagValues)) {
    const value = read(key);
    if (typeof value === 'string' && allowed.includes(value)) tags[key] = value;
  }
  for (const key of flags) {
    const value = read(key);
    if (typeof value === 'boolean') data[key] = value;
  }
  for (const key of counts) {
    const value = read(key);
    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 10000) data[key] = value;
  }
  const errorCode = read('errorCode');
  if (typeof errorCode === 'string' && errorCodes.includes(errorCode)) data.errorCode = errorCode;
  return { tags, data };
}
