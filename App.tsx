import React, { useState, useRef, useEffect } from 'react';
import { CoffeeInfo } from './types';
import { INITIAL_COFFEE, COUNTRIES } from './constants';
import EditorPanel from './components/EditorPanel';
import PreviewCard from './components/PreviewCard';
import { Download, Sparkles, Printer, Save, Trash2, ExternalLink, Search, Upload, Plus, Coffee, ZoomIn, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const STORAGE_KEY = 'kafei153_label_data';
const SAVED_LABELS_KEY = 'kafei153_saved_labels';

const App: React.FC = () => {
  const [coffeeInfo, setCoffeeInfo] = useState<CoffeeInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: if cuppingNote is a string (from old version), convert to empty array or initial
        if (typeof parsed.cuppingNote === 'string') {
          parsed.cuppingNote = INITIAL_COFFEE.cuppingNote;
        }
        if (parsed.usage && Array.isArray(parsed.usage)) {
          parsed.usage = parsed.usage
            .map((u: string) => {
              if (u === '브루잉') return 'Brewing';
              if (u === '에스프레소') return 'Espresso';
              return u;
            })
            .filter((u: string) => u !== 'Milk Coffee' && u !== '밀크커피');
        }
        return parsed;
      } catch (e) {
        return INITIAL_COFFEE;
      }
    }
    return INITIAL_COFFEE;
  });

  const [savedLabels, setSavedLabels] = useState<CoffeeInfo[]>(() => {
    const saved = localStorage.getItem(SAVED_LABELS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            const cleaned = { ...item };
            if (typeof cleaned.cuppingNote === 'string') {
              cleaned.cuppingNote = [];
            }
            if (!cleaned.usage) {
              cleaned.usage = [];
            } else if (Array.isArray(cleaned.usage)) {
              cleaned.usage = cleaned.usage
                .map((u: string) => {
                  if (u === '브루잉') return 'Brewing';
                  if (u === '에스프레소') return 'Espresso';
                  return u;
                })
                .filter((u: string) => u !== 'Milk Coffee' && u !== '밀크커피');
            }
            return cleaned;
          });
        }
        return [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'saved'>('edit');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScale, setModalScale] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const updateScale = () => {
      const padding = 64; // vertical/horizontal total padding
      const maxW = window.innerWidth - padding;
      const maxH = window.innerHeight - padding - 100; // extra space for close button/actions
      const scaleW = maxW / 1125;
      const scaleH = maxH / 750;
      setModalScale(Math.min(scaleW, scaleH, 1.2)); // cap at 1.2x max
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coffeeInfo));
  }, [coffeeInfo]);

  useEffect(() => {
    localStorage.setItem(SAVED_LABELS_KEY, JSON.stringify(savedLabels));
  }, [savedLabels]);

  const handleUpdate = (updates: Partial<CoffeeInfo>) => {
    setCoffeeInfo(prev => ({ ...prev, ...updates }));
  };

  const handleSaveToList = () => {
    if (!coffeeInfo.specialty.trim()) {
      showToast('제품명을 입력해주세요.', 'error');
      return;
    }

    // Deep clone to prevent state reference-sharing bugs
    const deepClonedCoffee = JSON.parse(JSON.stringify(coffeeInfo));

    setSavedLabels(prev => {
      const existingIndex = prev.findIndex(
        item => item.specialty.trim().toLowerCase() === deepClonedCoffee.specialty.trim().toLowerCase()
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = deepClonedCoffee;
        showToast('동일한 이름의 라벨이 업데이트되었습니다.', 'success');
        return updated;
      } else {
        showToast('라벨이 목록에 저장되었습니다.', 'success');
        return [deepClonedCoffee, ...prev];
      }
    });
  };

  const handleDeleteLabel = (index: number) => {
    setSavedLabels(prev => prev.filter((_, i) => i !== index));
    showToast('라벨이 목록에서 삭제되었습니다.', 'info');
  };

  const handleLoadLabel = (label: CoffeeInfo) => {
    // Deep clone loaded label to prevent mutative edits affecting history
    setCoffeeInfo(JSON.parse(JSON.stringify(label)));
    showToast('라벨 정보가 적용되었습니다.', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedLabels, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sowon_coffee_labels_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('백업 파일이 생성되었습니다.', 'success');
    } catch (e) {
      showToast('백업 생성 중 오류가 발생했습니다.', 'error');
    }
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.map(item => {
              return {
                specialty: item.specialty || '',
                kind: item.kind || '',
                processing: item.processing || '',
                altitude: item.altitude || '',
                cuppingNote: Array.isArray(item.cuppingNote) ? item.cuppingNote : [],
                roastingDate: item.roastingDate || '',
                roastingStyle: item.roastingStyle || '',
                country: item.country || '',
                usage: Array.isArray(item.usage) ? item.usage
                  .map((u: string) => {
                    if (u === '브루잉') return 'Brewing';
                    if (u === '에스프레소') return 'Espresso';
                    return u;
                  })
                  .filter((u: string) => u !== 'Milk Coffee' && u !== '밀크커피') : []
              };
            });
            setSavedLabels(prev => {
              // Union by specialty name optionally or just combine
              const combined = [...cleaned, ...prev];
              // Filter duplicates by specialty name, keeping the first (newest)
              const seen = new Set();
              return combined.filter(item => {
                const term = item.specialty.trim().toLowerCase();
                if (!term) return true;
                if (seen.has(term)) return false;
                seen.add(term);
                return true;
              });
            });
            showToast('백업 파일로부터 라벨들을 가져왔습니다.', 'success');
          } else {
            showToast('올바른 백업 파일 형식이 아닙니다.', 'error');
          }
        } catch (error) {
          showToast('백업 파일을 불러오는 중 오류가 발생했습니다.', 'error');
        }
      };
    }
  };

  const exportAsImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 1125,
        height: 750,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
          padding: '0',
        }
      });

      const fileName = `SOWON_COFFEE_${coffeeInfo.specialty.replace(/\s+/g, '_') || 'label'}.png`;

      let savedWithFileSystem = false;
      const isIframe = (() => {
        try {
          return window.self !== window.top;
        } catch (e) {
          return true;
        }
      })();

      // Try File System Access API if supported and not inside the sandboxed preview iframe
      if (!isIframe && 'showSaveFilePicker' in window) {
        try {
          // Convert dataURL to Blob
          const arr = dataUrl.split(',');
          if (arr.length >= 2) {
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/png';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });

            const handle = await (window as any).showSaveFilePicker({
              suggestedName: fileName,
              startIn: 'pictures',
              types: [{
                description: 'PNG Image',
                accept: {
                  'image/png': ['.png'],
                },
              }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            showToast('사진 폴더에 이미지가 성공적으로 저장되었습니다.', 'success');
            savedWithFileSystem = true;
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            // User cancelled the file picker dialog
            setIsExporting(false);
            return;
          }
          console.warn('File System Access API standard save failed, falling back to traditional download', err);
        }
      }

      if (!savedWithFileSystem) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        
        if (isIframe) {
          showToast('이미지 다운로드가 시작되었습니다. (폴더를 직접 지정하여 저장하시려면 preview 우측 상단의 "새 창에서 열기" 버튼을 클릭하여 새 탭에서 사용해 주세요!)', 'success');
        } else {
          showToast('이미지가 성공적으로 저장되었습니다.', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to export image', err);
      showToast('이미지 저장 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter savedLabels for searching
  const filteredLabels = savedLabels.filter(label => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (label.specialty || '').toLowerCase().includes(q) ||
      (label.country || '').toLowerCase().includes(q) ||
      (label.processing || '').toLowerCase().includes(q) ||
      (label.kind || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Toast Notification popup */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border transition-all duration-300 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-850'
              : 'bg-amber-50 border-amber-200 text-amber-850'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-amber-500'
          } animate-ping`} />
          <span className="text-xs font-bold leading-none">{toast.message}</span>
        </div>
      )}

      {/* Sidebar - Editor & Lists */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 shadow-xl overflow-y-auto no-print flex flex-col h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="bg-[#2D2926] p-2 rounded-lg flex flex-col items-center justify-center leading-none scale-75 origin-left min-w-[100px]">
                <span className="text-white text-2xl font-artrick font-bold tracking-tight uppercase scale-x-75 inline-block">sowon</span>
                <span className="text-white text-[8px] font-artrick font-bold tracking-[0.4em] mr-[-0.4em] uppercase mt-1 border-t border-white/20 pt-1 w-full text-center scale-x-90 inline-block">coffee</span>
             </div>
             <h1 className="text-lg font-extrabold text-gray-800 leading-tight tracking-tight">
               원두 라벨 편집기
             </h1>
          </div>
          <Sparkles className="text-amber-600 w-5 h-5 animate-pulse" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'edit'
                ? 'border-amber-600 text-amber-700 bg-amber-50/20'
                : 'border-transparent text-gray-400 hover:text-gray-650 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600" />
            라벨 편집
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all relative ${
              activeTab === 'saved'
                ? 'border-amber-600 text-amber-700 bg-amber-50/20'
                : 'border-transparent text-gray-400 hover:text-gray-650 hover:bg-gray-50'
            }`}
          >
            <Save className="w-4 h-4 text-amber-600" />
            저장 목록
            {savedLabels.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-black bg-amber-600 text-white rounded-full leading-none absolute right-4">
                {savedLabels.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content view */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'edit' ? (
            <div>
              <EditorPanel 
                info={coffeeInfo} 
                onUpdate={handleUpdate} 
              />
              
              <div className="p-6 space-y-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={exportAsImage}
                  disabled={isExporting}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isExporting ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  이미지 저장 (PNG)
                </button>
                
                <button
                  onClick={handlePrint}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                  인쇄 / PDF 저장
                </button>

                <button
                  onClick={handleSaveToList}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  리스트에 저장 / 업데이트
                </button>

                <button
                  onClick={() => {
                    if (confirm('모든 입력 내용을 초기화하시겠습니까? (저장된 리스트는 유지됩니다)')) {
                      setCoffeeInfo(INITIAL_COFFEE);
                      showToast('입력기가 초기화 되었습니다.', 'info');
                    }
                  }}
                  className="w-full bg-white border border-red-250 hover:bg-red-50 text-red-600 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                  입력 내용 초기화
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-gray-50/50">
              {/* Search Panel & Imports/Exports */}
              <div className="p-4 bg-white border-b border-gray-200 space-y-3 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="라벨명, 국가, 품종, 가공으로 찾기..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 hover:text-gray-700 text-gray-400 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={exportBackup}
                    className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="저장된 라벨을 백업 JSON 파일로 저장합니다."
                  >
                    <Download className="w-3.5 h-3.5 text-amber-700" />
                    백업 추출
                  </button>
                  <label
                    className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-center"
                    title="기존 백업 JSON 파일을 불러옵니다."
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-700" />
                    백업 가져오기
                    <input
                      type="file"
                      accept=".json"
                      onChange={importBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Saved items scroll container */}
              <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-270px)] flex-1">
                {filteredLabels.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-white rounded-xl border border-gray-150">
                    <Coffee className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-bold">
                      {searchQuery ? '검색 필타에 일치하는 결과가 없습니다.' : '저장된 라벨 정보가 없습니다.'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => {
                          setCoffeeInfo(INITIAL_COFFEE);
                          setActiveTab('edit');
                          showToast('작성기를 빈 상태로 변경했습니다.', 'info');
                        }}
                        className="mt-4 inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-1.5 px-3 rounded-lg text-xs transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        새 라벨 작성하기
                      </button>
                    )}
                  </div>
                ) : (
                  filteredLabels.map((lbl, idx) => {
                    const globalIdx = savedLabels.findIndex(l => l === lbl);
                    return (
                      <div 
                        key={idx}
                        className="bg-white rounded-xl p-3 border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-xs text-gray-800 truncate" title={lbl.specialty}>
                              {lbl.specialty || '(이름 없음)'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">
                              {lbl.country || '국가 없음'} • {lbl.processing || '가공 없음'}
                            </p>
                            {lbl.usage && lbl.usage.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {lbl.usage.map(u => (
                                  <span key={u} className="bg-orange-100 text-orange-800 px-1 rounded text-[8px] font-bold uppercase">
                                    {u}
                                  </span>
                                ))}
                              </div>
                            )}
                            {lbl.cuppingNote && lbl.cuppingNote.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {lbl.cuppingNote.slice(0, 3).map((n, i) => (
                                  <span key={i} className="bg-amber-100 text-amber-900 px-1 rounded text-[8px] font-black uppercase">
                                    {n.note}
                                  </span>
                                ))}
                                {lbl.cuppingNote.length > 3 && (
                                  <span className="text-[8px] font-black text-gray-400 mt-0.5">+{lbl.cuppingNote.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                          {lbl.roastingStyle && (
                            <div className="text-[9px] font-bold text-white px-2 py-0.5 rounded bg-amber-800 select-none uppercase">
                              {lbl.roastingStyle.replace('#', '')}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-semibold">{lbl.roastingDate || '날짜 없음'}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleLoadLabel(lbl)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-1 rounded flex items-center gap-1 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              불러오기
                            </button>
                            <button
                              onClick={() => handleDeleteLabel(globalIdx >= 0 ? globalIdx : idx)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-1 rounded transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total count and clear all */}
              {savedLabels.length > 0 && (
                <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs font-bold text-gray-600 select-none">
                  <span>총 {savedLabels.length}개 저장됨</span>
                  <button
                    onClick={() => {
                      if (confirm('모든 저장된 라벨 목록을 영구히 삭제하시겠습니까?')) {
                        setSavedLabels([]);
                        showToast('라벨 목록이 초기화 되었습니다.', 'info');
                      }
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    전체 삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="flex-1 p-4 md:p-12 flex flex-col items-center justify-start overflow-y-auto bg-[#f0f0f0] pattern-dots no-print">
        <div className="mb-6 text-center no-print">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-widest">
            sowon coffee PREMIUM DESIGN
          </span>
          <p className="text-gray-500 text-sm mt-2 font-medium">1125x750 3:2 비율 고해상도 가로형 디자인</p>
        </div>

        <div 
          onClick={() => setIsModalOpen(true)}
          className="shadow-2xl bg-white rounded-[60px] overflow-hidden mb-12 shrink-0 w-[338px] h-[225px] min-[400px]:w-[394px] min-[400px]:h-[263px] sm:w-[562px] sm:h-[375px] md:w-[619px] md:h-[413px] lg:w-[788px] lg:h-[525px] xl:w-[900px] xl:h-[600px] transition-all duration-300 cursor-pointer group relative"
          title="클릭하여 고해상도 크게 보기"
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center z-10 rounded-[60px]">
            <div className="bg-black/75 backdrop-blur-md text-white px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-xs font-extrabold shadow-xl">
              <ZoomIn className="w-4 h-4 text-amber-400" />
              크게 보기 (클릭)
            </div>
          </div>
          <div ref={cardRef} className="w-[1125px] h-[750px] transform origin-top-left scale-[0.3] min-[400px]:scale-[0.35] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.7] xl:scale-[0.8] transition-all duration-300">
             <PreviewCard info={coffeeInfo} />
          </div>
        </div>

        {/* Saved Labels List below elements (Synchronized with Tab search and displays nicely) */}
        {savedLabels.length > 0 && (
          <div className="mt-4 w-full max-w-4xl no-print border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <Save className="w-5 h-5 text-emerald-600" /> 저장된 라벨 목록 ({filteredLabels.length}개)
              </h2>
              {/* Context Search inside the bottom panel */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="라벨 빠른 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
                <button 
                  onClick={() => {
                    if (confirm('저장된 모든 라벨을 삭제하시겠습니까?')) {
                      setSavedLabels([]);
                      showToast('모든 저장 리스트가 삭제되었습니다.', 'info');
                    }
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 bg-white border border-red-150 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 전체 삭제
                </button>
              </div>
            </div>

            {filteredLabels.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                <Coffee className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-bold">검색어에 만족하는 저장된 라벨이 존재하지 않습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLabels.map((lbl, idx) => {
                  const globalIdx = savedLabels.findIndex(l => l === lbl);
                  return (
                    <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 group hover:shadow-lg transition-all flex flex-col justify-between">
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-extrabold text-sm text-gray-800 truncate" title={lbl.specialty}>
                            {lbl.specialty || '(이름 없음)'}
                          </h3>
                          {lbl.roastingStyle && (
                            <span className="text-[9px] font-black tracking-wide text-white px-2 py-0.5 rounded bg-[#2D2926] uppercase whitespace-nowrap">
                              {lbl.roastingStyle}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-semibold truncate">
                          {lbl.country || '국가 없음'} | {lbl.processing || '가공방식 없음'} | {lbl.kind || '품종 없음'}
                        </p>
                        
                        {lbl.usage && lbl.usage.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {lbl.usage.map((u, i) => (
                              <span key={i} className="bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide">
                                {u}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {lbl.cuppingNote && lbl.cuppingNote.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {lbl.cuppingNote.map((n, i) => (
                              <span key={i} className="bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                {n.note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-gray-400 font-semibold">{lbl.roastingDate || '날짜 없음'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLoadLabel(lbl)}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> 불러오기
                          </button>
                          <button
                            onClick={() => handleDeleteLabel(globalIdx >= 0 ? globalIdx : idx)}
                            className="w-8 h-8 bg-red-50 text-red-605 hover:bg-red-100 rounded-lg flex items-center justify-center transition-all active:scale-95"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-gray-400 text-[10px] text-center max-w-md no-print leading-relaxed">
          <p>© 2024 sowon coffee. All rights reserved. 본 도구는 sowon coffee 원두 라벨 편집기입니다. 저장 목록은 지금 쓰는 브라우저에만 보관되니 '백업 추출'로 따로 보관해 주세요.</p>
        </div>
      </div>

      {/* Print-only full-size label (shown only when printing) */}
      <div className="print-only">
        <PreviewCard info={coffeeInfo} />
      </div>

      {/* High-Resolution Modal Viewer Popup */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="no-print fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-hidden"
          id="modal-viewer"
        >
          {/* Top Bar with actions and close button */}
          <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-4 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                exportAsImage();
              }}
              disabled={isExporting}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-xs transition-all active:scale-95 disabled:opacity-50"
              title="이미지 저장"
            >
              {isExporting ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : (
                <Download className="w-4 h-4" />
              )}
              이미지 저장
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrint();
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-xs transition-all active:scale-95"
              title="인쇄 / PDF"
            >
              <Printer className="w-4 h-4" />
              인쇄
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:text-white bg-black/40 hover:bg-black/60 border border-white/15 p-2 rounded-full transition-all active:scale-95 flex items-center justify-center"
              title="닫기 (ESC)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scaled Preview Card Container */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative flex items-center justify-center animate-fade-in"
            style={{
              width: `${1125 * modalScale}px`,
              height: `${750 * modalScale}px`,
              transition: 'all 0.15s ease-out',
            }}
          >
            <div 
              className="absolute shadow-2xl bg-white rounded-[60px] overflow-hidden"
              style={{
                width: '1125px',
                height: '750px',
                transform: `scale(${modalScale})`,
                transformOrigin: 'center center',
              }}
            >
              <PreviewCard info={coffeeInfo} />
            </div>
          </div>

          {/* Bottom status line */}
          <div className="absolute bottom-4 text-center text-white/50 text-[11px] font-bold">
            마우스 클릭 또는 ESC 키를 누르면 닫힙니다. ({Math.round(modalScale * 100)}% 비율로 최적화됨)
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
