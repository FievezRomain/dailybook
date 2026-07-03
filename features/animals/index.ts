// Animals feature — public API
export { default as AnimalDetailScreen } from './screens/AnimalDetailScreen';
export { default as AnimalAddWizardScreen } from './screens/AnimalAddWizardScreen';
export { default as PetsScreen } from './screens/PetsScreen';
export { default as FirstPageAddAnimalScreen } from './screens/FirstPageAddAnimalScreen';

export { default as AnimalCard } from './components/AnimalCard';
export { default as AnimalBody } from './components/AnimalBody';
export { default as InformationsAnimals } from './components/InformationsAnimals';
export { default as MedicalBook } from './components/MedicalBook';
export { default as ModalAnimal } from './components/ModalAnimal';
export { default as ModalSelectAnimals } from './components/ModalSelectAnimals';
export { default as AnimalImageCarousel } from './components/AnimalImageCarousel';

export { useAnimalForm } from './hooks/useAnimalForm';

export type { CreateAnimalPayload, UpdateAnimalPayload, ActionType } from './types';
