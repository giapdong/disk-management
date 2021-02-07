// Run command: yarn ts-node-dev system-partition.ts
// Run command: npx ts-node-dev system-partition.ts

import * as lib from "../src/lib/index";

lib.readSystemPartition().then(data => {
  console.log(data);
});
