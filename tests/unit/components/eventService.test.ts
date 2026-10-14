import { getEventDocumentUrl } from '../../../services/api/EventService';
import { FileService } from '../../../services/api/FileService';

jest.mock('../../../services/api/FileService', () => ({
  FileService: { getDownloadUrl: jest.fn() },
  fileDownloadKey: jest.fn(),
}));

const mockedGetDownloadUrl = FileService.getDownloadUrl as jest.MockedFunction<typeof FileService.getDownloadUrl>;

describe('EventService documents', () => {
  beforeEach(() => jest.clearAllMocks());

  it('délègue la récupération de l’URL signée au service de fichiers', async () => {
    mockedGetDownloadUrl.mockResolvedValue('https://signed.example/document.png');

    await expect(getEventDocumentUrl('12', 'radio image.png')).resolves.toBe('https://signed.example/document.png');
    expect(mockedGetDownloadUrl).toHaveBeenCalledWith('radio image.png', 'event', '12');
  });

  it('propage une erreur de récupération d’URL', async () => {
    mockedGetDownloadUrl.mockRejectedValue(new Error('URL de document invalide.'));
    await expect(getEventDocumentUrl('12', 'radio.png')).rejects.toThrow('URL de document invalide.');
  });
});
