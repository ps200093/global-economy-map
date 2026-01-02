# 🎉 ACLED 로컬 파일 시스템 완료!

ACLED API 대신 **로컬 CSV 파일**을 사용하도록 완전히 전환되었습니다!

## ✅ 생성된 구조

```
global-economy-map/
├── public/
│   └── data/
│       └── acled/
│           ├── README.md              ✅ 데이터 디렉토리 설명
│           └── sample_data.csv        ✅ 샘플 데이터 (10개 이벤트)
├── services/
│   └── acled.ts                       ✅ CSV 파일 읽기로 재작성
├── .gitignore                         ✅ 대용량 CSV 제외 설정
└── ACLED_DOWNLOAD_GUIDE.md           ✅ 다운로드 가이드
```

---

## 📥 사용 방법

### 1단계: ACLED 데이터 다운로드

1. **ACLED 웹사이트 방문**
   - https://acleddata.com/data-export-tool/

2. **데이터 선택**
   - 지역: Africa, Middle East, Asia 등
   - 날짜: 최근 12개월 권장
   - 형식: CSV

3. **파일 저장**
   ```
   public/data/acled/acled_africa.csv
   public/data/acled/acled_middle_east.csv
   ```

### 2단계: 서버 실행

```bash
npm run dev
```

데이터가 자동으로 로드됩니다!

---

## 🔧 새로운 기능

### CSV 파일 자동 파싱

```typescript
import { getConflictData } from '@/services/acled';

// 자동으로 CSV 파일 읽기
const events = await getConflictData('Somalia');
```

### 지역별 파일 지원

```typescript
import { getConflictDataByRegion } from '@/services/acled';

// 여러 파일에서 데이터 통합
const africaEvents = await getConflictDataByRegion('africa');
```

### 국가 목록 가져오기

```typescript
import { getAvailableCountries } from '@/services/acled';

const countries = await getAvailableCountries();
// ['Somalia', 'Yemen', 'Syria', ...]
```

### 월별 추세 분석

```typescript
import { getMonthlyTrend } from '@/services/acled';

const trend = await getMonthlyTrend('Yemen');
// [{ month: '2024-01', events: 45, fatalities: 120 }, ...]
```

---

## 📊 지원하는 파일 구조

### 옵션 1: 지역별 파일 (권장)

```
public/data/acled/
├── acled_africa.csv
├── acled_middle_east.csv
├── acled_asia.csv
└── acled_americas.csv
```

### 옵션 2: 단일 파일

```
public/data/acled/
└── acled_all_data.csv
```

### 옵션 3: 국가별 파일

```
public/data/acled/
├── acled_somalia.csv
├── acled_yemen.csv
└── acled_syria.csv
```

---

## 🎯 파일 매핑

서비스는 자동으로 다음 파일들을 찾습니다:

```typescript
const REGION_FILES = {
  'africa': ['acled_africa.csv', 'sample_data.csv'],
  'middle-east': ['acled_middle_east.csv', 'sample_data.csv'],
  'asia': ['acled_asia.csv', 'sample_data.csv'],
  'americas': ['acled_americas.csv', 'sample_data.csv'],
  'all': ['acled_all_data.csv', 'sample_data.csv'],
};
```

파일이 없으면 `sample_data.csv`를 사용합니다.

---

## 📝 CSV 형식

**필수 컬럼:**

```csv
event_id_cnty,event_date,year,event_type,sub_event_type,country,region,latitude,longitude,fatalities,notes
SOM001,2024-12-15,2024,Battles,Armed clash,Somalia,Eastern Africa,2.0469,-45.3438,12,Description
```

**컬럼 설명:**
- `event_id_cnty`: 고유 ID
- `event_date`: YYYY-MM-DD 형식
- `country`: 국가명 (영문)
- `latitude`, `longitude`: 좌표
- `fatalities`: 사망자 수
- `notes`: 설명

---

## 🔄 데이터 업데이트

### 수동 업데이트

1. ACLED에서 최신 데이터 다운로드
2. `public/data/acled/` 폴더에 저장
3. 기존 파일 덮어쓰기
4. 브라우저 새로고침 (캐시 적용됨)

### 권장 업데이트 주기

- **개발**: 필요할 때
- **프로덕션**: 매주 또는 매월

---

## 🚫 Git 제외 설정

`.gitignore`에 자동으로 추가됨:

```gitignore
# ACLED 데이터 파일 (대용량)
public/data/acled/*.csv
!public/data/acled/sample_data.csv
```

**결과:**
- ✅ `sample_data.csv`만 Git에 포함
- ❌ 다른 CSV 파일은 제외 (대용량)

---

## 💾 파일 크기 가이드

| 범위 | 파일 크기 | 권장 용도 |
|------|----------|-----------|
| 샘플 (10개) | ~1KB | 개발/테스트 |
| 1개월 데이터 | ~5MB | 개발 |
| 6개월 데이터 | ~20MB | 프로덕션 |
| 12개월 데이터 | ~50MB | 프로덕션 |
| 전체 (수년) | ~200MB+ | 분석용 |

---

## 📚 참고 문서

- ✅ `public/data/acled/README.md` - 데이터 디렉토리 설명
- ✅ `ACLED_DOWNLOAD_GUIDE.md` - 상세 다운로드 가이드
- ✅ `services/acled.ts` - CSV 파싱 코드

---

## 🎉 장점

### ✅ API 키 불필요
- 승인 대기 없음
- 즉시 사용 가능

### ✅ 빠른 로딩
- 로컬 파일 = 네트워크 지연 없음
- 브라우저 캐시 활용

### ✅ 오프라인 작동
- 인터넷 없이도 작동
- 안정적인 데이터 접근

### ✅ 버전 관리
- 특정 시점의 데이터 보존
- 재현 가능한 분석

### ✅ 비용 절감
- API 호출 제한 없음
- 무료로 사용

---

## 🚀 시작하기

### 빠른 테스트 (샘플 데이터)

```bash
# 이미 준비됨!
npm run dev
```

### 실제 데이터 사용

1. **다운로드**: https://acleddata.com/data-export-tool/
2. **저장**: `public/data/acled/acled_africa.csv`
3. **실행**: `npm run dev`

---

## 📞 문제 해결

### Q: 데이터가 안 나옵니다
A: 
1. 파일 위치 확인: `public/data/acled/`
2. 파일명 확인: CSV 형식
3. 브라우저 콘솔에서 에러 확인

### Q: 특정 국가만 필요합니다
A: ACLED에서 해당 국가만 선택하여 다운로드

### Q: 파일이 너무 큽니다
A: 날짜 범위를 줄이거나 지역별로 분할

---

**준비 완료!** 이제 ACLED 데이터를 다운로드해서 사용하세요! 🎊

**샘플 데이터로 바로 테스트 가능합니다!**

