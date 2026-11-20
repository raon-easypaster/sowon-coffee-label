
import { CountryOption, CoffeeInfo } from './types';

export const COUNTRIES: CountryOption[] = [
  { 
    id: 'colombia', 
    name: 'Colombia', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag-map_of_Colombia.svg',
    flagUrl: 'https://flagcdn.com/w320/co.png',
    colors: ['#FCD116', '#003893', '#CE1126']
  },
  { 
    id: 'ethiopia', 
    name: 'Ethiopia', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flag-map_of_Ethiopia.svg',
    flagUrl: 'https://flagcdn.com/w320/et.png',
    colors: ['#078930', '#FCD116', '#CE1126']
  },
  { 
    id: 'brazil', 
    name: 'Brazil', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag-map_of_Brazil.svg',
    flagUrl: 'https://flagcdn.com/w320/br.png',
    colors: ['#009739', '#FEDD00', '#012169']
  },
  { 
    id: 'guatemala', 
    name: 'Guatemala', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Flag-map_of_Guatemala.svg',
    flagUrl: 'https://flagcdn.com/w320/gt.png',
    colors: ['#4997D0', '#FFFFFF', '#4997D0']
  },
  { 
    id: 'kenya', 
    name: 'Kenya', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag-map_of_Kenya.svg',
    flagUrl: 'https://flagcdn.com/w320/ke.png',
    colors: ['#000000', '#BB0000', '#006600']
  },
  { 
    id: 'indonesia', 
    name: 'Indonesia', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag-map_of_Indonesia.svg',
    flagUrl: 'https://flagcdn.com/w320/id.png',
    colors: ['#CE1126', '#FFFFFF']
  },
  { 
    id: 'costarica', 
    name: 'Costa Rica', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Flag-map_of_Costa_Rica.svg',
    flagUrl: 'https://flagcdn.com/w320/cr.png',
    colors: ['#002B7F', '#FFFFFF', '#CE1126']
  },
  { 
    id: 'vietnam', 
    name: 'Vietnam', 
    mapUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag-map_of_Vietnam.svg',
    flagUrl: 'https://flagcdn.com/w320/vn.png',
    colors: ['#DA251D', '#FFFF00']
  },
  { 
    id: 'panama', 
    name: 'Panama', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/pa.png',
    colors: ['#005293', '#FFFFFF', '#D21034']
  },
  { 
    id: 'honduras', 
    name: 'Honduras', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/hn.png',
    colors: ['#0073CF', '#FFFFFF', '#0073CF']
  },
  { 
    id: 'elsalvador', 
    name: 'El Salvador', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/sv.png',
    colors: ['#0047AB', '#FFFFFF', '#0047AB']
  },
  { 
    id: 'nicaragua', 
    name: 'Nicaragua', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/ni.png',
    colors: ['#0067C6', '#FFFFFF', '#0067C6']
  },
  { 
    id: 'peru', 
    name: 'Peru', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/pe.png',
    colors: ['#D91023', '#FFFFFF', '#D91023']
  },
  { 
    id: 'tanzania', 
    name: 'Tanzania', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/tz.png',
    colors: ['#1EB53A', '#FCD116', '#000000', '#00A3E0']
  },
  { 
    id: 'brundi', 
    name: 'Brundi', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/bi.png',
    colors: ['#CE1126', '#FFFFFF', '#1EB53A']
  },
  { 
    id: 'rwanda', 
    name: 'Rwanda', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/rw.png',
    colors: ['#00A1DE', '#FAD201', '#20603D']
  },
  { 
    id: 'kongo', 
    name: 'Kongo (DRC)', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/cd.png',
    colors: ['#007FFF', '#F7D417', '#CE1126']
  },
  { 
    id: 'china', 
    name: 'China', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/cn.png',
    colors: ['#EE1C25', '#FFFF00']
  },
  { 
    id: 'india', 
    name: 'India', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/in.png',
    colors: ['#FF9933', '#FFFFFF', '#138808']
  },
  { 
    id: 'thailand', 
    name: 'Thailand', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/th.png',
    colors: ['#A51931', '#F4F5F8', '#2D2A4A']
  },
  { 
    id: 'laos', 
    name: 'Laos', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/la.png',
    colors: ['#CE1126', '#002868', '#CE1126']
  },
  { 
    id: 'myanmar', 
    name: 'Myanmar', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/mm.png',
    colors: ['#FECB00', '#34B233', '#EA2839']
  },
  { 
    id: 'mexico', 
    name: 'Mexico', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/mx.png',
    colors: ['#006847', '#FFFFFF', '#CE1126']
  },
  { 
    id: 'uganda', 
    name: 'Uganda', 
    mapUrl: '',
    flagUrl: 'https://flagcdn.com/w320/ug.png',
    colors: ['#000000', '#FCD116', '#CE1126']
  }
];

export const ROASTING_STYLES = Array.from({ length: 61 }, (_, i) => `#${50 + i}`);

export const ROASTING_DEGREES = [
  '43-52°C',
  '35-42°C',
  'Below 35°C'
];

export const VARIETALS = [
  'Typica',
  'Bourbon',
  'Caturra',
  'Catuai',
  'Catimor',
  'Castillo',
  'Geisha',
  'Pacamara',
  'SL24.28',
  'Heirloom',
  '74158',
  '74110',
  '74112',
  'dere132',
  'Mundo Novo',
  'Maragogype',
  'Pacas',
  "Catu's",
  'Parainema',
  'Sarchimor',
  'Sudan Rume',
  'Blend'
];

export const PROCESSINGS = [
  'Natural',
  'Washed',
  'Honey',
  'Wet-Hulled',
  'Anaerobic Natural',
  'Anaerobic Washed',
  'Carbonic Maceration',
  'Fruit Fermentation',
  'Yeast Fermentation',
  'Infused',
  'EA Decaffein',
  'SW Decaffein'
];

export const ALTITUDES: string[] = [];

export const CUPPING_NOTE_CATEGORIES = {
  Floral: ['jasmin', 'lily', 'lavender', 'coffee blossom', 'osmanthus', 'passion flower', 'freesia', 'cherry blossom', 'orange blossom', 'cotton blossom', 'chamomile', 'white flower'],
  Acidity: ['bright citrus', 'lemon', 'lime', 'pineapple', 'apricot', 'peach', 'pear', 'fig', 'red apple', 'green apple', 'grape', 'green grape', 'shine muscat', 'grapefruit', 'pomelo', 'passionfruit', 'raspberry', 'strawberry', 'wild strawberry', 'blueberry', 'black currant', 'quince', 'mango', 'orange', 'red orange', 'tangerine', 'green tangerine', 'plum', 'dark plum', 'cherry', 'cranberry', 'tropical', 'yogurt'],
  Sweetness: ['brown sugar', 'honey', 'molasses', 'caramel', 'maple syrup', 'milk chocolate', 'chocolate', 'dark chocolate', 'cocoa', 'acacia', 'vanilla'],
  Herbal: ['Bergamot', 'Lemongrass', 'glass', 'pepper', 'rooibos', 'cinnamon', 'rosemary', 'verbena', 'lemon thyme'],
  Alcohol: ['whisky', 'sherry whiskey', 'white wine', 'red wine', 'white rum'],
  Tea: ['Black tea', 'Red tea', 'Green tea', 'White tea', 'Hibiscus', 'Darjeeling', 'Jasmine tea'],
  Nutty: ['Almond', 'Hazelnut', 'Walnut', 'Peanut', 'Cashew', 'Pecan', 'Chestnut'],
  Texture: ['silky', 'milky', 'jam', 'syrup', 'juicy', 'candy']
};

export const USAGES = ['Brewing', 'Espresso'];

export const INITIAL_COFFEE: CoffeeInfo = {
  specialty: '',
  kind: '',
  processing: '',
  altitude: '',
  cuppingNote: [],
  roastingDate: '',
  roastingStyle: '',
  country: '',
  usage: []
};
