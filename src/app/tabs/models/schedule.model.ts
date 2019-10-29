export interface Schedule {
  id: string;
  startTime: Date;
  endTime: Date;
  location: string;
  effectiveEndTime: Date;
  effectiveStartTime: Date;
  notes: string;
  userId: string;
}
