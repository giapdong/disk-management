/**
 * Base color in project
 */
module.exports.color = {
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red",
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
  WriteResult: "WriteResult",
});
