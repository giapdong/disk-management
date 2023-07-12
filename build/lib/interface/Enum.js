"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareEngine = exports.ScanMode = exports.TypeNodeHierachy = void 0;
var TypeNodeHierachy;
(function (TypeNodeHierachy) {
    TypeNodeHierachy[TypeNodeHierachy["File"] = 0] = "File";
    TypeNodeHierachy[TypeNodeHierachy["Directory"] = 1] = "Directory";
})(TypeNodeHierachy = exports.TypeNodeHierachy || (exports.TypeNodeHierachy = {}));
var ScanMode;
(function (ScanMode) {
    ScanMode[ScanMode["SaveToDisk"] = 1] = "SaveToDisk";
    ScanMode[ScanMode["ReturnResult"] = 2] = "ReturnResult";
})(ScanMode = exports.ScanMode || (exports.ScanMode = {}));
var CompareEngine;
(function (CompareEngine) {
    CompareEngine[CompareEngine["JSON"] = 1] = "JSON";
    CompareEngine[CompareEngine["HTML"] = 2] = "HTML";
})(CompareEngine = exports.CompareEngine || (exports.CompareEngine = {}));
