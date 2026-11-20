
import React, { useState, useRef, useEffect } from 'react';
import { CoffeeInfo, CuppingNote } from '../types';
import { COUNTRIES, ROASTING_STYLES, ROASTING_DEGREES, VARIETALS, PROCESSINGS, ALTITUDES, CUPPING_NOTE_CATEGORIES, USAGES } from '../constants';
import { MapPin, Coffee, Layers, Mountain, Music, Edit3, Flame, Thermometer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorPanelProps {
  info: CoffeeInfo;
  onUpdate: (updates: Partial<CoffeeInfo>) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ info, onUpdate, }) => {
  const [inputText, setInputText] = useState(() => info.cuppingNote.map(n => n.note).join(', '));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const parseDateString = (str: string) => {
    if (!str) return null;
    const parts = str.split('.');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
    return null;
  };

  useEffect(() => {
    if (isCalendarOpen) {
      const parsed = parseDateString(info.roastingDate || '');
      if (parsed) {
        setCurrentMonth(parsed);
      } else {
        setCurrentMonth(new Date());
      }
    }
  }, [isCalendarOpen, info.roastingDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  React.useEffect(() => {
    const currentNotesStr = info.cuppingNote.map(n => n.note.toUpperCase()).join(',');
    const inputParsedStr = inputText.split(',').map(s => s.trim().toUpperCase()).filter(s => s).join(',');
    if (currentNotesStr !== inputParsedStr) {
      setInputText(info.cuppingNote.map(n => n.note).join(', '));
    }
  }, [info.cuppingNote]);

  return (
    <div className="p-6 space-y-6">
      {/* Country Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" /> 국가 선택 (Country)
        </label>
        <div className="flex flex-wrap gap-1 mb-3">
          {COUNTRIES.filter(c => c.id !== 'manual').map(c => {
            const currentValues = info.country.split(',').map(s => s.trim().toLowerCase());
            const isSelected = currentValues.includes(c.id.toLowerCase());
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  const current = info.country.split(',').map(s => s.trim()).filter(s => s);
                  const cId = c.id.toLowerCase();
                  let next;
                  if (current.some(s => s.toLowerCase() === cId)) {
                    next = current.filter(s => s.toLowerCase() !== cId);
                  } else {
                    next = [...current, c.id];
                  }
                  onUpdate({ country: next.join(', ') });
                }}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                  isSelected 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <input
            type="text"
            value={info.country}
            onChange={(e) => onUpdate({ country: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-xs"
            placeholder="국가 직접 입력 또는 선택된 항목"
          />
          <Edit3 className="w-3 h-3 text-gray-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* Specialty Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-600" /> 제품명 (Name)
        </label>
        <input
          type="text"
          value={info.specialty}
          onChange={(e) => onUpdate({ specialty: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="예: 콜롬비아 수프리모"
        />
      </div>

      {/* Kind / Varietal */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" /> 품종 (Varietal)
        </label>
        <div className="flex flex-wrap gap-1 mb-3">
          {VARIETALS.map(v => {
            const currentValues = info.kind.split(',').map(s => s.trim().toUpperCase());
            const isSelected = currentValues.includes(v.toUpperCase());
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  const current = info.kind.split(',').map(s => s.trim()).filter(s => s);
                  const vUpper = v.toUpperCase();
                  let next;
                  if (current.some(s => s.toUpperCase() === vUpper)) {
                    next = current.filter(s => s.toUpperCase() !== vUpper);
                  } else {
                    next = [...current, v];
                  }
                  onUpdate({ kind: next.join(', ') });
                }}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                  isSelected 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <input
            type="text"
            value={info.kind}
            onChange={(e) => onUpdate({ kind: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-xs"
            placeholder="품종 직접 입력 또는 선택된 항목"
          />
          <Edit3 className="w-3 h-3 text-gray-400 absolute right-3 top-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Processing */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" /> 가공 (Processing)
          </label>
          <div className="flex flex-wrap gap-1 mb-3">
            {PROCESSINGS.map(p => {
              const currentValues = info.processing.split(',').map(s => s.trim().toUpperCase());
              const isSelected = currentValues.includes(p.toUpperCase());
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    const current = info.processing.split(',').map(s => s.trim()).filter(s => s);
                    const pUpper = p.toUpperCase();
                    let next;
                    if (current.some(s => s.toUpperCase() === pUpper)) {
                      next = current.filter(s => s.toUpperCase() !== pUpper);
                    } else {
                      next = [...current, p];
                    }
                    onUpdate({ processing: next.join(', ') });
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                    isSelected 
                      ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <input
              type="text"
              value={info.processing}
              onChange={(e) => onUpdate({ processing: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-xs"
              placeholder="가공 방식 직접 입력 또는 선택된 항목"
            />
            <Edit3 className="w-3 h-3 text-gray-400 absolute right-3 top-3" />
          </div>
        </div>

        {/* Altitude */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Mountain className="w-4 h-4 text-amber-600" /> 고도 (Altitude)
          </label>
          <div className="relative">
            <input
              type="text"
              value={info.altitude}
              onChange={(e) => onUpdate({ altitude: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-xs"
              placeholder="고도 직접 입력 (예: 1600m)"
            />
            <Edit3 className="w-3 h-3 text-gray-400 absolute right-3 top-3" />
          </div>
        </div>
      </div>

      {/* Intended Use (Usage) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-600" /> 용도 (Usage)
        </label>
        <div className="flex gap-2">
          {USAGES.map(u => {
            const currentUsage = info.usage || [];
            const isSelected = currentUsage.includes(u);
            return (
              <button
                key={u}
                type="button"
                onClick={() => {
                  let next;
                  if (currentUsage.includes(u)) {
                    next = currentUsage.filter(item => item !== u);
                  } else {
                    next = [...currentUsage, u];
                  }
                  onUpdate({ usage: next });
                }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                  isSelected 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                {u}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cupping Notes */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Music className="w-4 h-4 text-amber-600" /> 플레이버 (Flavor)
        </label>

        <div className="space-y-3">
          {Object.entries(CUPPING_NOTE_CATEGORIES).map(([category, notes]) => (
            <div key={category} className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{category}</p>
              <div className="flex flex-wrap gap-1">
                {notes.map(note => {
                  const currentNoteObj = info.cuppingNote.find(n => n.note.toUpperCase() === note.toUpperCase());
                  const isSelected = !!currentNoteObj;
                  const activeColor = 'bg-amber-600 border-amber-600';

                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => {
                        const noteUpper = note.toUpperCase();
                        let newNotes: CuppingNote[];
                        if (info.cuppingNote.some(n => n.note.toUpperCase() === noteUpper)) {
                          newNotes = info.cuppingNote.filter(n => n.note.toUpperCase() !== noteUpper);
                        } else {
                          newNotes = [...info.cuppingNote, { note: noteUpper, degree: '' }];
                        }
                        onUpdate({ cuppingNote: newNotes });
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                        isSelected 
                          ? `${activeColor} text-white shadow-sm` 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">선택된 플레이버 수정 (Selected Output - Editable)</p>
          <textarea
            value={inputText}
            onChange={(e) => {
              const val = e.target.value;
              setInputText(val);
              const parsed = val.split(',')
                .map(s => s.trim())
                .filter(s => s)
                .map(s => ({ note: s, degree: '' }));
              onUpdate({ cuppingNote: parsed });
            }}
            placeholder="선택한 컵노트들이 여기에 표시됩니다. 직접 쉼표(,)로 구분하여 추가 및 수정할 수 있습니다."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none text-xs font-semibold uppercase min-h-[68px] bg-white text-gray-800 leading-relaxed shadow-inner"
          />
          <p className="text-[10px] text-gray-400">
            * 입력창의 컵노트를 직접 지우거나, 쉼표(,)로 구분해 새로운 단어를 추가하여 자유롭게 수정해 보세요. (이미지에도 바로 적용됩니다!)
          </p>
        </div>
      </div>

      {/* Roasting Date */}
      <div className="relative" ref={calendarRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" /> 로스팅 날짜 (Roasting Date)
        </label>
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <input
              type="text"
              value={info.roastingDate || ''}
              placeholder="예: 2026.06.18 (직접 입력도 가능합니다)"
              onChange={(e) => {
                onUpdate({ roastingDate: e.target.value });
              }}
              className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-amber-500 outline-none text-sm placeholder-gray-400 font-medium"
            />
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="absolute right-3 top-3 text-gray-400 hover:text-amber-600 transition-colors"
              title="달력 열기"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isCalendarOpen && (() => {
          const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const startDayOfWeek = startOfMonth.getDay();
          const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
          const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();

          const days = [];
          for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
              date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i),
              isCurrentMonth: false,
            });
          }
          for (let i = 1; i <= daysInMonth; i++) {
            days.push({
              date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
              isCurrentMonth: true,
            });
          }
          const remaining = 42 - days.length;
          for (let i = 1; i <= remaining; i++) {
            days.push({
              date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
              isCurrentMonth: false,
            });
          }

          const selectedDate = parseDateString(info.roastingDate || '');
          const isSelectedDay = (d: Date) => {
            if (!selectedDate) return false;
            return (
              d.getFullYear() === selectedDate.getFullYear() &&
              d.getMonth() === selectedDate.getMonth() &&
              d.getDate() === selectedDate.getDate()
            );
          };

          const isToday = (d: Date) => {
            const today = new Date();
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate()
            );
          };

          return (
            <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72 select-none">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-800 text-sm">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-2">
                <span>일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span>토</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((item, idx) => {
                  const isSel = isSelectedDay(item.date);
                  const isTod = isToday(item.date);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdate({ roastingDate: formatDate(item.date) });
                        setIsCalendarOpen(false);
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        isSel
                          ? 'bg-amber-600 text-white shadow-sm hover:bg-amber-700'
                          : !item.isCurrentMonth
                          ? 'text-gray-300 hover:bg-gray-50'
                          : isTod
                          ? 'border border-amber-600 text-amber-600 hover:bg-amber-50'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      {item.date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({ roastingDate: formatDate(new Date()) });
                    setIsCalendarOpen(false);
                  }}
                  className="text-[11px] font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded"
                >
                  오늘 선택
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-[11px] font-extrabold text-gray-500 hover:text-gray-700"
                >
                  닫기
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Roasting Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-600" /> 색상 (Color)
        </label>
        <input
          type="text"
          value={info.roastingStyle || ''}
          placeholder="예: 55, 65 또는 #55 #65 (원하는 수치들을 직접 입력하세요)"
          onChange={(e) => {
            onUpdate({ roastingStyle: e.target.value });
          }}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm placeholder-gray-400 font-medium"
        />
      </div>

    </div>
  );
};

export default EditorPanel;
