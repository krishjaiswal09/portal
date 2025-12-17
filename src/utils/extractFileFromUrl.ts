export const extractFile = (url) => {
  const fileName = url.split('/').pop(); // 133634666666508122.jpg_Sat...
  return fileName.split('_')[0];
}