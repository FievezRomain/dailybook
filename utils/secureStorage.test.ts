// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).__DEV__ = false;

import * as SecureStore from 'expo-secure-store';
import { secureStorage } from './secureStorage';

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

// __resetStore is exported from the mock to wipe in-memory state
const { __resetStore } = jest.requireMock('expo-secure-store') as {
  __resetStore: () => void;
};

beforeEach(() => {
  __resetStore();
  jest.clearAllMocks();
});

const SANITIZED_FOO = 'mdb_foo';

describe('secureStorage.getItem', () => {
  it('calls getItemAsync with prefixed key', async () => {
    await secureStorage.getItem('foo');
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith(SANITIZED_FOO);
  });

  it('returns the stored value', async () => {
    mockSecureStore.getItemAsync.mockResolvedValueOnce('bar');
    const result = await secureStorage.getItem('foo');
    expect(result).toBe('bar');
  });

  it('returns null when no value is stored', async () => {
    const result = await secureStorage.getItem('nonexistent');
    expect(result).toBeNull();
  });

  it('returns null when SecureStore throws', async () => {
    mockSecureStore.getItemAsync.mockRejectedValueOnce(new Error('store error'));
    const result = await secureStorage.getItem('foo');
    expect(result).toBeNull();
  });
});

describe('secureStorage.setItem', () => {
  it('calls setItemAsync with sanitized key and value', async () => {
    await secureStorage.setItem('foo', 'myvalue');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(SANITIZED_FOO, 'myvalue');
  });

  it('does not throw when SecureStore fails', async () => {
    mockSecureStore.setItemAsync.mockRejectedValueOnce(new Error('write error'));
    await expect(secureStorage.setItem('foo', 'val')).resolves.toBeUndefined();
  });
});

describe('secureStorage.removeItem', () => {
  it('calls deleteItemAsync with prefixed key', async () => {
    await secureStorage.removeItem('foo');
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(SANITIZED_FOO);
  });

  it('does not throw when SecureStore fails', async () => {
    mockSecureStore.deleteItemAsync.mockRejectedValueOnce(new Error('delete error'));
    await expect(secureStorage.removeItem('foo')).resolves.toBeUndefined();
  });
});

describe('key sanitization', () => {
  it('converts special chars to underscores', async () => {
    await secureStorage.getItem('my:key/test');
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('mdb_my_key_test');
  });

  it('preserves alphanumeric chars and dots/dashes', async () => {
    await secureStorage.getItem('user-token.v2');
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('mdb_user-token.v2');
  });
});
