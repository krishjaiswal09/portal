
// Function to get file type from extension
export const getFileType = (url: string): 'audio' | 'video' | 'image' | 'document' | 'unknown' => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'];
  const fileName = url.split('/')?.pop(); // 133634666666508122.jpg_Sat...
  const fn = fileName?.split('_')[0];
  const ext = fn?.toLowerCase()?.split('.')?.pop();

  if (audioExtensions.includes(ext)) return 'audio';
  if (videoExtensions.includes(ext)) return 'video';
  if (imageExtensions.includes(ext)) return 'image';
  if (documentExtensions.includes(ext)) return 'document';

  return 'unknown';
};