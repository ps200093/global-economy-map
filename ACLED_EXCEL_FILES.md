# ✅ ACLED Excel 파일 사용 완료!

## 📊 다운로드된 파일

```
data/acled/
├── Africa_aggregated_data_up_to-2025-12-06.xlsx                          (11MB)
├── Asia-Pacific_aggregated_data_up_to-2025-12-06.xlsx                    (8.5MB)
├── Middle-East_aggregated_data_up_to-2025-12-06.xlsx                     (5.9MB)
├── Latin-America-the-Caribbean_aggregated_data_up_to-2025-12-06.xlsx     (6.9MB)
├── Europe-Central-Asia_aggregated_data_up_to-2025-12-06.xlsx             (4.7MB)
├── US-and-Canada_aggregated_data_up_to-2025-12-06.xlsx                   (928KB)
│
└── 통계 파일:
    ├── number_of_reported_civilian_fatalities_by_country-year_as-of-12Dec2025.xlsx
    ├── number_of_reported_fatalities_by_country-year_as-of-12Dec2025.xlsx
    ├── number_of_events_targeting_civilians_by_country-year_as-of-12Dec2025.xlsx
    ├── number_of_demonstration_events_by_country-year_as-of-12Dec2025.xlsx
    ├── number_of_political_violence_events_by_country-month-year_as-of-12Dec2025.xlsx
    └── number_of_political_violence_events_by_country-year_as-of-12Dec2025.xlsx
```

## 🎯 자동 지역 감지

시스템이 자동으로 국가에 맞는 파일을 선택합니다:

```typescript
getConflictData('Somalia')  → Africa 파일 사용
getConflictData('Yemen')    → Middle-East 파일 사용
getConflictData('Myanmar')  → Asia-Pacific 파일 사용
```

### 지역별 국가 매핑

| 지역 | 국가 예시 |
|------|----------|
| **Africa** | Somalia, Ethiopia, Kenya, Nigeria, South Sudan, Mali, Niger |
| **Middle East** | Yemen, Syria, Iraq, Lebanon, Palestine, Israel |
| **Asia** | Afghanistan, Pakistan, India, Bangladesh, Myanmar, Philippines |
| **Europe** | Ukraine, Russia, Georgia, Armenia, Azerbaijan |
| **Americas** | Mexico, Colombia, Haiti, Venezuela, Brazil |

## 🚀 사용 방법

### 1. 기본 사용

```typescript
import { getConflictData } from '@/services/acled';

// 특정 국가의 분쟁 데이터
const events = await getConflictData('Somalia');

// 날짜 범위 지정
const recent = await getConflictData(
  'Yemen',
  '2024-01-01',
  '2024-12-31'
);
```

### 2. 지역별 데이터

```typescript
import { getConflictDataByRegion } from '@/services/acled';

// 아프리카 전체
const africa = await getConflictDataByRegion('africa');

// 중동 전체
const middleEast = await getConflictDataByRegion('middle-east');

// 특정 국가만 (지역 내에서)
const somalia = await getConflictDataByRegion('africa', 'Somalia');
```

### 3. 통계 데이터

```typescript
import { getConflictStats } from '@/services/acled';

const stats = await getConflictStats('Syria');
console.log(stats);
// {
//   totalEvents: 1234,
//   totalFatalities: 5678,
//   eventTypes: { 'Battles': 500, 'Violence against civilians': 300, ... },
//   recentEvents: [...]
// }
```

### 4. 월별 추세

```typescript
import { getMonthlyTrend } from '@/services/acled';

const trend = await getMonthlyTrend('Ukraine');
// [
//   { month: '2024-01', events: 145, fatalities: 320 },
//   { month: '2024-02', events: 132, fatalities: 289 },
//   ...
// ]
```

### 5. 연도별 통계

```typescript
import { getYearlyStats } from '@/services/acled';

const yearly = await getYearlyStats('Afghanistan');
// {
//   violence: [...],
//   fatalities: [...],
//   civilianFatalities: [...],
//   demonstrations: [...]
// }
```

## 📁 파일 구조

### 지역별 집계 데이터 (Aggregated Data)

각 Excel 파일에는 다음 정보가 포함:
- event_id_cnty: 이벤트 ID
- event_date: 날짜
- country: 국가
- region: 지역
- event_type: 이벤트 타입
- latitude, longitude: 좌표
- fatalities: 사망자 수
- notes: 상세 설명

### 통계 파일 (Statistics Files)

1. **폭력 이벤트 (Political Violence)**
   - 월별: `number_of_political_violence_events_by_country-month-year`
   - 연도별: `number_of_political_violence_events_by_country-year`

2. **사망자 통계 (Fatalities)**
   - 전체: `number_of_reported_fatalities_by_country-year`
   - 민간인: `number_of_reported_civilian_fatalities_by_country-year`

3. **민간인 대상 이벤트**
   - `number_of_events_targeting_civilians_by_country-year`

4. **시위 (Demonstrations)**
   - `number_of_demonstration_events_by_country-year`

## 🔧 자동 처리 기능

### Excel 파일 자동 읽기
```typescript
// xlsx 라이브러리 사용
const workbook = XLSX.read(arrayBuffer);
const data = XLSX.utils.sheet_to_json(worksheet);
```

### 필드명 자동 매핑
```typescript
// 대소문자 구분 없이 필드 찾기
row['event_type'] || row['EVENT_TYPE']
row['country'] || row['COUNTRY']
```

### 날짜 필터링
```typescript
// 자동으로 날짜 범위 적용
events.filter(e => e.event_date >= startDate && e.event_date <= endDate)
```

## 📊 데이터 범위

- **시작**: 과거 데이터부터
- **종료**: 2025-12-06까지
- **총 데이터**: ~40MB (6개 지역 파일)
- **업데이트**: 2025년 12월 12일 기준

## 🔄 데이터 업데이트

### 새 파일 받기

1. **ACLED 웹사이트**
   - https://acleddata.com/data-export-tool/
   - 또는 https://acleddata.com/dashboard/

2. **Download Data Files** 섹션에서
   - "Aggregated data" 다운로드
   - 지역별 Excel 파일 받기

3. **파일 교체**
   ```
   data/acled/ 폴더에 새 파일 복사
   기존 파일 덮어쓰기
   ```

4. **서버 재시작**
   ```bash
   npm run dev
   ```

## 💾 파일 크기

| 파일 | 크기 | 예상 이벤트 수 |
|------|------|---------------|
| Africa | 11MB | ~50,000+ |
| Asia-Pacific | 8.5MB | ~35,000+ |
| Middle-East | 5.9MB | ~25,000+ |
| Americas | 6.9MB | ~30,000+ |
| Europe | 4.7MB | ~20,000+ |
| US-Canada | 928KB | ~4,000+ |

## 🎨 통합 기능

### integrated-data.ts 자동 연동

```typescript
// 자동으로 ACLED 데이터 로드
const conflicts = await getConflictData(country, startDate, endDate);

// 통계 자동 생성
const stats = await getConflictStats(country);
```

### 지도에 자동 표시

- 좌표 정보 포함 (latitude, longitude)
- 자동으로 지도 마커 생성
- 이벤트 타입별 색상 구분

## ⚡ 성능 최적화

### 브라우저 캐싱
```typescript
fetch(filePath, { cache: 'force-cache' })
```

### 필요한 지역만 로드
```typescript
// 불필요한 지역 파일은 로드하지 않음
getConflictData('Somalia')  // Africa 파일만 로드
```

### 제한된 결과 반환
```typescript
getConflictData('Yemen', undefined, undefined, 500)  // 최대 500개
```

## 🚫 주의사항

### Git 저장소
- ✅ Excel 파일들은 Git에 포함됨
- ⚠️ 대용량이므로 push 시간 소요 가능
- 💡 LFS 사용 권장 (선택사항)

### 파일 위치
- ❌ `public/data/acled/` 아님
- ✅ `data/acled/` 정확한 위치

### 브라우저 제한
- 큰 Excel 파일은 로딩 시간 소요
- 첫 로드 후 캐시됨
- 필터링으로 필요한 데이터만 사용

## 📝 데이터 출처

**ACLED (Armed Conflict Location & Event Data Project)**
- Website: https://acleddata.com
- License: CC BY-NC
- Citation Required: Yes

### 인용 방법

```
Raleigh, Clionadh, Andrew Linke, Håvard Hegre and Joakim Karlsen. 
Introducing ACLED: An Armed Conflict Location and Event Dataset. 
Journal of Peace Research 47(5) 651-660.
```

---

## ✅ 준비 완료!

**Excel 파일이 이미 설치되어 바로 사용 가능합니다!**

```bash
npm run dev
```

실제 ACLED 데이터가 자동으로 로드됩니다! 🎉

