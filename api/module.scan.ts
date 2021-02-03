import { Hierachy } from "@lib/bean/node-hierachy";
import { TypeNodeHierachy } from "@root/lib/interface";

export const PI = 4.4;
export function action() {
  let hierachy: Hierachy = new Hierachy(null, "abcd", 10, TypeNodeHierachy.File);
  console.log("Action", hierachy);
}
