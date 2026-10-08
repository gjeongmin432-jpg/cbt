export interface HazmatGroupInfo {
  classNum: string;
  name: string;
  nature: string;
  representativeItems: { name: string; quantity: string; dangerGrade: string }[];
  extinguishingMethod: string;
}

export const HAZMAT_CLASSIFICATION: HazmatGroupInfo[] = [
  {
    classNum: '제1류',
    name: '산화성 고체',
    nature: '불연성이며 산소를 다량 함유하여 타 가연물의 연소를 맹렬히 도움',
    extinguishingMethod: '다량의 주수소화 (단, 알칼리금속과산화물은 마른모래, 탄산수소염류 분말)',
    representativeItems: [
      { name: '아염소산염류, 염소산염류, 과염소산염류, 무기과산화물', quantity: '50kg', dangerGrade: 'I등급' },
      { name: '브롬산염류, 질산염류, 요오드산염류', quantity: '300kg', dangerGrade: 'II등급' },
      { name: '과망간산염류, 중크롬산염류', quantity: '1,000kg', dangerGrade: 'III등급' },
    ]
  },
  {
    classNum: '제2류',
    name: '가연성 고체',
    nature: '저온 착화되기 쉽고 연소속도가 빠르며 유독가스를 발생하기도 함',
    extinguishingMethod: '주수소화 (단, 철분·금속분·마그네슘은 마른모래, 팽창질석, 금속화재용 분말)',
    representativeItems: [
      { name: '황화린, 적린, 유황', quantity: '100kg', dangerGrade: 'II등급' },
      { name: '철분, 금속분, 마그네슘', quantity: '500kg', dangerGrade: 'III등급' },
      { name: '인화성 고체', quantity: '1,000kg', dangerGrade: 'III등급' },
    ]
  },
  {
    classNum: '제3류',
    name: '자연발화성 및 금수성 물질',
    nature: '공기 중 자연발화하거나 물과 반응하여 가연성 기체 발생 및 발열',
    extinguishingMethod: '마른모래, 팽창질석, 팽창진주암 (주수 절대 금지! 황린은 물속 저장/주수 가능)',
    representativeItems: [
      { name: '칼륨, 나트륨, 알킬알루미늄, 알킬리튬', quantity: '10kg / 알킬류: 지정', dangerGrade: 'I등급' },
      { name: '황린', quantity: '20kg', dangerGrade: 'I등급' },
      { name: '알칼리금속, 알칼리토금속, 유기금속화합물', quantity: '50kg', dangerGrade: 'II등급' },
      { name: '금속의 수소화물, 인화물, 탄화칼슘, 탄화알루미늄', quantity: '300kg', dangerGrade: 'III등급' },
    ]
  },
  {
    classNum: '제4류',
    name: '인화성 액체',
    nature: '인화점이 낮아 증기가 공기와 혼합하여 인화·폭발 위험',
    extinguishingMethod: '포소화설비, CO2, 할론, 분말, 물분무 (수용성은 알코올포/내알코올포)',
    representativeItems: [
      { name: '특수인화물 (에테르, 이황화탄소 등)', quantity: '50L', dangerGrade: 'I등급' },
      { name: '제1석유류 (비수용성 200L / 수용성 400L)', quantity: '200L / 400L', dangerGrade: 'II등급' },
      { name: '알코올류', quantity: '400L', dangerGrade: 'II등급' },
      { name: '제2석유류 (비수용성 1,000L / 수용성 2,000L)', quantity: '1,000L / 2,000L', dangerGrade: 'III등급' },
      { name: '제3석유류 (비수용성 2,000L / 수용성 4,000L)', quantity: '2,000L / 4,000L', dangerGrade: 'III등급' },
      { name: '제4석유류 (기어유, 실린더유 등)', quantity: '6,000L', dangerGrade: 'III등급' },
      { name: '동식물유류', quantity: '10,000L', dangerGrade: 'III등급' },
    ]
  },
  {
    classNum: '제5류',
    name: '자기반응성 물질',
    nature: '분자 내 산소를 함유하여 자체 연소 및 폭발성 극히 큼 (내부산소 공급)',
    extinguishingMethod: '다량의 주수 냉각소화 (질식소화 효과 전혀 없음)',
    representativeItems: [
      { name: '유기과산화물, 질산에스테르류', quantity: '10kg', dangerGrade: 'I등급' },
      { name: '히드록실아민, 히드록실아민염류', quantity: '100kg', dangerGrade: 'I등급' },
      { name: '니트로화합물, 니트로소화합물, 아조화합물, 디아조화합물', quantity: '200kg', dangerGrade: 'II등급' },
    ]
  },
  {
    classNum: '제6류',
    name: '산화성 액체',
    nature: '불연성이지만 강산이며 강력한 산화력, 물과 접촉 시 발열',
    extinguishingMethod: '마른모래, 탄산수소염류 분말 (주수 시 비산 및 강산성 유출 주의)',
    representativeItems: [
      { name: '과염소산, 과산화수소(36wt% 이상), 질산(비중 1.49 이상)', quantity: '300kg', dangerGrade: 'I등급' },
    ]
  }
];

export const CORE_FORMULAS = [
  {
    title: '이상기체 상태방정식 (PV = nRT)',
    formula: 'V = (W / M) × (R × T) / P   (R = 0.082 atm·L/mol·K)',
    description: '기체의 발생 체적 및 온도·압력 변화에 따른 부피 계산에 필수'
  },
  {
    title: '옥외탱크 내용적 계산 (원통형 종형탱크)',
    formula: 'V = π × r² × h',
    description: '횡형탱크는 양단이 반구 또는 평판인 경우 공식 적용'
  },
  {
    title: '보유공지 및 안전거리',
    formula: '제조소 등 시설 기준에 따른 건축물 외벽 및 경계선과의 법정 이격거리',
    description: '주택 10m, 고압가스 20m, 학교/병원 30m, 문화재 50m'
  }
];
