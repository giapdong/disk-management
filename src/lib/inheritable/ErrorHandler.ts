export default abstract class ErrorHandler {
  protected error: Error;
  constructor(error: Error) {
    this.error = error;
  }

  abstract handler(): void;
}
