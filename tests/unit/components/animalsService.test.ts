import httpClient from '../../../services/api/httpClient';
import { FileService } from '../../../services/api/FileService';
import { addAnimalBodyPicture, getAnimalBodyPictures, getAnimalHistory, updateAnimalHistory } from '../../../services/api/AnimalsService';

jest.mock('../../../services/api/httpClient');
jest.mock('../../../services/api/FileService', () => ({ FileService: { getDownloadUrl: jest.fn() } }));

const mockedHttp = httpClient as jest.Mocked<typeof httpClient>;
const mockedGetDownloadUrl = FileService.getDownloadUrl as jest.MockedFunction<typeof FileService.getDownloadUrl>;

describe('AnimalsService body pictures', () => {
  beforeEach(() => jest.clearAllMocks());

  it('resolves backend filenames into signed image URLs', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: [{ id: 4, idanimal: 7, filename: 'body.jpg' }] } as never);
    mockedGetDownloadUrl.mockResolvedValueOnce('https://signed.example/body.jpg');
    await expect(getAnimalBodyPictures('7')).resolves.toEqual([{ id: 4, idanimal: 7, filename: 'body.jpg', url: 'https://signed.example/body.jpg' }]);
    expect(mockedGetDownloadUrl).toHaveBeenCalledWith('body.jpg', 'animal', '7');
  });

  it('sends the JSON contract expected by the backend after upload', async () => {
    const body = { idanimal: 7, filename: 'body.jpg' };
    mockedHttp.post.mockResolvedValueOnce({ data: { id: 4, ...body } } as never);
    await addAnimalBodyPicture('7', body);
    expect(mockedHttp.post).toHaveBeenCalledWith('/animals/7/body-pictures', body);
  });

  it('loads the raw measurement history used by the animal workspace', async () => {
    const rows = [{ id: 10, idanimal: 7, value: 12.8, unity: 'kg', datemodification: '2026-08-10' }];
    mockedHttp.get.mockResolvedValueOnce({ data: rows } as never);
    await expect(getAnimalHistory('7', 'poids')).resolves.toEqual(rows);
    expect(mockedHttp.get).toHaveBeenCalledWith('/animals/7/history/poids');
  });

  it('updates one precise measurement instead of appending a duplicate', async () => {
    const body = { idAnimal: 7, item: 'poids' as const, value: 13.1, unity: 'kg', datemodification: '2026-08-10' };
    mockedHttp.put.mockResolvedValueOnce({ data: {} } as never);
    await updateAnimalHistory('7', 'poids', '10', body);
    expect(mockedHttp.put).toHaveBeenCalledWith('/animals/7/history/poids/10', body);
  });
});
