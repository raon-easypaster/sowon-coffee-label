
import React from 'react';
import { CoffeeInfo } from '../types';
import { COUNTRIES } from '../constants';
import { ArrowUpRight } from 'lucide-react';

interface PreviewCardProps {
  info: CoffeeInfo;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ info }) => {
  const selectedCountryIds = info.country.split(',').map(s => s.trim().toLowerCase());
  const selectedCountries = COUNTRIES.filter(c => selectedCountryIds.includes(c.id.toLowerCase()));
  
  // If no predefined countries match, use the raw text
  const countryDisplayName = selectedCountries.length > 0 
    ? selectedCountries.map(c => c.name.split(' (')[0].toUpperCase()).join(' & ')
    : (info.country || '').toUpperCase();

  // Combine unique colors from all selected countries for a cleaner mix
  const allColors = selectedCountries.length > 0 
    ? Array.from(new Set(selectedCountries.flatMap(c => c.colors)))
    : ['#2D2926', '#8E9299'];

  // Generate a more harmonious "mesh" background if multiple colors exist
  const getMixedBackground = () => {
    if (allColors.length === 0) return '#CE1126';
    if (allColors.length === 1) return allColors[0];
    
    // Create a layered radial gradient effect for a "mixed" organic look
    const baseColor = allColors[0];
    const meshGradients = allColors.slice(1).map((color, i) => {
      const positions = [
        '80% 20%', '20% 80%', '10% 10%', '90% 90%', 
        '50% 10%', '50% 90%', '10% 50%', '90% 50%'
      ];
      const pos = positions[i % positions.length];
      const size = 60 + (i * 10) % 40; // Varying sizes for more organic feel
      return `radial-gradient(circle at ${pos}, ${color} 0%, transparent ${size}%)`;
    });
    
    return `${meshGradients.join(', ')}, ${baseColor}`;
  };

  // Format date: Extract only figures & date characters (e.g. 2026.06.18 -> 2026.06.18)
  const getCleanDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Replace Korean date terms with dots
    let cleaned = dateStr
      .replace(/년/g, '.')
      .replace(/월/g, '.')
      .replace(/일/g, '')
      .replace(/[^0-9.\-/]/g, '') // Keep digits, dots, hyphens, and slashes
      .trim();

    // Collapse multiple consecutive separators
    cleaned = cleaned.replace(/\.+/g, '.')
                     .replace(/-+/g, '-')
                     .replace(/\/+/g, '/');

    // Remove single trailing separator
    cleaned = cleaned.replace(/[.\-/]+$/g, '');

    return cleaned;
  };

  return (
    <div className="w-[1125px] h-[750px] bg-white flex flex-row relative select-none shadow-2xl overflow-hidden rounded-none border border-gray-100 font-sans">
      {/* Left Column: Brand & Country Identity (reduced width to 260px) */}
      <div className="w-[260px] h-full bg-[#2D2926] rounded-none flex flex-col justify-between px-6 py-12 relative select-none items-center">
        {/* Top/Middle Container for Country & Ground Color */}
        <div className="flex flex-col items-center gap-6 w-full mt-4">
          {/* Country Origin Pill with Map Overlay */}
          <div 
            className="relative h-[200px] w-full flex overflow-hidden rounded-[40px] shadow-lg"
            style={{ 
              background: getMixedBackground()
            }}
          >
            {/* Map Background Overlay */}
            {selectedCountries.length === 1 && selectedCountries[0].mapUrl && (
              <img 
                src={selectedCountries[0].mapUrl} 
                alt="map" 
                className="absolute right-[-10%] top-[-10%] w-[160px] h-[160px] object-contain opacity-30 mix-blend-overlay grayscale brightness-150"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
              <h3 className={`${selectedCountryIds.length > 2 ? 'text-[28px]' : selectedCountryIds.length === 2 ? 'text-[38px]' : 'text-[52px]'} font-black text-white tracking-[-0.05em] uppercase leading-none drop-shadow-lg text-center px-2 break-words w-full`}>
                {countryDisplayName}
              </h3>
            </div>
          </div>

          {info.roastingStyle && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[28px] font-bold text-white uppercase tracking-widest mb-2">Color</p>
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 border border-white/20 rounded-xl shadow-sm w-full justify-center">
                <div className="w-6 h-6 rounded-full bg-amber-800 border-2 border-amber-900 shadow-sm"></div>
                <span className="text-[44px] font-black text-white uppercase tracking-tight leading-none">
                  {(() => {
                    const matches = info.roastingStyle.match(/\d+/g);
                    if (matches && matches.length > 0) {
                      return matches.map(num => `#${num}`).join(' ');
                    }
                    return info.roastingStyle;
                  })()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Brand Logo */}
        <div className="flex flex-col items-center justify-center leading-none">
          <div className="flex flex-col items-center justify-center leading-none w-[200px]">
            <span className="text-white text-[64px] font-artrick font-bold tracking-tight uppercase scale-x-75 inline-block">sowon</span>
            <span className="text-white text-[26px] font-artrick font-bold tracking-[0.5em] mr-[-0.5em] uppercase mt-1 border-t-4 border-white/20 pt-2 w-full text-center scale-x-90 inline-block">coffee</span>
          </div>
          <div className="mt-4 w-12 h-1 bg-white rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Right Column: Detailed Coffee Specs & Flavor */}
      <div className="flex-1 h-full pt-10 pb-12 px-12 flex flex-col justify-between bg-white relative">
         {/* Top Row: Roasting Date, Ground Color, and decorative Icon */}
        <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
          <div className="flex items-center gap-12">
            {getCleanDate(info.roastingDate) && (
              <div>
                <p className="text-[22px] font-bold text-black uppercase tracking-widest mb-0.5">Roasting Date</p>
                <div className="py-0.5 border border-transparent">
                  <p className="text-[36px] font-black text-black tracking-wider leading-none">
                    {getCleanDate(info.roastingDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <ArrowUpRight className="w-16 h-16 text-[#2D2926] opacity-90" strokeWidth={2.5} />
        </div>

        {/* Middle Section: Specs and Details */}
        <div className="flex-1 flex flex-col justify-start pt-3 gap-5">
          {/* Coffee Product Name */}
          <div className="space-y-1">
            <p className="text-[28px] font-bold text-black uppercase tracking-widest">Name</p>
            <p className="text-[52px] font-black text-black uppercase leading-tight line-clamp-2 break-words">
              {info.specialty || ''}
            </p>
          </div>

          {/* Technical Specs: 3-column Layout */}
          <div className="grid grid-cols-[1fr_1.4fr_0.6fr] gap-6 pt-3 border-t-2 border-black">
            <div className="space-y-1">
              <p className="text-[28px] font-bold text-black uppercase tracking-widest">Varietal</p>
              <p className="text-[44px] font-black text-black uppercase leading-tight line-clamp-2 break-words">
                {info.kind || ''}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[28px] font-bold text-black uppercase tracking-widest">Processing</p>
              <p className="text-[44px] font-black text-black uppercase leading-tight line-clamp-2 break-words">
                {info.processing || ''}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[28px] font-bold text-black uppercase tracking-widest">Altitude</p>
              <p className="text-[44px] font-black text-black leading-tight line-clamp-2 break-words">
                {(() => {
                  if (!info.altitude) return '';
                  const trimmed = info.altitude.trim();
                  if (trimmed.toLowerCase().endsWith('m')) {
                    return trimmed;
                  }
                  return `${trimmed}m`;
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Flavor Notes & Intended Usage Tags */}
        <div className="border-t-2 border-black pt-3 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-[28px] font-bold text-black uppercase tracking-widest">Flavor Notes</p>
            {info.usage && info.usage.length > 0 && (
              <div className="flex gap-2">
                {info.usage.map(u => {
                  const displayUsage = u === '브루잉' ? 'Brewing' : u === '에스프레소' ? 'Espresso' : u === '밀크커피' ? 'Milk Coffee' : u;
                  return (
                    <span key={u} className="px-4 py-1 bg-[#2D2926] text-white text-[30px] font-black tracking-wider uppercase border border-[#2D2926] rounded leading-none flex items-center">
                      {displayUsage}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="line-clamp-3 overflow-hidden max-h-[160px] flex flex-wrap gap-x-3 gap-y-1 content-start">
            {info.cuppingNote.map((n, idx) => (
              <span key={idx} className="text-[44px] font-black uppercase leading-[1.1] text-black">
                {n.note}{idx < info.cuppingNote.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
