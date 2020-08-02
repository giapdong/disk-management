module.exports.color = {
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red",
};

module.exports.ScanMode = Object.freeze({ Normal: 1, OnlyBigDirectory: 2 });

module.exports.EventType = Object.freeze({
  ScanDone: "ScanDone",
  FilterBigDirectoryStart: "FilterBigDirectoryStart",
  FilterBigDirectoryFinish: "FilterBigDirectoryFinish",
  WriteResult: "WriteResult",
});
