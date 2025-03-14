export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  images?: string[];
  options?: {
    label: string;
    values: string[];
  }[];
}

export interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
  note?: string;
}
