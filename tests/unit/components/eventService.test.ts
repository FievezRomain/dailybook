import httpClient from '../../../services/api/httpClient';
import { getEventDocumentUrl } from '../../../services/api/EventService';

jest.mock('../../../services/api/httpClient', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mockedGet = httpClient.get as jest.MockedFunction<typeof httpClient.get>;

describe('EventService documents', () => {
  beforeEach(() => jest.clearAllMocks());

  it('extrait et retourne l’URL signée fournie par le backend', async () => {
    mockedGet.mockResolvedValue({ data: { url: 'https://signed.example/document.png' } } as never);

    await expect(getEventDocumentUrl('12', 'radio image.png')).resolves.toBe('https://signed.example/document.png');
    expect(mockedGet).toHaveBeenCalledWith('/events/12/documents/radio%20image.png');
  });

  it('rejette une réponse sans URL exploitable', async () => {
    mockedGet.mockResolvedValue({ data: {} } as never);
    await expect(getEventDocumentUrl('12', 'radio.png')).rejects.toThrow('URL de document invalide.');
  });
});
