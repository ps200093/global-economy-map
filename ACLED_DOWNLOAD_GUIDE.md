# ACLED 데이터 다운로드 가이드

## 🌐 ACLED 웹사이트에서 데이터 다운로드

### 1단계: ACLED 웹사이트 접속

https://acleddata.com/data-export-tool/

### 2단계: 데이터 선택

#### 지역 선택
- ✅ **Africa**: 아프리카 전체
- ✅ **Middle East**: 중동 지역
- ✅ **South Asia**: 남아시아
- ✅ **Southeast Asia**: 동남아시아
- ✅ **Central America**: 중앙아메리카

또는 특정 국가만 선택:
- Somalia
- Yemen
- Syria
- Afghanistan
- Ethiopia
- 등등...

#### 날짜 범위
- **시작일**: 2024-01-01 (1년 전부터)
- **종료일**: 현재 날짜
- **권장**: 최근 12개월

#### 이벤트 타입 (전체 또는 선택)
- Battles (전투)
- Violence against civilians (민간인 대상 폭력)
- Explosions/Remote violence (폭발/원거리 폭력)
- Protests (시위)
- Riots (폭동)
- Strategic developments (전략적 발전)

### 3단계: 다운로드

1. **Export** 버튼 클릭
2. **CSV** 형식 선택
3. 파일 다운로드 대기 (대용량일 경우 시간 소요)

### 4단계: 파일 저장

다운로드한 파일을 다음 위치에 저장:

```
global-economy-map/public/data/acled/
```

**파일명 예시:**
- `acled_africa_2024.csv` - 아프리카 전체
- `acled_somalia.csv` - 소말리아만
- `acled_middle_east.csv` - 중동 지역
- `acled_all_data.csv` - 전체 데이터

## 📊 권장 데이터 구성

### 옵션 1: 지역별 파일 (권장)

```
public/data/acled/
├── acled_africa.csv          (~10-20MB)
├── acled_middle_east.csv     (~5-10MB)
├── acled_asia.csv            (~5-10MB)
└── acled_americas.csv        (~2-5MB)
```

**장점**: 
- 파일 크기 관리 용이
- 빠른 로딩
- 지역별 선택적 로딩 가능

### 옵션 2: 전체 데이터 (고급)

```
public/data/acled/
└── acled_all_data.csv        (~50-100MB)
```

**장점**: 
- 하나의 파일로 관리
- 전체 데이터 분석 가능

**단점**: 
- 큰 파일 크기
- 느린 초기 로딩

### 옵션 3: 국가별 파일 (세밀한 관리)

```
public/data/acled/
├── acled_somalia.csv
├── acled_yemen.csv
├── acled_syria.csv
├── acled_afghanistan.csv
└── acled_ethiopia.csv
```

## 🔄 서비스에서 사용하기

### 기본 사용

```typescript
import { getConflictData } from '@/services/acled';

// 특정 국가 데이터
const somaliaEvents = await getConflictData('Somalia');

// 날짜 범위 지정
const recentEvents = await getConflictData(
  'Yemen',
  '2024-01-01',
  '2024-12-31'
);
```

### 지역별 파일 사용

```typescript
import { getConflictDataByRegion } from '@/services/acled';

// 아프리카 전체
const africaEvents = await getConflictDataByRegion('africa');

// 중동 전체
const middleEastEvents = await getConflictDataByRegion('middle-east');
```

### 통계 가져오기

```typescript
import { getConflictStats } from '@/services/acled';

const stats = await getConflictStats('Somalia');
console.log(stats.totalEvents); // 총 이벤트 수
console.log(stats.totalFatalities); // 총 사망자 수
console.log(stats.eventTypes); // 이벤트 타입별 통계
```

## 📁 파일 형식 확인

다운로드한 CSV 파일이 다음 형식인지 확인하세요:

```csv
event_id_cnty,event_date,year,event_type,sub_event_type,country,region,latitude,longitude,fatalities,notes
SOM12345,2024-12-15,2024,Battles,Armed clash,Somalia,Eastern Africa,2.0469,-45.3438,12,Description...
```

**필수 컬럼:**
- event_id_cnty
- event_date
- year
- event_type
- country
- latitude, longitude
- fatalities

## ⚙️ 파일 업데이트

### 정기 업데이트 (권장)

**주기**: 매주 또는 매월
**방법**: 
1. ACLED 웹사이트에서 최신 데이터 다운로드
2. 기존 파일 백업 (선택사항)
3. 새 파일로 교체
4. 서버 재시작 (개발 환경)

### 자동화 (고급)

나중에 스크립트로 자동화 가능:
```bash
# 매주 일요일 자동 다운로드 (예시)
0 0 * * 0 /path/to/download-acled-data.sh
```

## 📝 데이터 크기 관리

### .gitignore 확인

```gitignore
# ACLED 데이터 파일 (대용량)
public/data/acled/*.csv
!public/data/acled/sample_data.csv
```

### 권장 용량

- **개발**: 샘플 데이터 또는 최근 3개월
- **프로덕션**: 최근 12개월
- **전체 분석**: 최근 24개월

## 🔗 유용한 링크

- [ACLED 데이터 포털](https://acleddata.com/data-export-tool/)
- [ACLED 사용 가이드](https://acleddata.com/acleddatanew/quick-guide-to-acled-data/)
- [ACLED 코드북](https://acleddata.com/acleddatanew/wp-content/uploads/dlm_uploads/2021/11/ACLED_Codebook_2021.pdf)

## ❓ 문제 해결

### Q: 파일이 너무 큽니다
A: 지역별로 나누거나 날짜 범위를 줄이세요

### Q: 데이터가 로드되지 않습니다
A: 
1. 파일 경로 확인: `public/data/acled/`
2. CSV 형식 확인
3. 브라우저 콘솔에서 에러 확인

### Q: 특정 국가가 없습니다
A: 해당 국가 데이터를 ACLED에서 별도로 다운로드하세요

---

**준비 완료!** 이제 ACLED 데이터를 다운로드하여 사용하세요! 🎉

