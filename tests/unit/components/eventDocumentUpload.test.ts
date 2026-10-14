import { attachEventDocument, deleteEventDocument } from '../../../services/api/EventService';
import { FileService } from '../../../services/api/FileService';
import { deleteRemovedEventDocuments, uploadEventDocument, uploadPendingEventDocuments } from '../../../features/events/eventDocumentUpload';

jest.mock('../../../services/api/EventService', () => ({
  attachEventDocument: jest.fn(),
  deleteEventDocument: jest.fn(),
}));
jest.mock('../../../services/api/FileService', () => ({
  FileService: { upload: jest.fn() },
}));

const mockedUpload = FileService.upload as jest.MockedFunction<typeof FileService.upload>;
const mockedAttach = attachEventDocument as jest.MockedFunction<typeof attachEventDocument>;
const mockedDelete = deleteEventDocument as jest.MockedFunction<typeof deleteEventDocument>;

describe('event document upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpload.mockResolvedValue('stored-document.jpg');
    mockedAttach.mockResolvedValue();
    mockedDelete.mockResolvedValue();
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

  it('deletes removed files through the event endpoint after save and reports each completed deletion', async () => {
    const onDeleted = jest.fn();

    await expect(deleteRemovedEventDocuments(8, ['radio.jpg', 'ordonnance.pdf'], onDeleted))
      .resolves.toEqual(['radio.jpg', 'ordonnance.pdf']);

    expect(mockedDelete).toHaveBeenNthCalledWith(1, '8', 'radio.jpg');
    expect(mockedDelete).toHaveBeenNthCalledWith(2, '8', 'ordonnance.pdf');
    expect(onDeleted).toHaveBeenNthCalledWith(1, 'radio.jpg');
    expect(onDeleted).toHaveBeenNthCalledWith(2, 'ordonnance.pdf');
  });
});
