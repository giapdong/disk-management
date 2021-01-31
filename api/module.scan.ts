import { Hierachy } from "@lib/bean/NodeHierachy";
import { TypeNodeHierachy } from "@root/index";

export const PI = 4.4;
export function action() {
  let hierachy: Hierachy = new Hierachy(null, "abcd", 10, TypeNodeHierachy.File);
  console.log("Action", hierachy);
}
