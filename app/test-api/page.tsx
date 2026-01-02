'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [worldBankResult, setWorldBankResult] = useState<any>(null);
  const [fewsResult, setFewsResult] = useState<any>(null);
  const [unhcrResult, setUnhcrResult] = useState<any>(null);
  const [propublicaResult, setPropublicaResult] = useState<any>(null);
  const [gdacsResult, setGdacsResult] = useState<any>(null);
  const [acledResult, setAcledResult] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const testWorldBank = async () => {
    setLoading('worldbank');
    setWorldBankResult(null);
    try {
      const response = await fetch('/api/test/worldbank');
      const data = await response.json();
      setWorldBankResult(data);
    } catch (error: any) {
      setWorldBankResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testFEWS = async () => {
    setLoading('fews');
    setFewsResult(null);
    try {
      const response = await fetch('/api/test/fews');
      const data = await response.json();
      setFewsResult(data);
    } catch (error: any) {
      setFewsResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testUNHCR = async () => {
    setLoading('unhcr');
    setUnhcrResult(null);
    try {
      const response = await fetch('/api/test/unhcr');
      const data = await response.json();
      setUnhcrResult(data);
    } catch (error: any) {
      setUnhcrResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testProPublica = async () => {
    setLoading('propublica');
    setPropublicaResult(null);
    try {
      const response = await fetch('/api/test/propublica');
      const data = await response.json();
      setPropublicaResult(data);
    } catch (error: any) {
      setPropublicaResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testGDACS = async () => {
    setLoading('gdacs');
    setGdacsResult(null);
    try {
      const response = await fetch('/api/test/gdacs');
      const data = await response.json();
      setGdacsResult(data);
    } catch (error: any) {
      setGdacsResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testACLED = async () => {
    setLoading('acled');
    setAcledResult(null);
    try {
      const response = await fetch('/api/test/acled');
      const data = await response.json();
      setAcledResult(data);
    } catch (error: any) {
      setAcledResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API 테스트 페이지</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* World Bank API */}
          <TestCard
            title="World Bank API"
            description="경제 지표 (GDP, 빈곤율)"
            onTest={testWorldBank}
            loading={loading === 'worldbank'}
            result={worldBankResult}
          />

          {/* FEWS NET API */}
          <TestCard
            title="FEWS NET API"
            description="식량 안보 데이터"
            onTest={testFEWS}
            loading={loading === 'fews'}
            result={fewsResult}
          />

          {/* UNHCR API */}
          <TestCard
            title="UNHCR API"
            description="난민 데이터"
            onTest={testUNHCR}
            loading={loading === 'unhcr'}
            result={unhcrResult}
          />

          {/* ProPublica API */}
          <TestCard
            title="ProPublica API"
            description="기부 단체 재무"
            onTest={testProPublica}
            loading={loading === 'propublica'}
            result={propublicaResult}
          />

          {/* GDACS API */}
          <TestCard
            title="GDACS API"
            description="재난 알림"
            onTest={testGDACS}
            loading={loading === 'gdacs'}
            result={gdacsResult}
          />

          {/* ACLED Data */}
          <TestCard
            title="ACLED (로컬)"
            description="분쟁 데이터 (Excel)"
            onTest={testACLED}
            loading={loading === 'acled'}
            result={acledResult}
          />
        </div>
      </div>
    </div>
  );
}

interface TestCardProps {
  title: string;
  description: string;
  onTest: () => void;
  loading: boolean;
  result: any;
}

function TestCard({ title, description, onTest, loading, result }: TestCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <button
        onClick={onTest}
        disabled={loading}
        className={`w-full py-2 rounded font-semibold ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? '테스트 중...' : '테스트'}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-60">
          <div className={`font-semibold mb-2 ${result.error ? 'text-red-600' : 'text-green-600'}`}>
            {result.error ? '❌ 실패' : '✅ 성공'}
          </div>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

