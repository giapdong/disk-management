export function bytesToSize(bytes: number) {
  // from https://gist.github.com/lanqy/5193417
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0 || isNaN(bytes)) return "n/a";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]} (${bytes.toLocaleString()} ${sizes[0]})`;
}
