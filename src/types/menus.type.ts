export type MenuResponse = Menu[];

export interface Menu {
  id: string;
  name: string;
  link: string;
  icon: string;
  role: number;
}
