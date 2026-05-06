export type RestaurantSeed = {
  id: string;
  name: string;
  description: string;
  rating: number;
  deliveryFee: number;
  eta: string;
  distance: string;
  imageUrl: string;
  cuisines: string[];
};

export type ProductSeed = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isPopular?: boolean;
  isSpicy?: boolean;
};

export const restaurantsSeed: RestaurantSeed[] = [
  {
    id: 'rest_1',
    name: 'Mama Put Kitchen',
    description: 'Authentic Nigerian classics and smoky jollof.',
    rating: 4.8,
    deliveryFee: 2.49,
    eta: '20-30 mins',
    distance: '1.2 miles',
    imageUrl:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80',
    cuisines: ['Nigerian', 'Jollof', 'Suya'],
  },
  {
    id: 'rest_2',
    name: 'Lalibela Flavors',
    description: 'Ethiopian bowls, injera platters, and vegan options.',
    rating: 4.9,
    deliveryFee: 1.99,
    eta: '35-45 mins',
    distance: '2.5 miles',
    imageUrl:
      'https://images.unsplash.com/photo-1634586450650-8446daaeabdb?w=800&q=80',
    cuisines: ['Ethiopian', 'Injera', 'Vegan'],
  },
];

export const productsSeed: ProductSeed[] = [
  {
    id: 'prod_1',
    restaurantId: 'rest_1',
    name: 'Classic Jollof Rice & Chicken',
    description: 'Smoky jollof rice, grilled chicken, and fried plantain.',
    price: 14.5,
    imageUrl:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&q=80',
    isPopular: true,
  },
  {
    id: 'prod_2',
    restaurantId: 'rest_1',
    name: 'Egusi Soup & Pounded Yam',
    description: 'Rich melon seed soup with assorted meats and spinach.',
    price: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1629853924376-79ba5791c13d?w=500&q=80',
  },
  {
    id: 'prod_3',
    restaurantId: 'rest_1',
    name: 'Beef Suya Platter',
    description: 'Spicy grilled beef with peanut spice blend.',
    price: 12.5,
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
    isSpicy: true,
  },
  {
    id: 'prod_4',
    restaurantId: 'rest_2',
    name: 'Doro Wat Combo',
    description: 'Berbere chicken stew with injera and sides.',
    price: 15.75,
    imageUrl:
      'https://images.unsplash.com/photo-1634586450650-8446daaeabdb?w=500&q=80',
  },
];
