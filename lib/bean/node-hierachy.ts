import { TypeNodeHierachy } from "@disk/lib/interface";

export class Hierachy {
  parent: Hierachy | null;
  name: string;
  storage: number;
  type: TypeNodeHierachy;
  child: Array<any>;

  constructor(parent: Hierachy | null, name: string, storage: number, type: TypeNodeHierachy) {
    this.parent = parent;
    this.name = name;
    this.storage = storage;
    this.type = type;
    this.child = [];
  }

  addStorage(value: number) {
    this.storage += value;
    if (this.parent) this.parent.addStorage(value);
  }
}
