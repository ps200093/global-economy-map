# Global Economy Monitor - 실시간 경제 위기 지도 & 기부 플랫폼

세계 각 지역의 경제적 위기를 실시간으로 시각화하고, 검증된 기부 단체의 재무 정보를 투명하게 제공하는 인터랙티브 웹 애플리케이션입니다.

## 🌟 주요 기능

### 1. 다층 데이터 통합 시스템
- **9개 주요 데이터 소스** 통합
- World Bank API - 경제 지표 (빈곤율, GDP, 실업률 등)
- ACLED API - 전쟁/분쟁 데이터
- UNHCR API - 난민 통계
- GDACS API - 자연재해 알림
- FEWS NET - 식량 안보 데이터
- UNESCO/WHO - 교육/보건 지표
- IRS Form 990 - 기부 단체 재무제표

### 2. 인터랙티브 세계 지도
- **카테고리별 필터링**: 전쟁/분쟁, 기아, 빈곤, 교육, 보건, 난민, 재해, 환경
- 지역별 긴급도 레벨 (Critical/High/Medium/Low)
- 실시간 데이터 시각화
- 지역 클릭 시 상세 정보 패널

### 3. 기부 단체 재무 분석
- **IRS Form 990 기반** 재무 건전성 분석
- 프로그램비/관리비/모금비 비율 분석
- 효율성 지표 자동 계산
- A+ ~ F 등급 시스템
- 투명성 점수 (0-100)

### 4. 기부 단체 지도 오버레이
- 단체별 활동 지역 표시
- 사이드바에서 단체 선택 시 지도에 하이라이트
- 지역별 추천 기부 단체

### 5. 분야별 데이터 시각화
- 경제 지표 비교 차트
- 위기 유형별 영향 인구
- 지역별 통계 대시보드

## 🛠️ 기술 스택

```
Frontend:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Leaflet (지도)
- Recharts (차트)
- Lucide React (아이콘)

Data Layer:
- World Bank API
- ACLED API
- UNHCR API
- GDACS API
- FEWS NET Data
- ProPublica Nonprofit Explorer API

Deployment:
- Vercel (추천)
- ISR (Incremental Static Regeneration)
```

## 🚀 빠른 시작

### 1. 설치

```bash
cd global-economy-map
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

필수 API 키 설정:
```env
# ACLED API (선택사항, Mock 데이터로 대체 가능)
ACLED_API_KEY=your_key_here
ACLED_EMAIL=your_email@example.com
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
global-economy-map/
├── app/
│   ├── page.tsx                 # 메인 페이지
│   ├── layout.tsx               # 루트 레이아웃
│   └── globals.css              # 글로벌 스타일
├── components/
│   ├── WorldMap.tsx             # 세계 지도 (Leaflet)
│   ├── GlobalStatsDashboard.tsx # 통계 대시보드
│   ├── RegionCharts.tsx         # 데이터 차트
│   ├── RegionDetailPanel.tsx    # 지역 상세 패널
│   ├── CharityList.tsx          # 기부 단체 목록
│   ├── CharitySidebar.tsx       # 기부 단체 사이드바 (NEW)
│   ├── CategoryFilter.tsx       # 카테고리 필터 (NEW)
│   └── FinancialAnalysis.tsx    # 재무 분석 (NEW)
├── services/
│   ├── worldbank.ts             # World Bank API
│   ├── acled.ts                 # ACLED API
│   ├── unhcr.ts                 # UNHCR API
│   ├── gdacs.ts                 # GDACS API
│   ├── fews.ts                  # FEWS NET
│   ├── charity-financials.ts   # IRS Form 990
│   └── integrated-data.ts       # 통합 데이터 서비스
├── public/
│   └── data/
│       └── acled/               # ACLED 데이터 파일 (Excel)
├── types/
│   ├── index.ts                 # 기본 타입
│   └── api.ts                   # API 타입
└── utils/
    └── helpers.ts               # 유틸리티 함수
```

## 📊 데이터 소스 상세

### World Bank API
- **URL**: https://api.worldbank.org/v2
- **인증**: 불필요
- **제공 데이터**: 경제 지표, 빈곤, 교육, 보건 등
- **캐시**: 24시간

### ACLED (Armed Conflict Location & Event Data)
- **URL**: https://api.acleddata.com
- **인증**: API Key + Email (필수)
- **무료 플랜**: 월 2,500 요청
- **가입**: https://developer.acleddata.com
- **제공 데이터**: 전 세계 분쟁 이벤트

### UNHCR API
- **URL**: https://api.unhcr.org
- **인증**: 불필요
- **제공 데이터**: 난민 통계, 실향민 데이터
- **캐시**: 7일

### GDACS
- **URL**: https://www.gdacs.org/gdacsapi
- **인증**: 불필요
- **제공 데이터**: 실시간 재난 알림
- **캐시**: 1시간

### IRS Form 990 (ProPublica)
- **URL**: https://projects.propublica.org/nonprofits/api
- **인증**: 불필요
- **제공 데이터**: 미국 비영리 단체 재무제표
- **캐시**: 30일

## 🎯 주요 기능 상세

### 1. 카테고리별 필터링

사용자가 관심 있는 위기 유형을 선택하면:
- 해당 위기가 발생한 지역이 지도에 강조 표시
- 관련 기부 단체만 사이드바에 표시
- 실시간으로 필터 적용

```typescript
const categories = [
  '전쟁/분쟁', '기아/식량부족', '빈곤', 
  '교육', '보건/의료', '난민', '자연재해', '환경'
];
```

### 2. 재무 분석 시스템

각 기부 단체의 효율성을 객관적으로 평가:

**프로그램비 비율**
- 목표: 75% 이상
- 계산: (프로그램 지출 / 총 지출) × 100

**관리비 비율**
- 목표: 15% 이하
- 계산: (관리 지출 / 총 지출) × 100

**모금비 비율**
- 목표: 10% 이하
- 계산: (모금 지출 / 총 지출) × 100

**재무 등급**
- A+ ~ F 등급 자동 계산
- 4가지 지표 종합 평가

### 3. 지도 오버레이

기부 단체 선택 시:
- 해당 단체가 활동하는 모든 지역에 마커 표시
- 지역별 활동 강도 표시
- 실시간 연결선 애니메이션

## 🔧 커스터마이징

### 새로운 지역 추가

`services/integrated-data.ts`에서 데이터 처리:

```typescript
// World Bank API 등을 통해 실제 데이터 가져오기
const regionData = await getWorldBankData(countryCode);
```

### 새로운 기부 단체 추가

기부 단체 데이터는 IRS Form 990 API를 통해 자동으로 가져옵니다:

```typescript
// services/charity-financials.ts
const financials = await getCharityFinancials(ein);
```

미국 외 단체를 추가하려면 `services/integrated-data.ts`에서 수동으로 데이터를 추가할 수 있습니다.

### ACLED 데이터 파일 업데이트

1. ACLED 웹사이트에서 Excel 파일 다운로드
2. `public/data/acled/` 디렉토리에 파일 저장
3. 자세한 가이드: `ACLED_EXCEL_FILES.md` 참조

### API 키 설정

대부분의 API는 키가 필요 없지만, 일부 서비스는 키가 필요할 수 있습니다.
`.env.local` 파일에 추가:
```env
# 필요한 경우만
NEXT_PUBLIC_API_KEY=your_key
```

## 📈 성능 최적화

### 캐싱 전략
- World Bank: 24시간 (경제 지표는 자주 변하지 않음)
- ACLED: 24시간 (분쟁 데이터)
- UNHCR: 7일 (난민 통계는 월별 업데이트)
- GDACS: 1시간 (재난 알림은 실시간성 중요)
- 재무 데이터: 30일 (연간 보고서)

### ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 86400; // 24시간
```

### 동적 임포트
```typescript
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false, // Leaflet은 SSR 불가
});
```

## 🚧 향후 개선 사항

### Phase 1 (즉시 가능)
- [ ] 리뷰 시스템 추가 (Firebase/Supabase)
- [ ] 사용자 계정 시스템
- [ ] 기부 이력 추적
- [ ] 다국어 지원 (i18n)

### Phase 2 (추가 API 필요)
- [ ] WHO API 통합 (의료 데이터)
- [ ] UNESCO API 통합 (교육 데이터)
- [ ] Charity Navigator API (유료)
- [ ] 실시간 알림 시스템

### Phase 3 (고급 기능)
- [ ] AI 기반 기부 추천
- [ ] 블록체인 기부 추적
- [ ] 소셜 미디어 통합
- [ ] 모바일 앱 (React Native)

## 💡 사용 팁

1. **API 키 없이 테스트**: Mock 데이터로도 전체 기능 테스트 가능
2. **카테고리 필터**: 여러 개 동시 선택 가능
3. **재무 등급**: A+ 받으려면 4가지 지표 모두 우수해야 함
4. **지도 줌**: 마우스 휠 또는 +/- 버튼
5. **모바일**: 반응형 디자인으로 모든 기기 지원

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 교육 목적으로 제공됩니다. 

**데이터 출처 명시 필수:**
- World Bank, UN, UNHCR, ACLED 등의 데이터 사용 시 출처 표기
- 기부 단체 정보는 각 단체의 공식 웹사이트 확인 필요

## 🙋 FAQ

**Q: API 키 없이 사용 가능한가요?**
A: 네, Mock 데이터로 전체 기능을 테스트할 수 있습니다.

**Q: 실제 기부가 가능한가요?**
A: 각 기부 단체의 공식 기부 링크로 연결됩니다.

**Q: 데이터는 얼마나 자주 업데이트되나요?**
A: API별로 다르며, 캐싱 전략에 따라 24시간~30일입니다.

**Q: 한국 기부 단체도 추가할 수 있나요?**
A: 네, `data/enhanced-charities.ts`에 추가하면 됩니다.

**Q: 모바일에서도 사용 가능한가요?**
A: 네, 완전 반응형 디자인입니다.

## 📧 문의

프로젝트 관련 문의나 제안사항이 있으시면 이슈를 등록해주세요.

---

**함께 만드는 더 나은 세상** 🌏✨

Made with ❤️ for education and social good
