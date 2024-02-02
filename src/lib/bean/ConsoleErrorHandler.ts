import ErrorHandler from "../inheritable/ErrorHandler";

export default class ConsoleErrorHandler extends ErrorHandler {
  constructor(error: Error) {
    super(error);
    this.handler();
  }

  handler(): void {
    console.log(this.error);
  }
}
