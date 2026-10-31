export interface Scene {
  id: string;
  name: string;
  duration: number;
  thumbnail: string;
  status: 'good' | 'bad';
  format: string;
  hasLogo: boolean;
}

export type EditingTool = 'trim' | 'format' | 'audio' | 'subtitles' | 'logo' | 'sfx';

export interface ToolAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  applied: boolean;
}
