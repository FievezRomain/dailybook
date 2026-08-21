import httpClient from '../../../services/api/httpClient';
import { FileService } from '../../../services/api/FileService';

jest.mock('../../../services/api/httpClient', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../shared/utils/prepareImageUpload', () => ({
  prepareImageUpload: jest.fn(),
}));

const mockedGet = httpClient.get as jest.MockedFunction<typeof httpClient.get>;

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
});
