import httpClient from '../../../services/api/httpClient';
import { FileService } from '../../../services/api/FileService';
import * as FileSystem from 'expo-file-system/legacy';
import { prepareImageUpload } from '../../../shared/utils/prepareImageUpload';

jest.mock('../../../services/api/httpClient', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../shared/utils/prepareImageUpload', () => ({
  prepareImageUpload: jest.fn(),
}));
jest.mock('expo-file-system/legacy', () => ({
  FileSystemUploadType: { MULTIPART: 1 },
  uploadAsync: jest.fn(),
}));

const mockedGet = httpClient.get as jest.MockedFunction<typeof httpClient.get>;
const mockedPost = httpClient.post as jest.MockedFunction<typeof httpClient.post>;
const mockedPrepareImage = prepareImageUpload as jest.MockedFunction<typeof prepareImageUpload>;
const mockedUploadAsync = FileSystem.uploadAsync as jest.MockedFunction<typeof FileSystem.uploadAsync>;

describe('FileService download URL cache', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shares one backend request for concurrent and repeated reads', async () => {
    mockedGet.mockResolvedValue({ data: { url: 'https://signed.example/animal' } } as never);

    const first = FileService.getDownloadUrl('photo.jpg', 'animal', 42);
    const second = FileService.getDownloadUrl('photo.jpg', 'animal', 42);

    await expect(Promise.all([first, second])).resolves.toEqual([
      'https://signed.example/animal',
      'https://signed.example/animal',
    ]);
    await expect(FileService.getDownloadUrl('photo.jpg', 'animal', 42)).resolves.toBe('https://signed.example/animal');
    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(FileService.getCachedDownloadUrl('photo.jpg', 'animal', 42)).toBe('https://signed.example/animal');
  });

  it('uploads local images with the native multipart implementation', async () => {
    mockedPrepareImage.mockResolvedValue({ uri: 'file:///cache/photo.jpg', contentType: 'image/jpeg', sizeBytes: 1200 });
    mockedPost
      .mockResolvedValueOnce({ data: { url: 'https://bucket.example', fields: { key: 'uid/photo.jpg', policy: 'signed' }, filename: 'photo.jpg', s3Path: 'uid/photo.jpg', expiresIn: 300 } } as never)
      .mockResolvedValueOnce({ data: { filename: 'photo.jpg' } } as never);
    mockedUploadAsync.mockResolvedValue({ status: 204, headers: {}, body: '', mimeType: 'application/xml' });

    await expect(FileService.upload('file:///picker/original.heic', 'original.heic', 'image/heic', 'animal', 42)).resolves.toBe('photo.jpg');

    expect(mockedUploadAsync).toHaveBeenCalledWith('https://bucket.example', 'file:///cache/photo.jpg', {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: 'image/jpeg',
      parameters: { key: 'uid/photo.jpg', policy: 'signed' },
    });
    expect(mockedPost).toHaveBeenLastCalledWith('/files/upload-complete', {
      filename: 'photo.jpg',
      ressourceType: 'animal',
      ressourceId: 42,
      contentType: 'image/jpeg',
    });
  });
});
