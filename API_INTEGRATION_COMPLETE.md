# API 통합 완료

## 생성된 API 엔드포인트

### 1. 지역 데이터 API (`/api/regions`)

**GET** - 모든 지역의 통합 데이터 가져오기
```bash
curl http://localhost:3000/api/regions
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-saharan-africa",
      "name": "사하라 이남 아프리카",
      "coordinates": [0, 20],
      "economy": { "gdpPerCapita": 1500, ... },
      "social": { "population": 1100000000, ... },
      "categories": ["빈곤", "기아/식량부족", ...],
      "urgencyLevel": "critical"
    }
  ],
  "count": 6
}
```

**POST** - 특정 지역 데이터 가져오기
```bash
curl -X POST http://localhost:3000/api/regions \
  -H "Content-Type: application/json" \
  -d '{"regionId": "south-asia"}'
```

### 2. 기부 단체 API (`/api/charities`)

**GET** - 모든 기부 단체 목록
```bash
# 전체 목록
curl http://localhost:3000/api/charities

# 카테고리별 필터링
curl http://localhost:3000/api/charities?category=빈곤

# 지역별 필터링
curl http://localhost:3000/api/charities?region=sub-saharan-africa
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "unicef",
      "ein": "131623861",
      "name": "UNICEF USA",
      "description": "...",
      "transparencyScore": 95,
      "rating": 4.8,
      "focusAreas": ["빈곤", "교육", "보건/의료"],
      "financialData": {
        "totalRevenue": 1000000,
        "programExpenses": 850000,
        ...
      }
    }
  ],
  "count": 8
}
```

**POST** - 특정 기부 단체 상세 정보 (EIN 기반)
```bash
curl -X POST http://localhost:3000/api/charities \
  -H "Content-Type: application/json" \
  -d '{"ein": "131623861"}'
```

### 3. 위기 데이터 API (`/api/crisis`)

**GET** - 국가별 위기 데이터
```bash
# 전체 위기 데이터
curl http://localhost:3000/api/crisis?country=SYR

# 특정 타입만
curl http://localhost:3000/api/crisis?country=YEM&type=conflict
curl http://localhost:3000/api/crisis?country=HTI&type=disaster
curl http://localhost:3000/api/crisis?country=SOM&type=food
curl http://localhost:3000/api/crisis?country=UKR&type=refugee
```

**응답 예시:**
```json
{
  "success": true,
  "country": "SYR",
  "data": {
    "conflicts": [...],
    "disasters": [...],
    "foodSecurity": {...},
    "refugees": [...]
  }
}
```

## 프론트엔드 통합

### page.tsx 변경사항

1. **API 호출로 데이터 로드**
   - Mock 데이터 파일 import 제거
   - `fetch('/api/regions')` 및 `fetch('/api/charities')` 사용

2. **데이터 변환**
   - `EnhancedRegionData` → `RegionData`
   - `EnhancedCharityOrganization` → `CharityOrganization`

3. **로딩 및 에러 처리**
   - 로딩 상태: 스피너 표시
   - 에러 발생: 샘플 데이터로 폴백
   - 재시도 버튼 제공

## 데이터 흐름

```
사용자 → page.tsx → API Routes → Services → 외부 API
                                          ↓
                                    ACLED Excel 파일
```

1. **page.tsx**: 사용자 인터페이스
2. **API Routes**: Next.js API 엔드포인트
   - `/api/regions/route.ts`
   - `/api/charities/route.ts`
   - `/api/crisis/route.ts`
3. **Services**: 데이터 수집 및 처리
   - `integrated-data.ts`: 모든 서비스 통합
   - `worldbank.ts`: 경제 지표
   - `acled.ts`: 분쟁 데이터 (Excel)
   - `unhcr.ts`: 난민 데이터
   - `gdacs.ts`: 재난 알림
   - `fews.ts`: 식량 안보
   - `charity-financials.ts`: 기부 단체 재무

## 실제 사용 데이터 소스

✅ **World Bank API**: 경제 지표, 인구, 빈곤율
✅ **ACLED Excel**: 분쟁 및 폭력 사건
✅ **UNHCR API**: 난민 통계
✅ **GDACS API**: 자연재해 알림
✅ **FEWS NET API**: 식량 안보 및 IPC 단계
✅ **IRS Form 990**: 미국 비영리 단체 재무

## 캐싱 전략

모든 API는 Next.js의 `revalidate` 옵션 사용:

- World Bank: 24시간
- ACLED: 로컬 파일 (업데이트 시 수동)
- UNHCR: 7일
- GDACS: 1시간
- FEWS NET: 24시간
- IRS Form 990: 30일

## 다음 단계

1. **성능 최적화**
   - API 응답 시간 모니터링
   - 필요시 Redis 캐싱 추가

2. **에러 핸들링 개선**
   - 각 서비스별 재시도 로직
   - 부분 실패 시 graceful degradation

3. **데이터 품질**
   - 누락된 데이터 처리
   - 이상치 필터링

4. **모니터링**
   - API 호출 로깅
   - 성공/실패율 추적

