import Hierachy from "../Hierachy";
import { TypeNodeHierachy } from "../../interface";

describe("Hierachy class", () => {
  let rootHierachy: Hierachy = new Hierachy(null, "name", 100, TypeNodeHierachy.File);
  let childHierachy: Hierachy = new Hierachy(rootHierachy, "child", 1000, TypeNodeHierachy.Directory);

  describe("Root node", () => {
    test("Root Hierachy is null parent", () => {
      expect(rootHierachy.parent).toBeNull();
    });

    test("Hierachy contrain array children", () => {
      expect(rootHierachy.child instanceof Array).toBeTruthy();
    });

    test("Name is string", () => {
      expect(typeof rootHierachy.name == "string").toBeTruthy();
    });

    test("Storage is number", () => {
      expect(typeof rootHierachy.storage == "number").toBeTruthy();
    });

    test("Type is-a TypeNodeHierachy", () => {
      expect(rootHierachy.type).toEqual(TypeNodeHierachy.File);
    });

    test("Add 200 storage", () => {
      rootHierachy.addStorage(200);
      expect(rootHierachy.storage).toEqual(300);
    });
  });

  describe("Child node", () => {
    test("Root Hierachy is null parent", () => {
      expect(childHierachy.parent).not.toBeNull();
    });

    test("Hierachy contrain array children", () => {
      expect(childHierachy.child instanceof Array).toBeTruthy();
    });

    test("Name is string", () => {
      expect(typeof childHierachy.name == "string").toBeTruthy();
    });

    test("Storage is number", () => {
      expect(typeof childHierachy.storage == "number").toBeTruthy();
    });

    test("Type is-a TypeNodeHierachy", () => {
      expect(childHierachy.type).toEqual(TypeNodeHierachy.Directory);
    });

    test("Add 3500 storage", () => {
      childHierachy.addStorage(3500);
      expect(childHierachy.storage).toEqual(4500);
      expect(rootHierachy.storage).toEqual(3800);
    });
  });
});
