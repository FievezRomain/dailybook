import { useEffect, useState } from 'react';
import { FileService } from '../../../services/api/FileService';

export function useUserImageUrl(filename?: string, userId?: string) {
  const [url, setUrl] = useState<string | undefined>(() => filename && userId ? FileService.getCachedDownloadUrl(filename, 'user', userId) : undefined);
  useEffect(() => {
    if (!filename || !userId) { setUrl(undefined); return; }
    setUrl(FileService.getCachedDownloadUrl(filename, 'user', userId));
    void FileService.getDownloadUrl(filename, 'user', userId).then(setUrl).catch(() => undefined);
  }, [filename, userId]);
  return url;
}
