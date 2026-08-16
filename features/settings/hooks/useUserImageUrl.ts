import { useEffect, useState } from 'react';
import { FileService } from '../../../services/api/FileService';

export function useUserImageUrl(filename?: string, userId?: string) {
  const [url, setUrl] = useState<string>();
  useEffect(() => { setUrl(undefined); if (filename && userId) void FileService.getDownloadUrl(filename, 'user', userId).then(setUrl).catch(() => undefined); }, [filename, userId]);
  return url;
}
