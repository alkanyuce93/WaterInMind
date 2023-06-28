export enum TimeType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

export type IntakeType = {
  id: string;
  amount: number;
  createdAt: Date;
  unit: string;
};

export type GoalType = {
  id: string;
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  userId: string;
};
