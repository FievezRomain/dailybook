let mockStoredWalk: string | null = null

const mockRequestForegroundPermissionsAsync = jest.fn(async () => ({ status: 'granted' }))
const mockRequestBackgroundPermissionsAsync = jest.fn(async () => ({ status: 'granted' }))
const mockRemoveForegroundSubscription = jest.fn()
const mockWatchPositionAsync = jest.fn(async () => ({ remove: mockRemoveForegroundSubscription }))
const mockStartLocationUpdatesAsync = jest.fn()
const mockDeleteWalkSession = jest.fn(async () => undefined)

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => mockStoredWalk),
  setItem: jest.fn(async (_key: string, value: string) => { mockStoredWalk = value }),
  removeItem: jest.fn(async () => { mockStoredWalk = null }),
}))

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { appOwnership: 'expo' },
  AppOwnership: { Expo: 'expo' },
}))

jest.mock('expo-location', () => ({
  Accuracy: { BestForNavigation: 6 },
  ActivityType: { Fitness: 3 },
  requestForegroundPermissionsAsync: mockRequestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync: mockRequestBackgroundPermissionsAsync,
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: {
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 5,
      altitude: 35,
      speed: 1,
    },
    timestamp: Date.now(),
  })),
  watchPositionAsync: mockWatchPositionAsync,
  hasStartedLocationUpdatesAsync: jest.fn(async () => false),
  startLocationUpdatesAsync: mockStartLocationUpdatesAsync,
  stopLocationUpdatesAsync: jest.fn(),
}))

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}))

jest.mock('../../../services/api/EventService', () => ({
  startWalkSession: jest.fn(async () => ({ id: 7 })),
  appendWalkPoints: jest.fn(),
  finalizeWalkSession: jest.fn(),
  deleteWalkSession: mockDeleteWalkSession,
}))

import { deleteWalkTracking, startOrResumeWalk } from '../../../features/events/walkTrackingService'

describe('walkTrackingService dans Expo Go', () => {
  beforeEach(() => {
    mockStoredWalk = null
    jest.clearAllMocks()
  })

  it('utilise uniquement la permission et le suivi au premier plan', async () => {
    const active = await startOrResumeWalk(42)

    expect(active.eventId).toBe(42)
    expect(mockRequestForegroundPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(mockRequestBackgroundPermissionsAsync).not.toHaveBeenCalled()
    expect(mockWatchPositionAsync).toHaveBeenCalledTimes(1)
    expect(mockStartLocationUpdatesAsync).not.toHaveBeenCalled()
  })

  it('supprime la session distante et la reprise locale', async () => {
    await startOrResumeWalk(42)

    await deleteWalkTracking(42)

    expect(mockDeleteWalkSession).toHaveBeenCalledWith(42)
    expect(mockRemoveForegroundSubscription).toHaveBeenCalledTimes(1)
    expect(mockStoredWalk).toBeNull()
  })
})
