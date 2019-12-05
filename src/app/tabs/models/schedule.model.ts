export interface Schedule {
  id: string;
  startTime: Date;
  endTime: Date;
  location: string;
  adjustedEndTime?: string;
  adjustedStartTime?: string;
  notes: string;
  userId: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  receivedAmount?: number;
  predictedAmount?: number;
  disabled: boolean;
  userName?: string;
  checkIn?: string;
  checkOut?: string;
  price?: number;
  dismissRequested?: boolean;
  adjustedStartTimeStatus?: string;
  adjustedEndTimeStatus?: string;
}
