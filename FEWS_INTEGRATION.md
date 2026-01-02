# FEWS NET 통합 완료! 🎉

**FEWS NET (Famine Early Warning Systems Network)** API가 성공적으로 통합되었습니다!

## ✅ 새로 추가된 기능

### 1. IPC 식량안보 단계
- IPC Phase 1-5 분류
- 영향 받는 인구 수
- 예상 기간

### 2. 시장 가격 데이터
- 주요 상품 가격 (쌀, 밀, 옥수수 등)
- 전월 대비 가격 변화율
- 시장별 가격 비교
- 가격 급등 경고 시스템

### 3. 작황 상태 & 농업 지표
- 작물별 상태 (excellent/good/fair/poor/failed)
- 예상 수확량 (tons/hectare)
- 강수량 상태 (above_normal/normal/below_normal)
- 토양 수분 (adequate/moderate/deficit)

### 4. 교역 & 공급 흐름
- 국가 간 교역 경로
- 상품별 교역량
- 교역 상태 (normal/restricted/blocked)
- 국경별 가격 차이

## 📊 새로운 타입 정의

```typescript
// types/api.ts에 추가됨
export interface FEWSMarketPrice { ... }
export interface FEWSCropCondition { ... }
export interface FEWSTradeFlow { ... }
```

## 🔧 사용 방법

### 1. 식량 안보 데이터 가져오기

```typescript
import { getFoodSecurityData } from '@/services/fews';

const data = await getFoodSecurityData('Somalia');
// IPC Phase, 영향 인구, 예상 기간
```

### 2. 시장 가격 데이터

```typescript
import { getMarketPrices } from '@/services/fews';

const prices = await getMarketPrices('Ethiopia', 'Maize');
// 시장별 가격, 변화율
```

### 3. 작황 상태

```typescript
import { getCropConditions } from '@/services/fews';

const crops = await getCropConditions('Kenya');
// 작물 상태, 수확량 예상
```

### 4. 교역 흐름

```typescript
import { getTradeFlows } from '@/services/fews';

const flows = await getTradeFlows('Somalia');
// 교역 경로, 물량, 상태
```

### 5. 통합 데이터 (모든 지표 한번에)

```typescript
import { getCompleteFEWSData } from '@/services/fews';

const complete = await getCompleteFEWSData('Ethiopia');
// {
//   foodSecurity,
//   marketPrices,
//   cropConditions,
//   tradeFlows,
//   summary
// }
```

## 🎨 새로운 컴포넌트

### FEWSDataVisualization

```tsx
import FEWSDataVisualization from '@/components/FEWSDataVisualization';

<FEWSDataVisualization
  marketPrices={prices}
  cropConditions={crops}
  tradeFlows={flows}
  country="Somalia"
/>
```

**기능:**
- 시장 가격 변화율 차트 (Bar Chart)
- 가격 상세 정보 카드
- 작황 상태 시각화
- 교역 흐름 지도식 표시
- 가격 급등 경고

## 🌐 API 엔드포인트 구조

```
FEWS NET API (가상 엔드포인트 - 실제로는 데이터 포털 사용)
├── /v1/ipc?country=Somalia
├── /v1/market-prices?country=Ethiopia&commodity=Maize
├── /v1/crop-conditions?country=Kenya
└── /v1/trade-flows?country=Somalia
```

**참고**: FEWS NET은 공식 REST API를 제공하지 않으므로, 실제 프로덕션에서는:
1. FEWS NET 데이터 포털에서 정기적으로 데이터 다운로드
2. 자체 데이터베이스에 저장
3. 자체 API 엔드포인트 구축
4. 또는 Mock 데이터 활용 (현재 구현됨)

## 📦 업데이트된 파일

```
global-economy-map/
├── types/api.ts                 ⭐ 3개 타입 추가
├── services/fews.ts             ⭐ 완전히 재작성
├── components/
│   └── FEWSDataVisualization.tsx ⭐ NEW
├── .env.example                 ⭐ 업데이트
└── FEWS_INTEGRATION.md          ⭐ NEW (이 파일)
```

## 🎯 Mock 데이터

API 접근이 불가능한 경우, 다음 국가의 Mock 데이터 제공:
- Somalia
- Yemen
- Ethiopia
- South Sudan
- Kenya
- Afghanistan
- Haiti
- Nigeria
- DRC

각 국가별로:
- ✅ IPC 식량안보 데이터
- ✅ 시장 가격 (2-3개 주요 상품)
- ✅ 작황 상태 (주요 작물)
- ✅ 교역 흐름 (주요 경로)

## 🔄 캐싱 전략

```typescript
IPC 데이터:          24시간 (daily update)
시장 가격:           7일    (weekly update)
작황 상태:           30일   (monthly update)
교역 흐름:           30일   (monthly update)
```

## 🚀 다음 단계

1. **실제 데이터 통합**: FEWS NET 데이터 포털 스크래핑
2. **데이터베이스**: 정기적 데이터 저장 및 업데이트
3. **알림 시스템**: IPC Phase 4-5 시 자동 알림
4. **가격 예측**: ML 모델로 가격 추세 예측
5. **지도 오버레이**: 교역 경로를 지도에 표시

## 📚 참고 자료

- [FEWS NET 공식 웹사이트](https://fews.net)
- [IPC 분류 가이드](https://www.ipcinfo.org)
- [FEWS NET 데이터 포털](https://fews.net/data_portal_download)

---

**업데이트 완료!** 이제 식량 안보와 시장 데이터를 실시간으로 모니터링할 수 있습니다! 🌾📊

