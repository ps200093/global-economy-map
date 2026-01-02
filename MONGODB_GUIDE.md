# 🌍 MongoDB 설정 및 데이터 수집 가이드

## 📋 필수 요구사항

1. **MongoDB 설치 및 실행**
   - 로컬: `localhost:27017`
   - 데이터베이스: `economy`
   - 컬렉션: `CountryBasic`

2. **Node.js 패키지 설치**
   ```bash
   npm install
   ```

---

## 🚀 데이터 수집 프로세스

### 1단계: MongoDB 실행 확인

```bash
# MongoDB가 실행 중인지 확인
mongosh --eval "db.adminCommand('ping')"
```

### 2단계: 환경 변수 설정

`.env.local` 파일 생성:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=economy
```

### 3단계: 전체 국가 데이터 수집

```bash
npm run fetch-countries
```

이 스크립트는:
- ✅ 195개국의 World Bank API 데이터 수집
- ✅ 국가별 취약도 점수 계산 (0-100)
- ✅ MongoDB에 자동 저장
- ⏱️ 예상 소요 시간: **약 10-15분**

### 4단계: 데이터 확인

```bash
# MongoDB Shell로 확인
mongosh

use economy
db.CountryBasic.countDocuments()  # 국가 수 확인
db.CountryBasic.find({ urgencyLevel: "critical" })  # 긴급 국가 조회
```

---

## 📊 국가 취약도 점수 시스템

### 점수 구성 (0-100점)

| 지표 | 가중치 | 설명 |
|------|--------|------|
| **빈곤** | 40% | 빈곤율, 지니계수 |
| **경제** | 20% | GDP per capita, 실업률 |
| **보건** | 20% | 기대수명, 영양부족률, 보건 지출 |
| **교육** | 10% | 문해율, 교육 지출 |
| **식량 안보** | 10% | 식량 생산 지수, 영양부족률 |

### 긴급도 레벨 (색상 구분)

- 🔴 **Critical (90-100점)**: 매우 긴급
- 🟠 **High (70-89점)**: 긴급
- 🟡 **Medium (50-69점)**: 주의
- 🟢 **Low (30-49점)**: 안정적
- ⚪ **Stable (0-29점)**: 매우 안정

---

## 🔌 API 엔드포인트

### 1. 전체 국가 조회

```
GET /api/countries
```

**쿼리 파라미터:**
- `urgency`: 긴급도 필터 (critical, high, medium, low, stable)
- `region`: 지역 필터 (e.g., "Eastern Africa")
- `minScore`: 최소 점수
- `maxScore`: 최대 점수
- `limit`: 결과 개수 (기본값: 200)
- `sortBy`: 정렬 기준 (overall, poverty, health, education, economy)

**예시:**
```bash
# 긴급 국가만 조회
curl http://localhost:3000/api/countries?urgency=critical

# 동아프리카 국가 조회
curl http://localhost:3000/api/countries?region=Eastern%20Africa

# 점수 70점 이상 국가
curl http://localhost:3000/api/countries?minScore=70
```

### 2. 특정 국가 조회

```
GET /api/countries/[iso3]
```

**예시:**
```bash
# 가나 데이터 조회
curl http://localhost:3000/api/countries/GHA

# 에티오피아 데이터 조회
curl http://localhost:3000/api/countries/ETH
```

---

## 📈 응답 예시

### 국가 데이터 구조

```json
{
  "iso3": "GHA",
  "name": "Ghana",
  "nameKo": "가나",
  "region": "Western Africa",
  "coordinates": [7.9465, -1.0232],
  
  "indicators": {
    "povertyRate": 23.4,
    "gdpPerCapita": 2363,
    "lifeExpectancy": 64.1,
    "literacyRate": 79.0,
    "malnutritionRate": 5.8,
    "population": 31072945
  },
  
  "scores": {
    "poverty": 28.5,
    "economy": 52.3,
    "health": 45.2,
    "education": 38.7,
    "foodSecurity": 35.1,
    "overall": 38.6
  },
  
  "urgencyLevel": "medium",
  "markerColor": "#EAB308",
  
  "accessLevels": {
    "education": "Medium",
    "water": "Low",
    "healthcare": "Medium",
    "foodSecurity": "Medium"
  },
  
  "recommendedSupport": [
    "Clean Water Infrastructure",
    "Education Programs",
    "Economic Development"
  ],
  
  "dataQuality": 81.8,
  "lastUpdated": "2026-01-02T...",
  "source": "World Bank API"
}
```

---

## 🔄 데이터 업데이트

### 정기 업데이트 (권장: 월 1회)

```bash
npm run fetch-countries
```

### 특정 국가만 업데이트

스크립트 수정 후:
```typescript
// scripts/fetchAllCountries.ts
const targetCountries = ['GHA', 'ETH', 'NGA']; // 업데이트할 국가
```

---

## 🛠️ 트러블슈팅

### MongoDB 연결 실패

```
❌ MongoDB connection error: connect ECONNREFUSED
```

**해결책:**
1. MongoDB 실행 확인: `mongosh`
2. 포트 확인: `netstat -an | findstr :27017`
3. 환경 변수 확인: `.env.local`

### World Bank API 타임아웃

```
❌ Error fetching XXX: timeout
```

**해결책:**
1. 배치 크기 줄이기 (5 → 3)
2. 대기 시간 늘리기 (2초 → 5초)
3. 나중에 다시 시도

### 데이터 품질 낮음

일부 국가는 World Bank API에 데이터가 부족할 수 있습니다.
- `dataQuality` 필드로 품질 확인 (0-100%)
- 낮은 품질 국가는 기본값 사용

---

## 📊 데이터 통계

수집 완료 후 통계 확인:

```bash
mongosh
use economy

# 긴급도별 분포
db.CountryBasic.aggregate([
  { $group: { _id: "$urgencyLevel", count: { $sum: 1 } } }
])

# 평균 점수
db.CountryBasic.aggregate([
  { $group: { _id: null, avgScore: { $avg: "$scores.overall" } } }
])

# 상위 10개 취약 국가
db.CountryBasic.find().sort({ "scores.overall": -1 }).limit(10)
```

---

## 🎯 다음 단계

1. ✅ MongoDB 데이터 수집 완료
2. 🔄 프론트엔드에서 `/api/countries` 사용
3. 🗺️ WorldMap에 195개국 마커 표시
4. 🎨 점수별 색상 적용
5. 📱 국가 클릭 → 상세 정보 패널

---

**문제가 있으면 알려주세요!** 🚀

