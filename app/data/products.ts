import { Product, ProductCategory } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Astronaut Daily Suit',
    description: 'Comfortable and stylish everyday wear inspired by real space suits. Perfect for casual occasions.',
    price: 199.99,
    category: 'Space Suits',
    imageUrl: '/products/astronaut-daily.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    features: [
      'Breathable material',
      'Temperature regulation',
      'UV protection',
      'Multiple pockets'
    ]
  },
  {
    id: '2',
    name: 'Galaxy Print Hoodie',
    description: 'A cozy hoodie featuring a stunning galaxy print. Made from recycled materials.',
    price: 79.99,
    category: 'Cosmic Casual',
    imageUrl: '/products/galaxy-hoodie.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    features: [
      'Eco-friendly material',
      'Glow-in-the-dark details',
      'Kangaroo pocket',
      'Adjustable hood'
    ]
  },
  {
    id: '3',
    name: 'Meteor Shower Scarf',
    description: 'An elegant scarf with a meteor shower pattern. Perfect for any celestial occasion.',
    price: 34.99,
    category: 'Galactic Accessories',
    imageUrl: '/products/meteor-scarf.jpg',
    sizes: ['M'],
    inStock: true,
    features: [
      'Lightweight fabric',
      'Shimmering details',
      'Versatile styling options'
    ]
  },
  {
    id: '4',
    name: 'Constellation T-Shirt',
    description: 'A comfortable t-shirt featuring real constellation patterns that glow in the dark.',
    price: 49.99,
    category: 'Cosmic Casual',
    imageUrl: '/products/constellation-tee.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    features: [
      'Organic cotton',
      'Glow-in-the-dark constellations',
      'Comfortable fit'
    ]
  },
  {
    id: '5',
    name: 'Space Explorer Backpack',
    description: 'A durable and spacious backpack designed for the modern space explorer.',
    price: 89.99,
    category: 'Galactic Accessories',
    imageUrl: '/products/explorer-backpack.jpg',
    sizes: ['M'],
    inStock: true,
    features: [
      'Water-resistant material',
      'Multiple compartments',
      'Laptop sleeve',
      'Hidden pockets'
    ]
  },
  {
    id: '6',
    name: 'Quantum Light Jacket',
    description: 'A lightweight jacket with fiber-optic details that create a stunning light display.',
    price: 299.99,
    category: 'Space Suits',
    imageUrl: '/products/quantum-jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    features: [
      'Fiber-optic lighting',
      'Water-resistant',
      'Rechargeable battery',
      'Machine washable'
    ]
  }
];