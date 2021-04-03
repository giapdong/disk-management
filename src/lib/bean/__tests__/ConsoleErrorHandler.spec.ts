import ConsoleErrorHandler from "../ConsoleErrorHandler";
import ErrorHandler from "../../inheritable/ErrorHandler";

describe("ConsoleErrorHandler class", () => {
  test("ConsoleErrorHandler instance of ErrorHandler", () => {
    expect(new ConsoleErrorHandler(new Error()) instanceof ErrorHandler).toBeTruthy();
  });
});
