import { MenuCategory } from "@/types/menu";

export const menuData: MenuCategory[] = [
  {
    name: "Classic Cakes",
    sections: [
      {
        title: "KEILAH'S CLASSIC CAKES",
        description: "Our signature chiffon cakes made with premium ingredients",
        items: [
          {
            name: "Mango Chiffon Cake",
            emoji: "💛",
            image: "/KeilahClassics/IMG_3085.JPG",
            prices: [
              { size: "6x3", price: 650 },
              { size: "8x3", price: 900 },
              { size: "10x3", price: 1150 }
            ]
          },
          {
            name: "Ube Chiffon Cake",
            emoji: "💜",
            image: "/KeilahClassics/IMG_3083.JPG",
            prices: [
              { size: "6x3", price: 650 },
              { size: "8x3", price: 900 },
              { size: "10x3", price: 1150 }
            ]
          },
          {
            name: "Caramel Chiffon Cake",
            emoji: "🤎",
            image: "/KeilahClassics/IMG_3082.JPG",
            prices: [
              { size: "6x3", price: 650 },
              { size: "8x3", price: 900 },
              { size: "10x3", price: 1150 }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Special Packages",
    sections: [
      {
        title: "ALL IN ONE CAKE PACKAGE",
        description: "Complete celebration package including cake, number cake, and cupcakes",
        items: [
          {
            name: "Complete Package",
            description: "1tier Mini Cake 6x4 size, 1digit Number Cake, 12 Cupcakes",
            image: "/ALLINONEPACKAGE/IMG_3086.JPG",
            prices: [
              { price: 2000, details: "Starting price" }
            ]
          }
        ],
        note: "Other charges may apply depending on the desired design and flavor of the cake."
      },
      {
        title: "NUMBER CAKE",
        description: "10inches x 1.5-2inches thickness",
        items: [
          {
            name: "Single Digit",
            flavor: "Chocomoist cake",
            image: "/NumberandLetterCakes/IMG_3222.JPG",
            prices: [
              { price: 800, details: "Starting price" }
            ]
          },
          {
            name: "Double Digits",
            flavor: "Chocomoist cake",
            image: "/NumberandLetterCakes/IMG_3220.JPG",
            prices: [
              { price: 1500, details: "Starting price" }
            ]
          }
        ],
        note: "Starting prices only. Other charges may apply depending on the complexity of your desired design. WE ONLY USE SOFT ICING and photoprint non-edible/edible cake toppers or fondant details upon request."
      }
    ]
  },
  {
    name: "Customized Cakes",
    sections: [
      {
        title: "CUSTOMIZED/THEMED CAKE",
        items: [
          {
            name: "Mini Tier",
            flavor: "Chocomoist cake/Mango Chiffon/Ube Chiffon",
            image: "/CustomizedCakes/1TierCakes/IMG_3104.JPG",
            prices: [
              { size: "6x4", price: 1000, details: "1 tier mini cake only" },
              { size: "6x4", price: 1400, details: "1 tier mini cake with 12 cupcakes" }
            ]
          },
          {
            name: "Medium Tier",
            flavor: "Chocomoist cake/Mango Chiffon/Ube Chiffon",
            image: "/CustomizedCakes/1TierCakes/IMG_3115.JPG",
            prices: [
              { size: "7x4", price: 1400, details: "1 tier cake only" },
              { size: "7x4", price: 1800, details: "1 tier cake with 12 cupcakes" }
            ]
          },
          {
            name: "Large Tier",
            flavor: "Chocomoist cake/Mango Chiffon/Ube Chiffon",
            image: "/CustomizedCakes/1TierCakes/IMG_3127.JPG",
            prices: [
              { size: "7x6", price: 1800, details: "1 tier cake only" },
              { size: "7x6", price: 2200, details: "1 tier cake with 12 cupcakes" }
            ]
          },
          {
            name: "Two Tier",
            flavor: "Chocomoist cake/Mango Chiffon/Ube Chiffon",
            description: "Size: 6x4 top, 8x4 base",
            image: "/CustomizedCakes/2TierCakes/IMG_3235.JPG",
            prices: [
              { price: 2800, details: "2 tier cake only" },
              { price: 3200, details: "2 tier cake with 12 cupcakes" }
            ]
          },
          {
            name: "Three Tier",
            flavor: "Chocomoist cake/Mango Chiffon/Ube Chiffon",
            description: "Size: 4x4 top, 6x4 middle, 8x4 base",
            image: "/CustomizedCakes/3TierCakes/IMG_3168.JPG",
            prices: [
              { price: 3200, details: "3 tier cake only" },
              { price: 3600, details: "3 tier cake with 12 cupcakes" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Cup Desserts",
    sections: [
      {
        title: "CAKE IN A CUP",
        items: [
          {
            name: "Chococaramel",
            emoji: "🤎",
            image: "/CakeinCups/IMG_3242.JPG",
            prices: [{ price: 120 }]
          },
          {
            name: "Mango",
            emoji: "💛",
            image: "/CakeinCups/IMG_3123.JPG",
            prices: [{ price: 135 }]
          },
          {
            name: "Ube de Leche",
            emoji: "💜",
            image: "/CakeinCups/IMG_3122.JPG",
            prices: [{ price: 140 }]
          }
        ]
      }
    ]
  }
];
