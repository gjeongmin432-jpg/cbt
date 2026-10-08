import React, { useState } from 'react';
import { HAZMAT_CLASSIFICATION, CORE_FORMULAS } from '../data/cheatsheet';
import { X, BookMarked, ShieldAlert, Calculator, Search } from 'lucide-react';

interface FormulaReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaReferenceModal: React.FC<FormulaReferenceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hazmat' | 'formulas'>('hazmat');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHazmat = HAZMAT_CLASSIFICATION.filter(group => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      group.name.toLowerCase().includes(term) ||
      group.classNum.toLowerCase().includes(term) ||
      group.extinguishingMethod.toLowerCase().includes(term) ||
      group.representativeItems.some(i => i.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
            <h2 className="font-extrabold text-sm sm:text-lg truncate">위험물 실기 요약 & 공식</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Search */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('hazmat')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'hazmat'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> 1~6류 및 지정수량
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('formulas')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> 핵심 계산 공식
            </button>
          </div>

          {activeTab === 'hazmat' && (
            <div className="relative w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="품명, 지정수량 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-orange-500 outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
          {activeTab === 'hazmat' ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredHazmat.map((item) => (
                <div key={item.classNum} className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-600 text-white rounded text-[11px] sm:text-xs font-bold font-mono">
                        {item.classNum}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium break-keep">
                      성질: {item.nature}
                    </span>
                  </div>

                  <div className="mb-2 text-xs">
                    <span className="font-bold text-blue-700">소화: </span>
                    <span className="text-slate-700 break-keep">{item.extinguishingMethod}</span>
                  </div>

                  {/* Representative items table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] sm:text-xs bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-1 px-2.5">대표 품명</th>
                          <th className="py-1 px-2.5 w-28">지정수량</th>
                          <th className="py-1 px-2.5 w-20">등급</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {item.representativeItems.map((rep, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-medium text-slate-800 break-keep">{rep.name}</td>
                            <td className="py-1.5 px-2.5 font-mono font-bold text-orange-600">{rep.quantity}</td>
                            <td className="py-1.5 px-2.5">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {rep.dangerGrade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {CORE_FORMULAS.map((f, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-slate-50">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{f.title}</h4>
                  <div className="bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg my-1.5 border border-slate-800 overflow-x-auto whitespace-pre-wrap select-all">
                    {f.formula}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 break-keep">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
