import { Schedule } from './schedule.model';

export interface Contract {
  disabled: boolean;
  hospitalId: string;
  name: string;
  price: number;
  specialty: string;
  schedules?: Array<Schedule>;
  predictedValue?: number;
  receivedValue?: number;
}
