export type AppStage = 'intro' | 'spinning' | 'result';

export interface WheelSegment {
  id: string;
  label: string;
  sublabel?: string;
  isWinner: boolean;
  colorBg: string;
  colorText: string;
  accentColor?: string;
}
