export enum AuthProvider {
  Email,
  Facebook
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  country: string;
  picture: string;
  reg: string;
  phone: string;
  birth: string;
  specialties: Array<string>;
}

export interface AuthOptions {
  isSignIn: boolean;
  provider: AuthProvider;
  user: User;
}
