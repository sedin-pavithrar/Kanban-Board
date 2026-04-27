export interface Task {
  id: string;
  title: string;
  columnId: string;
  timeSpent: {
    [columnId: string]: number;
  };
  enteredAt: number;
}