// API: 국가별 상세 교육 데이터
import { NextResponse } from 'next/server';
import { getWorldBankIndicator, WB_INDICATORS } from '@/services/worldbank';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ iso3: string }> }
) {
  try {
    const { iso3 } = await params;

    if (!iso3 || iso3.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid ISO3 code' },
        { status: 400 }
      );
    }

    // 교육 데이터는 업데이트 주기가 느려서 더 넓은 기간(2010-현재)의 데이터를 가져옴
    const startYear = 2010;
    const endYear = new Date().getFullYear();

    // 교육 관련 지표들을 병렬로 가져오기
    const [
      literacyRate,
      literacyYouth,
      literacyFemale,
      literacyMale,
      primaryEnrollment,
      secondaryEnrollment,
      tertiaryEnrollment,
      preprimaryEnrollment,
      primaryCompletion,
      lowerSecondaryCompletion,
      upperSecondaryCompletion,
      outOfSchoolPrimary,
      outOfSchoolSecondary,
      pupilTeacherPrimary,
      pupilTeacherSecondary,
      trainedTeachersPrimary,
      educationExpenditure,
      govtExpenditureEducation,
      expectedYearsSchooling,
      childrenOutOfSchool,
    ] = await Promise.all([
      getWorldBankIndicator(iso3, WB_INDICATORS.LITERACY_RATE, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.LITERACY_YOUTH, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.LITERACY_FEMALE, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.LITERACY_MALE, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.PRIMARY_ENROLLMENT, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.SECONDARY_ENROLLMENT, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.TERTIARY_ENROLLMENT, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.SCHOOL_ENROLLMENT_PREPRIMARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.PRIMARY_COMPLETION, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.LOWER_SECONDARY_COMPLETION, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.UPPER_SECONDARY_COMPLETION, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.OUT_OF_SCHOOL_PRIMARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.OUT_OF_SCHOOL_SECONDARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.PUPIL_TEACHER_PRIMARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.PUPIL_TEACHER_SECONDARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.TRAINED_TEACHERS_PRIMARY, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.EDUCATION_EXPENDITURE, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.GOVT_EXPENDITURE_EDUCATION, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.EXPECTED_YEARS_SCHOOLING, startYear, endYear),
      getWorldBankIndicator(iso3, WB_INDICATORS.CHILDREN_OUT_OF_SCHOOL, startYear, endYear),
    ]);

    // 최신 값 추출
    const getLatestValue = (data: any[]) => {
      const latest = data.find((d) => d.value !== null);
      return {
        value: latest?.value ?? null,
        year: latest?.date ?? null,
      };
    };

    // 연도별 트렌드 데이터 추출 (최근 10년)
    const getYearlyTrend = (data: any[]) => {
      return data
        .filter((d) => d.value !== null)
        .sort((a, b) => parseInt(b.date) - parseInt(a.date))
        .slice(0, 10)
        .map((d) => ({
          year: parseInt(d.date),
          value: d.value,
        }))
        .reverse();
    };

    const educationData = {
      literacy: {
        overall: getLatestValue(literacyRate),
        youth: getLatestValue(literacyYouth),
        female: getLatestValue(literacyFemale),
        male: getLatestValue(literacyMale),
        trend: getYearlyTrend(literacyRate),
      },
      enrollment: {
        preprimary: getLatestValue(preprimaryEnrollment),
        primary: getLatestValue(primaryEnrollment),
        secondary: getLatestValue(secondaryEnrollment),
        tertiary: getLatestValue(tertiaryEnrollment),
      },
      completion: {
        primary: getLatestValue(primaryCompletion),
        lowerSecondary: getLatestValue(lowerSecondaryCompletion),
        upperSecondary: getLatestValue(upperSecondaryCompletion),
      },
      outOfSchool: {
        primary: getLatestValue(outOfSchoolPrimary),
        secondary: getLatestValue(outOfSchoolSecondary),
        childrenCount: getLatestValue(childrenOutOfSchool),
      },
      quality: {
        pupilTeacherPrimary: getLatestValue(pupilTeacherPrimary),
        pupilTeacherSecondary: getLatestValue(pupilTeacherSecondary),
        trainedTeachers: getLatestValue(trainedTeachersPrimary),
      },
      expenditure: {
        percentGdp: getLatestValue(educationExpenditure),
        percentGovt: getLatestValue(govtExpenditureEducation),
      },
      outcomes: {
        expectedYearsSchooling: getLatestValue(expectedYearsSchooling),
      },
    };

    return NextResponse.json({
      success: true,
      data: educationData,
    });

  } catch (error: any) {
    console.error('Error fetching education data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

