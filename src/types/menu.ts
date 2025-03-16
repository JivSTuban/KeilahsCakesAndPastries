export interface MenuItem {
  name: string;
  description?: string;
  emoji?: string;
  flavor?: string;
  prices: {
    size?: string;
    price: number;
    details?: string;
  }[];
  image?: string; // Single representative image for the menu item
}

export interface MenuCategory {
  name: string;
  sections: MenuSection[];
}

export interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
  note?: string;
}
