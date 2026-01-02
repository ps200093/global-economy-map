# API 통합 가이드

이 문서는 Global Economy Monitor에서 사용하는 모든 데이터 소스와 API 통합 방법을 상세히 설명합니다.

## 📋 목차

1. [World Bank API](#1-world-bank-api)
2. [ACLED API](#2-acled-api)
3. [UNHCR API](#3-unhcr-api)
4. [GDACS API](#4-gdacs-api)
5. [FEWS NET](#5-fews-net)
6. [IRS Form 990 / ProPublica](#6-irs-form-990--propublica)
7. [데이터 통합 전략](#7-데이터-통합-전략)

---

## 1. World Bank API

### 개요
- **URL**: https://api.worldbank.org/v2
- **인증**: 불필요
- **비용**: 무료
- **제한**: 없음 (합리적 사용)

### 주요 지표

```typescript
const WB_INDICATORS = {
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',          // 1인당 GDP
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',           // GDP 성장률
  POVERTY_RATE: 'SI.POV.DDAY',               // 빈곤율 ($2.15/day)
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',            // 실업률
  GINI_INDEX: 'SI.POV.GINI',                 // 지니 계수
  LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',         // 기대 수명
  LITERACY_RATE: 'SE.ADT.LITR.ZS',           // 문해율
  HEALTH_EXPENDITURE: 'SH.XPD.CHEX.GD.ZS',   // 보건 지출 (% GDP)
  EDUCATION_EXPENDITURE: 'SE.XPD.TOTL.GD.ZS', // 교육 지출 (% GDP)
  POPULATION: 'SP.POP.TOTL',                 // 총 인구
  URBAN_POPULATION: 'SP.URB.TOTL.IN.ZS',     // 도시 인구 비율
};
```

### 사용 예제

```typescript
// 특정 국가의 특정 지표
const response = await fetch(
  'https://api.worldbank.org/v2/country/USA/indicator/NY.GDP.PCAP.CD?format=json&date=2020:2023'
);
const data = await response.json();
```

### 국가 코드
- 개별 국가: ISO 3166-1 alpha-3 (예: USA, KOR, JPN)
- 지역: SSF (사하라 이남 아프리카), SAS (남아시아), EAS (동아시아), LCN (라틴아메리카), MNA (중동북아프리카), ECS (유럽중앙아시아)

### 캐싱 전략
```typescript
next: { revalidate: 86400 } // 24시간
```

---

## 2. ACLED API

### 개요
- **URL**: https://api.acleddata.com/acled/read
- **인증**: API Key + Email (필수)
- **비용**: 무료 (2,500 요청/월), 유료 플랜 가능
- **가입**: https://developer.acleddata.com

### API 키 발급

1. https://developer.acleddata.com 접속
2. 계정 생성
3. API Key 발급
4. `.env.local`에 추가:
```env
ACLED_API_KEY=your_api_key_here
ACLED_EMAIL=your_email@example.com
```

### 사용 예제

```typescript
const params = new URLSearchParams({
  key: process.env.ACLED_API_KEY,
  email: process.env.ACLED_EMAIL,
  country: 'Syria',
  event_date: '2024-01-01',
  event_date_where: '>=',
  limit: '500'
});

const response = await fetch(
  `https://api.acleddata.com/acled/read?${params.toString()}`
);
const data = await response.json();
```

### 주요 필드
- `event_type`: Battles, Violence against civilians, Protests, Riots, Strategic developments, Explosions/Remote violence
- `fatalities`: 사망자 수
- `latitude`, `longitude`: 위치
- `event_date`: 발생 날짜

### Mock 데이터 대안
API 키가 없을 경우 `services/acled.ts`의 `getMockConflictData()` 사용

---

## 3. UNHCR API

### 개요
- **URL**: https://api.unhcr.org/population/v1
- **인증**: 불필요
- **비용**: 무료
- **제한**: 없음

### 사용 예제

```typescript
const response = await fetch(
  'https://api.unhcr.org/population/v1/population/?year=2023&coo_iso=SYR&download=false'
);
const data = await response.json();
```

### 주요 필드
- `country_of_origin`: 출신 국가
- `country_of_asylum`: 피난 국가
- `refugees`: 난민 수
- `asylum_seekers`: 망명 신청자 수
- `idps`: 국내 실향민 수

### 캐싱 전략
```typescript
next: { revalidate: 604800 } // 7일
```

---

## 4. GDACS API

### 개요
- **URL**: https://www.gdacs.org/gdacsapi/api
- **인증**: 불필요
- **비용**: 무료
- **제한**: 없음

### 사용 예제

```typescript
const response = await fetch(
  'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH'
);
const data = await response.json();
```

### 재난 유형
- TC: Tropical Cyclone (태풍)
- EQ: Earthquake (지진)
- FL: Flood (홍수)
- VO: Volcano (화산)
- DR: Drought (가뭄)

### 심각도 레벨
- Red: 매우 심각
- Orange: 심각
- Green: 경미

### 캐싱 전략
```typescript
next: { revalidate: 3600 } // 1시간
```

---

## 5. FEWS NET

### 개요
- **URL**: https://fews.net
- **API**: 공식 API 없음 (데이터 포털 또는 스크래핑)
- **대안**: Mock 데이터 사용

### IPC 단계 (Integrated Food Security Phase Classification)
- Phase 1: Minimal / None (최소)
- Phase 2: Stressed (스트레스)
- Phase 3: Crisis (위기)
- Phase 4: Emergency (긴급)
- Phase 5: Famine / Catastrophe (기근/재앙)

### Mock 데이터 사용

```typescript
import { getMockFoodSecurityData } from '@/services/fews';

const data = getMockFoodSecurityData('Somalia');
// { ipc_phase: 4, population_affected: 6500000, ... }
```

---

## 6. IRS Form 990 / ProPublica

### 개요
- **URL**: https://projects.propublica.org/nonprofits/api
- **인증**: 불필요
- **비용**: 무료
- **대상**: 미국 501(c)(3) 비영리 단체만

### EIN (Employer Identification Number)
미국 비영리 단체 고유 번호 (예: 131623861 = UNICEF USA)

### 사용 예제

```typescript
const ein = '131623861'; // UNICEF USA
const response = await fetch(
  `https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`
);
const data = await response.json();
```

### 주요 재무 필드
- `totrevenue`: 총 수익
- `totfuncexpns`: 총 지출
- `totprgmrevnue`: 프로그램 수익
- `totcntrbgfts`: 기부금
- `totfundrsng`: 모금비
- `netassetsend`: 순자산

### 효율성 지표 계산

```typescript
const programExpenseRatio = (programExpense / totalExpense) * 100;
const adminExpenseRatio = (adminExpense / totalExpense) * 100;
const fundraisingExpenseRatio = (fundraisingExpense / totalExpense) * 100;
```

### 캐싱 전략
```typescript
next: { revalidate: 2592000 } // 30일
```

---

## 7. 데이터 통합 전략

### 데이터 플로우

```
┌─────────────────┐
│   World Bank    │───┐
└─────────────────┘   │
┌─────────────────┐   │
│     ACLED       │───┤
└─────────────────┘   │
┌─────────────────┐   │    ┌──────────────────┐
│     UNHCR       │───┼───▶│  Integrated Data │
└─────────────────┘   │    └──────────────────┘
┌─────────────────┐   │              │
│     GDACS       │───┤              ▼
└─────────────────┘   │    ┌──────────────────┐
┌─────────────────┐   │    │   Enhanced       │
│   FEWS NET      │───┘    │   Region Data    │
└─────────────────┘        └──────────────────┘
```

### 통합 서비스 사용

```typescript
import { getAllEnhancedRegionData } from '@/services/integrated-data';

// 모든 지역의 통합 데이터
const regions = await getAllEnhancedRegionData();

// 각 지역은 다음을 포함:
// - 경제 지표 (World Bank)
// - 사회 지표 (World Bank, UN)
// - 교육 지표 (UNESCO/World Bank)
// - 보건 지표 (WHO/World Bank)
// - 분쟁 데이터 (ACLED)
// - 재난 데이터 (GDACS)
// - 식량 안보 (FEWS NET)
// - 난민 통계 (UNHCR)
```

### 에러 처리

```typescript
try {
  const data = await getWorldBankIndicator('USA', 'NY.GDP.PCAP.CD');
} catch (error) {
  console.error('Error fetching data:', error);
  // Fall back to mock data or cached data
  return mockData;
}
```

### 병렬 요청

```typescript
const [wbData, acledData, unhcrData] = await Promise.all([
  getWorldBankIndicator(...),
  getConflictData(...),
  getRefugeeData(...)
]);
```

---

## 🔧 트러블슈팅

### CORS 에러
Next.js API Routes를 프록시로 사용:

```typescript
// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiUrl = searchParams.get('url');
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return Response.json(data);
}
```

### API 속도 제한
캐싱과 ISR 활용:

```typescript
export const revalidate = 86400; // 24시간

export async function generateStaticParams() {
  return [
    { region: 'sub-saharan-africa' },
    { region: 'south-asia' },
    // ...
  ];
}
```

### 대용량 데이터
페이지네이션과 lazy loading:

```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 20;

const paginatedData = data.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);
```

---

## 📚 추가 리소스

- [World Bank API 문서](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [ACLED 개발자 문서](https://acleddata.com/acleddatanew/wp-content/uploads/dlm_uploads/2021/06/ACLED_API-User-Guide.pdf)
- [UNHCR 데이터 포털](https://www.unhcr.org/refugee-statistics/)
- [GDACS API](https://www.gdacs.org/gdacsapi/)
- [ProPublica Nonprofit Explorer](https://projects.propublica.org/nonprofits/api)

---

**업데이트**: 2026년 1월
**버전**: 1.0.0

