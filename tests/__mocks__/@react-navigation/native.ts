export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  reset: jest.fn(),
}));

export const useRoute = jest.fn(() => ({ params: {} }));
export const useIsFocused = jest.fn(() => true);
export const NavigationContainer = ({ children }: { children: any }) => children;
export const createNavigationContainerRef = jest.fn(() => ({ current: null }));
