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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">위험물 실기 핵심 요약집 & 공식 레퍼런스</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Search */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('hazmat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'hazmat'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> 제1~6류 위험물 및 지정수량
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'formulas'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4" /> 핵심 계산 공식 요약
            </button>
          </div>

          {activeTab === 'hazmat' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="품명, 지정수량 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-orange-500 outline-hidden w-48"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'hazmat' ? (
            <div className="space-y-4">
              {filteredHazmat.map((item) => (
                <div key={item.classNum} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-orange-600 text-white rounded text-xs font-bold font-mono">
                        {item.classNum}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      성질: {item.nature}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-blue-700">소화 방법: </span>
                    <span className="text-xs text-slate-700">{item.extinguishingMethod}</span>
                  </div>

                  {/* Representative items table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-3">대표 품명</th>
                          <th className="py-1.5 px-3 w-32">지정수량</th>
                          <th className="py-1.5 px-3 w-24">위험등급</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {item.representativeItems.map((rep, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-medium text-slate-800">{rep.name}</td>
                            <td className="py-1.5 px-3 font-mono font-bold text-orange-600">{rep.quantity}</td>
                            <td className="py-1.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
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
            <div className="space-y-4">
              {CORE_FORMULAS.map((f, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{f.title}</h4>
                  <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-3 rounded-lg my-2 border border-slate-800 select-all">
                    {f.formula}
                  </div>
                  <p className="text-xs text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
