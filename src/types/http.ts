export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export class ApiRequestError extends Error {
  httpStatus: number;
  businessCode: number;

  constructor(message: string, httpStatus: number, businessCode: number) {
    super(message);
    this.name = "ApiRequestError";
    this.httpStatus = httpStatus;
    this.businessCode = businessCode;
  }
}
