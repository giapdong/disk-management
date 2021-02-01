export function bytesToSize(bytes: number) {
  // from https://gist.github.com/lanqy/5193417
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0 || isNaN(bytes)) return "n/a";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]} (${bytes.toLocaleString()} ${sizes[0]})`;
}

export function getDateByFormat() {
  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
  let date = ("00" + now.getDate()).slice(-2);
  let hour = ("00" + now.getHours()).slice(-2);
  let minutes = ("00" + now.getMinutes()).slice(-2);
  let second = ("00" + now.getSeconds()).slice(-2);
  return `${year}-${month}-${date}_${hour}.${minutes}.${second}`;
}
