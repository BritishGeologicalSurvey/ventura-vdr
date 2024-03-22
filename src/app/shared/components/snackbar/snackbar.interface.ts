export enum NotificationType {
  INFORMATION = 'information',
  NEGATIVE = 'negative',
  POSITIVE = 'positive',
}
export interface ISnackbar {
  title: string;
  type: NotificationType;
  duration: number;
  panelClass: string;
}
