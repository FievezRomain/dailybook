import { createContext, useContext, type ReactNode } from 'react';

const FormSheetInputContext = createContext(false);

export function FormSheetInputProvider({ children }: { children: ReactNode }) {
  return <FormSheetInputContext.Provider value>{children}</FormSheetInputContext.Provider>;
}

export function useFormSheetInput() {
  return useContext(FormSheetInputContext);
}
