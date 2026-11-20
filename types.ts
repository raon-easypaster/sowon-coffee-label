
export interface CuppingNote {
  note: string;
  degree: string; // '43-52°C' | '35-43°C' | 'Below 35°C'
}

export interface CoffeeInfo {
  specialty: string;
  kind: string;
  processing: string;
  altitude: string;
  cuppingNote: CuppingNote[];
  roastingDate: string;
  roastingStyle: string;
  country: string;
  usage?: string[];
}

export interface CountryOption {
  id: string;
  name: string;
  mapUrl: string;
  flagUrl: string;
  colors: string[];
}
