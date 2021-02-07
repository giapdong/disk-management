// Run command: yarn ts-node-dev lib-example.ts
// Run command: npx ts-node-dev lib-example.ts

import * as lib from "../src/lib/index";
import path from "path";

lib.Scan(path.join(__dirname, ".."), 1000);
// lib.Compare(10000);
