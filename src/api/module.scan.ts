import { Hierachy } from "@disk/lib/node_modules/@disk/lib/bean/node-hierachy";
import { TypeNodeHierachy } from "@disk/lib/node_modules/@disk/lib/interface";

export const PI = 4.4;
export function action() {
  let hierachy: Hierachy = new Hierachy(null, "abcd", 10, TypeNodeHierachy.File);
  console.log("Action", hierachy);
}
