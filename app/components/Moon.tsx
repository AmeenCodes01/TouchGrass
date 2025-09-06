"use client"
import usePersistState from '@/app/hooks/usePersistState'
import { getMoon } from '@/lib/getMoon';
import React, { useEffect } from 'react'

const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

function Moon() {

  const [moonData, setMoonData] = usePersistState(null, "TCmoon");
  const [lastCall, setLastCall] = usePersistState("", "TClastCall");

  useEffect(() => {
    if (today !== lastCall) {
      const getMoonData = async () => {
        const data = await getMoon();
        console.log(data, "moon datas");
        setMoonData(data);
        setLastCall(today);
      };
      getMoonData();
    }
  }, []);

  if (!moonData) return <div className="p-4 text-gray-500">Loading moon info...</div>;

  const { phase_name, emoji, illumination, moonrise, moonset, events } = moonData.moon;

  return (
    <div className="max-w-sm mx-auto p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white rounded-2xl shadow-lg flex flex-col items-center gap-4">
      
      {/* Moon Emoji & Phase */}
      <div className="text-6xl">{emoji}</div>
      <h2 className="text-2xl font-bold">{phase_name}</h2>
      <p className="text-sm text-gray-300">Illumination: {illumination}</p>
      <span className='text-sm italic text-white'>{parseFloat(illumination)> 50 ? "Moonlight drapes the night in quiet silk—visible and bright, the moon hangs like a lantern of longing in the sky.":""}</span>
      {/* Rise & Set */}
      <div className="flex justify-between w-full mt-2 text-sm text-gray-200">
        <div>🌙 Rise: {moonrise}</div>
        <div>🌘 Set: {moonset}</div>
      </div>
      
      {/* Optimal Viewing */}
      {events.optimal_viewing_period && (
        <div className="mt-4 p-3 bg-purple-800/50 rounded-lg text-center">
          <h3 className="font-semibold text-white">Best Time to Watch</h3>
          <p className="text-sm text-gray-200">
            {events.optimal_viewing_period.start_time} - {events.optimal_viewing_period.end_time} ({events.optimal_viewing_period.duration_hours}h)
          </p>
          <ul className="mt-2 text-xs text-gray-300 list-disc list-inside">
            {events.optimal_viewing_period.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
      
      <p className="mt-4 text-lg text-white italic">Get out and chase the moon, go go! ✨</p>
    </div>
  )
}

export default Moon
