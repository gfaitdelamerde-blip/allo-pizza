/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'classique' | 'speciale' | 'sucree';
  image: string;
}

export const PIZZAS: Pizza[] = [
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'Sauce tomate, mozzarella, basilic frais, huile d\'olive.',
    price: 10.50,
    category: 'classique',
    image: 'https://cdn.pixabay.com/photo/2024/04/21/18/44/ai-generated-8711272_1280.jpg'
  },
  {
    id: 'reine',
    name: 'Reine',
    description: 'Sauce tomate, mozzarella, jambon, champignons frais.',
    price: 12.50,
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4-fromages',
    name: '4 Fromages',
    description: 'Sauce tomate, mozzarella, chèvre, gorgonzola, emmental.',
    price: 13.50,
    category: 'classique',
    image: 'https://media.istockphoto.com/id/1309299436/fr/photo/pizza-4-fromages-sur-fond-de-b%C3%A9ton-fonc%C3%A9.jpg?s=612x612&w=0&k=20&c=qec2NUBWRc0onA-fXnzNTwzstfKpUy08UrDrDCp6ffw='
  },
  {
    id: 'orientale',
    name: 'Orientale',
    description: 'Sauce tomate, mozzarella, merguez, poivrons, œuf.',
    price: 13.00,
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'calzone',
    name: 'Calzone (Chausson)',
    description: 'Sauce tomate, mozzarella, jambon, œuf.',
    price: 12.00,
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vegetarienne',
    name: 'Végétarienne',
    description: 'Sauce tomate, mozzarella, champignons, poivrons, oignons, olives.',
    price: 11.50,
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'napolitaine',
    name: 'Napolitaine',
    description: 'Sauce tomate, mozzarella, anchois, câpres, olives.',
    price: 12.50,
    category: 'classique',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'campione',
    name: 'Campione',
    description: 'Sauce tomate, mozzarella, viande hachée, champignons, œuf.',
    price: 14.00,
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hawaienne',
    name: 'Hawaïenne',
    description: 'Sauce tomate, mozzarella, jambon, ananas.',
    price: 12.00,
    category: 'speciale',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nutella',
    name: 'Pizza Nutella',
    description: 'Base Nutella, noisettes concassées, sucre glace.',
    price: 9.00,
    category: 'sucree',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80'
  }
];
