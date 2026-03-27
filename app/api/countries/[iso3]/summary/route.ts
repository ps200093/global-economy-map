import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  try {
    const { iso3 } = await context.params;
    const requestData = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local' 
        },
        { status: 500 }
      );
    }

    // 클라이언트에서 전달받은 모든 데이터
    const { 
      country: countryData, 
      economyData, 
      healthData, 
      educationData, 
      foodSecurityData, 
      conflictData, 
      refugeeData 
    } = requestData;

    // Generate prompt for summarizing country data
    let prompt = `Please analyze and summarize the following country data in English:

=== Basic Information ===
Country: ${countryData.name} (${countryData.iso3})
Population: ${countryData.population?.toLocaleString() || 'N/A'}
Region: ${countryData.region}
Overall Crisis Score: ${countryData.scores?.overall?.toFixed(1) || 'N/A'}/100
Urgency Level: ${countryData.urgencyLevel}
Recommended Support Areas: ${countryData.recommendedSupport?.join(', ') || 'N/A'}

=== Economic Indicators (Economy Tab) ===`;

    // Add Economy data
    if (economyData?.success && economyData.data) {
      const econ = economyData.data;
      prompt += `
- GDP per Capita: $${econ.gdpPerCapita?.toLocaleString() || 'N/A'}
- GDP Growth Rate: ${econ.gdpGrowth || 'N/A'}%
- Inflation Rate: ${econ.inflation || 'N/A'}%
- Unemployment Rate: ${econ.unemployment || 'N/A'}%
- Poverty Rate: ${econ.poverty || 'N/A'}%
- Gini Coefficient: ${econ.gini || 'N/A'}`;
    } else {
      prompt += `
- GDP per Capita: $${countryData.gdpPerCapita?.toLocaleString() || 'N/A'}
- Poverty Rate: ${countryData.indicators?.poverty || 'N/A'}%
- Unemployment Rate: ${countryData.indicators?.unemploymentRate || 'N/A'}%`;
    }

    // Add Health data
    prompt += `

=== Health Indicators (Health Tab) ===`;
    if (healthData?.success && healthData.data) {
      const health = healthData.data;
      prompt += `
- Life Expectancy: ${health.lifeExpectancy || 'N/A'} years
- Infant Mortality Rate: ${health.infantMortality || 'N/A'} (per 1,000)
- Under-5 Mortality Rate: ${health.under5Mortality || 'N/A'} (per 1,000)
- Maternal Mortality Rate: ${health.maternalMortality || 'N/A'} (per 100,000)
- Health Expenditure: ${health.healthExpenditure || 'N/A'}% of GDP
- Physicians: ${health.physicians || 'N/A'} (per 1,000)`;
    } else {
      prompt += `
- Life Expectancy: ${countryData.indicators?.lifeExpectancy || 'N/A'} years
- Malnutrition Rate: ${countryData.indicators?.malnutritionRate || 'N/A'}%
- Health Expenditure: ${countryData.indicators?.healthExpenditure || 'N/A'}% of GDP`;
    }

    // Add Education data
    prompt += `

=== Education Indicators (Education Tab) ===`;
    if (educationData?.success && educationData.data) {
      const edu = educationData.data;
      prompt += `
- Literacy Rate: ${edu.literacy?.overall?.value || 'N/A'}%
- Primary School Enrollment: ${edu.enrollment?.primary?.value || 'N/A'}%
- Secondary School Enrollment: ${edu.enrollment?.secondary?.value || 'N/A'}%
- Education Expenditure: ${edu.expenditure?.percentGdp?.value || 'N/A'}% of GDP`;
    } else {
      prompt += `
- Literacy Rate: ${countryData.indicators?.literacyRate || 'N/A'}%
- Education Expenditure: ${countryData.indicators?.educationExpenditure || 'N/A'}% of GDP`;
    }

    // Add Food Security data
    if (foodSecurityData?.success && foodSecurityData.data) {
      const food = foodSecurityData.data;
      prompt += `

=== Food Security (Food Security Tab) ===
- Food Production Index: ${food.foodProductionIndex || 'N/A'}
- Prevalence of Undernourishment: ${food.prevalenceOfUndernourishment || 'N/A'}%
- Stunting Rate (children): ${food.stuntingRate || 'N/A'}%`;
    }

    // Add Conflict data
    if (conflictData?.success && conflictData.data) {
      const conf = conflictData.data;
      prompt += `

=== Conflict Situation (Conflict Tab) ===
- Total Events: ${conf.totalEvents || 0}
- Total Fatalities: ${conf.totalFatalities || 0}
- Main Event Types: ${conf.eventTypes?.slice(0, 3).map((e: any) => `${e._id} (${e.count})`).join(', ') || 'N/A'}`;
    }

    // Add Refugee data
    if (refugeeData?.success && refugeeData.data) {
      const ref = refugeeData.data;
      prompt += `

=== Refugee Situation (Refugee Tab) ===
- Refugees (originated): ${ref.refugeesOriginated?.toLocaleString() || 'N/A'}
- Refugees (hosted): ${ref.refugeesHosted?.toLocaleString() || 'N/A'}
- Internally Displaced Persons (IDPs): ${ref.idps?.toLocaleString() || 'N/A'}
- Asylum Seekers: ${ref.asylumSeekers?.toLocaleString() || 'N/A'}`;
    }

    prompt += `

=== Analysis Request ===
Based on all the data above, please write a professional analysis in English that includes:

1. **Overall Situation** (2-3 sentences)
   - Provide a comprehensive summary of the country's current economic, social, and humanitarian status

2. **Key Issues** (3-5 bullet points)
   - List the most urgent problems based on data with specific figures
   - Include relevant statistics for each issue

3. **Positive Aspects** (if any)
   - Mention any improving indicators or strengths

4. **Priority Support Areas**
   - Provide specific recommendations on which areas need what type of support most urgently

The summary should be data-driven, specific, accurate, professional yet easy to understand.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional analyst specializing in international development and humanitarian assistance. You analyze economic, social, health, conflict, and refugee data comprehensively to provide clear and practical insights. Your analysis is data-driven with specific figures and actionable recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const summary = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      data: {
        summary,
        generatedAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate summary' 
      },
      { status: 500 }
    );
  }
}
