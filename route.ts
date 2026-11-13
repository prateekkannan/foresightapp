import { NextRequest, NextResponse } from 'next/server';
import { rankAnalogues, type ClimateFeatures } from '@/lib/analogue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const f = body?.features as ClimateFeatures;
    const values = f && Array.isArray(f.precipitation) ? [...f.precipitation, f.gdd, f.frostFreeDays, f.hotDays, f.rainfallVariability] : [];
    const valid = Boolean(f && Array.isArray(f.precipitation) && f.precipitation.length === 4 && values.every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0) && f.precipitation.every((v) => v <= 10000) && f.gdd <= 10000 && f.frostFreeDays <= 366 && f.hotDays <= 366 && f.rainfallVariability <= 500);
    if (!valid) return NextResponse.json({error:'Expected four seasonal precipitation values (0–10,000 mm), GDD (0–10,000), frost-free days and hot days (0–366), and rainfall variability (0–500%).'},{status:400});
    const results = rankAnalogues(f);
    return NextResponse.json({ results, method:'Provisional standardised Euclidean distance', featureScales:[60,60,70,80,700,90,35,15], dataStatus:'ILLUSTRATIVE DEMONSTRATION DATA', configuration:{ location:typeof body?.location==='string'?body.location:null, baseline:typeof body?.baseline==='string'?body.baseline:null, futurePeriod:typeof body?.period==='string'?body.period:null, scenario:typeof body?.scenario==='string'?body.scenario:null }, caveat:'The candidate profiles and crop contexts are illustrative, not validated observations. SSP, future period and baseline selections are recorded as metadata only; no future climate projections are retrieved or applied. Do not use these results for farm-level decisions.' });
  } catch {
    return NextResponse.json({error:'Invalid JSON request.'},{status:400});
  }
}
