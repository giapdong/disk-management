/**
 * @extends Error
 */
export default class DiskError extends Error {
  [s: string]: any;

  constructor(error: any) {
    super(error.message);
    this.name = this.constructor.name;
    this.message = error.message;
    this.expandErrorProperty(error);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    if (Error.captureStackTrace) Error.captureStackTrace(this, DiskError);
  }

  private expandErrorProperty(error: any): void {
    const errorKeys = Object.keys(error).filter(key => key != "message");
    errorKeys.forEach((key: string) => (this[key] = error[key]));
  }

  logToConsole(): void {
    console.log(this);
  }
}
