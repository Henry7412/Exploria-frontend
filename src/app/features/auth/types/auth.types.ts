export type RegisterPayload = {
  names: string;
  lastNames: string;
  emailOrPhone: string;
  password: string;
};

export type SuccessResponse<T = unknown> = {
  message?: string;
  data?: T;
  status?: string;
};

export type RegisterUserResponse = {
  _id: string;
  names: string;
  lastNames: string;
  email: string | null;
  phoneNumber: string | null;
  createdAt: string;
};

export type LoginPayload = {
  emailOrPhone: string;
  password: string;
};