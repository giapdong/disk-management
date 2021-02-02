/**
 * Base color in project
 */
module.exports.color = {
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red"
};

/**
 * Scan mode from v0.1
 */
module.exports.ScanMode = Object.freeze({ Normal: 1, OnlyBigDirectory: 2 });

/**
 * Event type for communicate event-oriented
 */
module.exports.EventType = Object.freeze({
  ScanDone: "ScanDone",
  FilterBigDirectoryStart: "FilterBigDirectoryStart",
  FilterBigDirectoryFinish: "FilterBigDirectoryFinish",
  WriteResult: "WriteResult"
});

/**
 * Pretty unit
 *
 * @param {Number} bytes Size of folder/file with unit bytes
 */
module.exports.bytesToSize = function(bytes) {
  // from https://gist.github.com/lanqy/5193417
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]} (${bytes.toLocaleString()} ${sizes[0]})`;
};
