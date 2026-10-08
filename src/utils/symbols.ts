export interface SymbolGroup {
  name: string;
  items: { label: string; value: string; tooltip?: string }[];
}

export const SYMBOL_GROUPS: SymbolGroup[] = [
  {
    name: '반응식 기호',
    items: [
      { label: '→', value: '→', tooltip: '반응 진행 화살표' },
      { label: '⇄', value: '⇄', tooltip: '가역반응 평형' },
      { label: '↑', value: '↑', tooltip: '기체 발생' },
      { label: '↓', value: '↓', tooltip: '침전물 생성' },
      { label: '＋', value: ' + ', tooltip: '반응물/생성물 결합' },
      { label: 'Δ (가열)', value: 'Δ', tooltip: '가열 기호 Delta' },
    ]
  },
  {
    name: '첨자 & 지수',
    items: [
      { label: '²', value: '²', tooltip: '제곱 (면적 등)' },
      { label: '³', value: '³', tooltip: '세제곱 (부피 m³)' },
      { label: '₁', value: '₁', tooltip: '아래첨자 1' },
      { label: '₂', value: '₂', tooltip: '아래첨자 2' },
      { label: '₃', value: '₃', tooltip: '아래첨자 3' },
      { label: '₄', value: '₄', tooltip: '아래첨자 4' },
      { label: '₅', value: '₅', tooltip: '아래첨자 5' },
      { label: '₆', value: '₆', tooltip: '아래첨자 6' },
    ]
  },
  {
    name: '단위 & 계산',
    items: [
      { label: '℃', value: '℃', tooltip: '섭씨 온도' },
      { label: 'm³', value: 'm³', tooltip: '입방미터 (체적)' },
      { label: 'm²', value: 'm²', tooltip: '제곱미터 (면적)' },
      { label: 'kg/m³', value: 'kg/m³', tooltip: '밀도' },
      { label: 'g/mol', value: 'g/mol', tooltip: '몰 질량' },
      { label: 'atm', value: 'atm', tooltip: '기압' },
      { label: 'vol%', value: 'vol%', tooltip: '부피 백분율' },
      { label: 'wt%', value: 'wt%', tooltip: '중량 백분율' },
      { label: '×', value: ' × ', tooltip: '곱하기 기호' },
    ]
  },
  {
    name: '화학식 단축 템플릿',
    items: [
      { label: 'H2O', value: 'H2O', tooltip: '물' },
      { label: 'CO2', value: 'CO2', tooltip: '이산화탄소' },
      { label: 'O2', value: 'O2', tooltip: '산소' },
      { label: 'H2', value: 'H2', tooltip: '수소' },
      { label: 'H2SO4', value: 'H2SO4', tooltip: '황산' },
      { label: 'HNO3', value: 'HNO3', tooltip: '질산' },
      { label: 'C2H5OH', value: 'C2H5OH', tooltip: '에탄올' },
      { label: 'CH3OH', value: 'CH3OH', tooltip: '메탄올' },
      { label: 'KMnO4', value: 'KMnO4', tooltip: '과망간산칼륨' },
    ]
  }
];
