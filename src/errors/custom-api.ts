export default class CustomAPIError extends Error {
  public statusCode?: number;
  constructor(message: string) {
    super(message);
    // maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
