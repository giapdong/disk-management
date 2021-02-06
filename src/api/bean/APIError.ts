export class APIError extends Error {
  data: any;

  constructor(data: any) {
    super();
    this.data = data;
  }
}
