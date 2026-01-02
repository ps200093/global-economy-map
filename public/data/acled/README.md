# ACLED 데이터 저장소

이 디렉토리는 ACLED (Armed Conflict Location & Event Data) 데이터 파일을 저장하는 곳입니다.

## 📥 데이터 다운로드 방법

### 1. ACLED 웹사이트에서 데이터 다운로드

1. https://acleddata.com/data-export-tool/ 방문
2. 필요한 지역/국가 선택
3. 날짜 범위 설정 (예: 최근 1년)
4. CSV 형식으로 다운로드

### 2. 파일 저장

다운로드한 파일을 이 디렉토리에 저장:

```
public/data/acled/
├── acled_all_data.csv           # 전체 데이터
├── acled_africa.csv             # 아프리카
├── acled_middle_east.csv        # 중동
├── acled_asia.csv               # 아시아
└── acled_americas.csv           # 아메리카
```

## 📁 파일 형식

### CSV 형식 (ACLED 표준)

```csv
event_id_cnty,event_date,year,event_type,sub_event_type,country,region,latitude,longitude,fatalities,notes
SOM001,2024-12-15,2024,Battles,Armed clash,Somalia,Eastern Africa,2.0469,-45.3438,12,Armed clash between forces
YEM002,2024-12-10,2024,Violence against civilians,Attack,Yemen,Middle East,15.5527,48.5164,8,Airstrike on area
```

### 필수 필드

- `event_id_cnty`: 고유 이벤트 ID
- `event_date`: 날짜 (YYYY-MM-DD)
- `year`: 년도
- `event_type`: 이벤트 타입
- `country`: 국가명
- `latitude`, `longitude`: 좌표
- `fatalities`: 사망자 수

## 🔄 데이터 업데이트

ACLED 데이터는 주기적으로 업데이트되므로, 정기적으로 새 파일을 다운로드하여 교체하세요.

**권장 업데이트 주기**: 매주 또는 매월

## 📊 데이터 범위

추천 설정:
- **기간**: 최근 12개월
- **지역**: 관심 지역만 선택 (용량 절약)
- **이벤트 타입**: 전체 또는 Battles, Violence against civilians

## 💾 파일 크기

- 전 세계 1년 데이터: ~50-100MB
- 특정 지역 1년: ~5-20MB

## 🚫 주의사항

- **대용량 파일**: .gitignore에 이미 추가됨 (Git에 커밋되지 않음)
- **라이선스**: ACLED 데이터 사용 시 출처 명시 필요
- **업데이트**: 오래된 데이터는 삭제하고 새 데이터로 교체

## 📝 출처 명시

ACLED 데이터 사용 시 다음과 같이 출처를 명시해주세요:

```
Raleigh, Clionadh, Andrew Linke, Håvard Hegre and Joakim Karlsen. 
Introducing ACLED: An Armed Conflict Location and Event Dataset. 
Journal of Peace Research 47(5) 651-660.
```

