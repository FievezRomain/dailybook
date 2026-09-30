export const FileSystemUploadType = { MULTIPART: 1 } as const;
export const documentDirectory = 'file:///documents/';
export const cacheDirectory = 'file:///cache/';

export const uploadAsync = jest.fn();
export const downloadAsync = jest.fn();
export const getInfoAsync = jest.fn();
export const makeDirectoryAsync = jest.fn();
export const deleteAsync = jest.fn();
