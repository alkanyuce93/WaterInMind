export enum TimeType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

export type UsersType = {
  id: string;
  amount: number;
  createdAt: Date;
  unit: string;
};
