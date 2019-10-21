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
  pictureURL: string;
  register: string;
  phone: string;
}

export interface AuthOptions {
  isSignIn: boolean;
  provider: AuthProvider;
  user: User;
}
