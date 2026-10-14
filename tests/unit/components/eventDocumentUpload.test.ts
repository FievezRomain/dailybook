import { attachEventDocument } from '../../../services/api/EventService';
import { FileService } from '../../../services/api/FileService';
import { uploadEventDocument, uploadPendingEventDocuments } from '../../../features/events/eventDocumentUpload';

jest.mock('../../../services/api/EventService', () => ({
  attachEventDocument: jest.fn(),
}));
jest.mock('../../../services/api/FileService', () => ({
  FileService: { upload: jest.fn() },
}));

const mockedUpload = FileService.upload as jest.MockedFunction<typeof FileService.upload>;
const mockedAttach = attachEventDocument as jest.MockedFunction<typeof attachEventDocument>;

describe('event document upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpload.mockResolvedValue('stored-document.jpg');
    mockedAttach.mockResolvedValue();
  });

  it('uploads a local file after the event exists, then attaches the stored filename', async () => {
    await expect(uploadEventDocument(42, {
      name: 'radio.jpg',
      localUri: 'file:///cache/radio.jpg',
      mimeType: 'image/jpeg',
      size: 1200,
    })).resolves.toBe('stored-document.jpg');

    expect(mockedUpload).toHaveBeenCalledWith(
      'file:///cache/radio.jpg',
      'radio.jpg',
      'image/jpeg',
      'event',
      42,
      1200,
    );
    expect(mockedAttach).toHaveBeenCalledWith('42', 'stored-document.jpg');
    expect(mockedUpload.mock.invocationCallOrder[0]).toBeLessThan(mockedAttach.mock.invocationCallOrder[0]);
  });

  it('only sends pending local documents during event creation or update', async () => {
    mockedUpload
      .mockResolvedValueOnce('first.pdf')
      .mockResolvedValueOnce('second.jpg');

    await expect(uploadPendingEventDocuments(8, [
      { name: 'already-saved.pdf' },
      { name: 'first.pdf', localUri: 'file:///first.pdf', mimeType: 'application/pdf', size: 900 },
      { name: 'second.jpg', localUri: 'file:///second.jpg', mimeType: 'image/jpeg', size: 700 },
    ])).resolves.toEqual(['first.pdf', 'second.jpg']);

    expect(mockedUpload).toHaveBeenCalledTimes(2);
    expect(mockedAttach).toHaveBeenNthCalledWith(1, '8', 'first.pdf');
    expect(mockedAttach).toHaveBeenNthCalledWith(2, '8', 'second.jpg');
  });

});
