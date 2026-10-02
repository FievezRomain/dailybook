jest.mock('@sentry/react-native', () => ({ setUser: jest.fn() }));
import * as Sentry from '@sentry/react-native';
import { setMonitoringIdentity } from '../../services/auth/monitoringIdentity';

describe('monitoring identity', () => {
  beforeEach(() => jest.clearAllMocks());
  it('copies only the stable ID even when the auth object contains private data', () => {
    const user = { uid: 'fixture-id', email: 'private@example.invalid', displayName: 'Private Name', photoURL: 'https://example.invalid/private', token: 'secret' };
    setMonitoringIdentity(user);
    expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'fixture-id' });
    expect(user.email).toBe('private@example.invalid');
  });
  it('clears identity on logout and sets the next account without merging old properties', () => {
    setMonitoringIdentity({ uid: 'first-account' });
    setMonitoringIdentity(null);
    setMonitoringIdentity({ uid: 'next-account' });
    expect(Sentry.setUser).toHaveBeenNthCalledWith(2, null);
    expect(Sentry.setUser).toHaveBeenNthCalledWith(3, { id: 'next-account' });
  });
});
