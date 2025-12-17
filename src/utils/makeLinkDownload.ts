export const makeLinkDownload = (url: string, filename = null) => {
  const link = document.createElement("a");
  let fn = filename || extractFile(url)
  link.href = url;
  link.download = fn; // dynamic filename
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const extractFile = (url) => {
  const fileName = url.split('/').pop(); // 133634666666508122.jpg_Sat...
  return fileName.split('_')[0];
}
