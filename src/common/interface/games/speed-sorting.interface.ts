export type ISpeedSortingTimerMode = 'NONE' | 'COUNT_UP' | 'COUNT_DOWN';

export interface ISpeedSortingCategory {
  id: string;
  name: string;
}

export interface ISpeedSortingItem {
  id: string;
  text: string;
  category_id: string;
}

export interface ISpeedSortingJson {
  show_score_at_end: boolean;

  categories: ISpeedSortingCategory[];
  items: ISpeedSortingItem[];
}
