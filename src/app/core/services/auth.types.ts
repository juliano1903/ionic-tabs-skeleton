import { Contract } from 'src/app/tabs/models/contract.model';

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
  contracts: any;
  papExpirationDate: string;
  papUpdatedDate: string;
  papStatus?: string;
  notificationToken?:string; 
}

export interface AuthOptions {
  isSignIn: boolean;
  provider: AuthProvider;
  user: User;
}
