import * as lib from "../lib/_index";
import path from "path";

lib.Scan(path.join(__dirname, ".."), 1000);
// lib.Compare(10000);