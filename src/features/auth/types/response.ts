export interface UserShape {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  statusCode: number;
  message?: string;
  data: {
    user: UserShape;
    access_token: string;
  };
}

export interface RegisterResponse {
  statusCode: number;
  message?: string;
  data?: unknown;
}

export interface GenericResponse {
  statusCode: number;
  message?: string;
  data?: unknown;
}

export interface GetMeResponse {
  statusCode: number;
  message?: string;
  data: {
    user: UserShape;
  };
}