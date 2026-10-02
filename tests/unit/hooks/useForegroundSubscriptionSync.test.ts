/** @jest-environment jsdom */
import { act, renderHook, waitFor } from '@testing-library/react';
import type { AuthUser } from '../../../services/auth/IAuthService';
import type { UserProfile } from '../../../models/User';
import { useForegroundSubscriptionSync } from '../../../hooks/useForegroundSubscriptionSync';

let mockListener: (state: string) => void;
const mockRemove = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);
const mockToken = jest.fn().mockResolvedValue(undefined);
const mockSession = jest.fn();
const mockSetUser = jest.fn();
const mockIdentity: AuthUser = { uid: 'fixture', email: null, displayName: null, photoURL: null, emailVerified: true };
let mockState: { isAuthenticated: boolean; firebaseUser: AuthUser | null; user: UserProfile | null; setUser: typeof mockSetUser };
jest.mock('react-native', () => ({ AppState: { currentState: 'active', addEventListener: (_: string, listener: typeof mockListener) => { mockListener = listener; return { remove: mockRemove }; } } }));
jest.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ invalidateQueries: mockInvalidate }) }));
jest.mock('../../../stores/useAuthStore', () => ({ useAuthStore: Object.assign((select: (state: typeof mockState) => unknown) => select(mockState), { getState: () => mockState }) }));
jest.mock('../../../services/notifications/ExpoNotificationService', () => ({ notificationService: { getToken: () => mockToken() } }));
jest.mock('../../../services/api/AuthService', () => ({ openSession: (...args: unknown[]) => mockSession(...args) }));
jest.mock('../../../services/logs/LoggerService', () => ({ logger: { breadcrumb: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
  mockState = { isAuthenticated: true, firebaseUser: mockIdentity, user: { id: '1', email: 'fixture@example.invalid', subscription: 'Free' }, setUser: mockSetUser };
  mockSession.mockResolvedValue({ subscription: 'Premium' });
});
const resume = () => act(() => { mockListener('background'); mockListener('active'); });

it('applies updated access on foreground without a second request', async () => {
  const { unmount } = renderHook(useForegroundSubscriptionSync);
  resume();
  await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({ subscription: 'Premium' })));
  expect(mockSession).toHaveBeenCalledTimes(1);
  expect(mockInvalidate).toHaveBeenCalledTimes(1);
  act(() => mockListener('active'));
  expect(mockSession).toHaveBeenCalledTimes(1);
  unmount();
  expect(mockRemove).toHaveBeenCalled();
});
it('applies revocation as well as attribution', async () => {
  mockState.user!.subscription = 'Premium';
  mockSession.mockResolvedValue({ subscription: 'Free' });
  renderHook(useForegroundSubscriptionSync);
  resume();
  await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({ subscription: 'Free' })));
});
it('keeps the cached profile on network failure', async () => {
  mockSession.mockRejectedValue(new Error('offline'));
  renderHook(useForegroundSubscriptionSync);
  resume();
  await waitFor(() => expect(mockSession).toHaveBeenCalledTimes(1));
  expect(mockSetUser).not.toHaveBeenCalled();
  expect(mockInvalidate).not.toHaveBeenCalled();
});
it('ignores a late response after logout', async () => {
  let complete: (value: { subscription: string }) => void = () => undefined;
  mockSession.mockReturnValue(new Promise(resolve => { complete = resolve; }));
  renderHook(useForegroundSubscriptionSync);
  resume();
  await waitFor(() => expect(mockSession).toHaveBeenCalledTimes(1));
  mockState = { ...mockState, firebaseUser: null, isAuthenticated: false };
  await act(async () => complete({ subscription: 'Premium' }));
  expect(mockSetUser).not.toHaveBeenCalled();
});
