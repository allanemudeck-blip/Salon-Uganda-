
import { Salon } from './types';

export const UGANDAN_CITIES = [
  'Kampala',
  'Entebbe',
  'Jinja',
  'Mbarara',
  'Gulu',
  'Fort Portal',
  'Arua',
  'Mbale',
  'Mukono'
];

export const MOCK_SALONS: Salon[] = [
  {
    id: '1',
    name: 'Posh Junction Salon',
    location: 'Spear House, Plot 22 Jinja Road',
    city: 'Kampala',
    category: 'Hair & Beauty',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    services: ['Haircut', 'Styling', 'Coloring']
  },
  {
    id: '2',
    name: 'The Makeover Place',
    location: 'Villa View Mall, Kyambogo',
    city: 'Kampala',
    category: 'Makeup & Hair',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    services: ['Makeup', 'Bridal', 'Facials']
  },
  {
    id: '3',
    name: 'Livara Family and Natural Hair Salon',
    location: 'Kigobe Road, Ntinda',
    city: 'Kampala',
    category: 'Natural Hair Care',
    rating: 4.9,
    imageUrl: 'https://i.postimg.cc/SxNX8tsP/83150.jpg',
    services: ['Dreadlocks', 'Natural Braiding', 'Treatment']
  },
  {
    id: '4',
    name: 'Mystique Beauty Unisex Salon',
    location: 'Nkizi Road, Wandegeya',
    city: 'Kampala',
    category: 'Unisex Grooming',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    services: ['Haircut', 'Nails', 'Massage']
  },
  {
    id: '5',
    name: 'Aisha Unisex Salon',
    location: '3 Cooper Road',
    city: 'Kampala',
    category: 'Unisex Grooming',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    services: ['Braiding', 'Men\'s Cut', 'Tinting']
  },
  {
    id: '6',
    name: 'Sparkles Salon Acacia Mall',
    location: 'First Floor, Acacia Mall',
    city: 'Kampala',
    category: 'Luxury Hair',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    services: ['Styling', 'Treatment', 'Pedicure']
  },
  {
    id: '7',
    name: 'Sparkles Salon Garden City',
    location: 'Yusuf Lule Road',
    city: 'Kampala',
    category: 'Luxury Hair',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    services: ['Premium Cut', 'Facials', 'Massage']
  },
  {
    id: '8',
    name: 'Glam Icon Salon & Spa',
    location: 'Plot 49A Naguru Drive',
    city: 'Kampala',
    category: 'Spa & Hair',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    services: ['Body Spa', 'Massage', 'Hairstyling']
  },
  {
    id: '9',
    name: 'Zziwa Hair Studio',
    location: 'Kira Road',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.6,
    imageUrl: 'https://i.postimg.cc/bJRgrtMV/83151.jpg',
    services: ['Cutting', 'Extensions', 'Perms']
  },
  {
    id: '10',
    name: 'AFROS & MO NATURAL HAIR',
    location: 'Buganda Road',
    city: 'Kampala',
    category: 'Natural Hair Care',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    services: ['Twists', 'Afro Styling', 'Deep Conditioning']
  },
  {
    id: '11',
    name: 'Swisscut',
    location: 'Lower Kololo Terrace Road',
    city: 'Kampala',
    category: 'Barber & Grooming',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    services: ['Classic Fade', 'Beard Trim', 'Grooming']
  },
  {
    id: '12',
    name: 'The Mirror Hair Studio Muyenga',
    location: 'Mitala Road, Muyenga',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    services: ['Highlights', 'Wash & Blow', 'Cornrows']
  },
  {
    id: '13',
    name: 'Beauty Arena Kampala',
    location: 'Ben Kiwanuka Street',
    city: 'Kampala',
    category: 'Hair & Nails',
    rating: 4.3,
    imageUrl: 'https://i.postimg.cc/MGpKg2wj/83147.jpg',
    services: ['Gel Polish', 'Weave On', 'Manicure']
  },
  {
    id: '14',
    name: 'Sahara Salon',
    location: '33b Upper East Naguru Road',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    services: ['Braiding', 'Hair Repair', 'Wash']
  },
  {
    id: '15',
    name: 'Urbane Beauty Salon & Spa',
    location: 'Opposite Shell, Kawempe',
    city: 'Kampala',
    category: 'Spa & Beauty',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80',
    services: ['Body Scrub', 'Facials', 'Nails']
  },
  {
    id: '16',
    name: 'Lady Charlotte Salon',
    location: 'Ben Kiwanuka Street',
    city: 'Kampala',
    category: 'Bridal & Hair',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=800&q=80',
    services: ['Bridal Package', 'Makeup', 'Wig Install']
  },
  {
    id: '17',
    name: 'Salon Ambience',
    location: 'Plot 9/10 Dewinton Road',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    services: ['Perms', 'Styling', 'Cut']
  },
  {
    id: '18',
    name: 'Pearl Salon & Bridal Centre',
    location: 'Luwuum Street',
    city: 'Kampala',
    category: 'Bridal & Hair',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80',
    services: ['Bridal Styling', 'Makeup', 'Henna']
  },
  {
    id: '19',
    name: 'Hair Creations',
    location: 'William Street (Hotel Equatoria)',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    services: ['Creative Styling', 'Extensions', 'Wash']
  },
  {
    id: '20',
    name: 'Salon Sparrows',
    location: 'Mackay Road',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80',
    services: ['Braiding', 'Cornrows', 'Tinting']
  },
  {
    id: '21',
    name: 'CIL Parlour Salon',
    location: 'Kiira Road, Kamwokya',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    services: ['Haircut', 'Style', 'Wash']
  },
  {
    id: '22',
    name: 'Salon Delight Nakulabye',
    location: 'Hoima Road, Nakulabye',
    city: 'Kampala',
    category: 'Hair Styling',
    rating: 4.2,
    imageUrl: 'https://i.postimg.cc/fbNRCt2P/83146.jpg',
    services: ['Braiding', 'Crochet', 'Cut']
  },
  {
    id: '23',
    name: 'Beauty Centre',
    location: 'Nasser Road',
    city: 'Kampala',
    category: 'Hair & Makeup',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    services: ['Bridal Makeup', 'Hair Design', 'Pedicure']
  },
  {
    id: '24',
    name: 'Bayanja Men’s Salon',
    location: 'Kampala Road, KPC Building',
    city: 'Kampala',
    category: 'Barber & Grooming',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    services: ['Men\'s Haircut', 'Shaving', 'Scalp Massage']
  }
];

export const PLATFORM_INFO = {
  supportEmail: 'allanemudeck@gmail.com',
  whatsappSupport: '+256 766 466 847',
  inquiryContact: '+256 766 466 847'
};
