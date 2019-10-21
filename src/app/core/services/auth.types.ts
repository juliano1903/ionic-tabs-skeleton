export enum AuthProvider {
  Email,
  Facebook
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  addres: string;
  city: string;
  state: string;
  pictureURL: string;
  register: string;
}

export interface AuthOptions {
  isSignIn: boolean;
  provider: AuthProvider;
  user: User;
}
