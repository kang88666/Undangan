'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimeZoneDisplay {
  name: string
  timezone: string
  time: string
  abbreviation: string
}

export function WorldClock() {
  const [timeZones, setTimeZones] = useState<TimeZoneDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Define time zones to display
  const displayTimeZones = [
    { name: 'Jakarta (WIB)', timezone: 'Asia/Jakarta' },
    { name: 'Bangkok (ICT)', timezone: 'Asia/Bangkok' },
    { name: 'Singapore (SGT)', timezone: 'Asia/Singapore' },
    { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
    { name: 'Sydney (AEDT)', timezone: 'Australia/Sydney' },
    { name: 'Dubai (GST)', timezone: 'Asia/Dubai' },
    { name: 'London (GMT)', timezone: 'Europe/London' },
    { name: 'New York (EST)', timezone: 'America/New_York' },
    { name: 'Los Angeles (PST)', timezone: 'America/Los_Angeles' },
    { name: 'São Paulo (BRT)', timezone: 'America/Sao_Paulo' },
  ]

  useEffect(() => {
    const updateClocks = () => {
      const updated = displayTimeZones.map((tz) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timezone,
          timeZoneName: 'short',
        })

        const time = formatter.format(new Date())
        const parts = dateFormatter.formatToParts(new Date())
        const abbreviation = parts.find((p) => p.type === 'timeZoneName')?.value || ''

        return {
          ...tz,
          time,
          abbreviation,
        }
      })

      setTimeZones(updated)
      setIsLoading(false)
    }

    updateClocks()
    const interval = setInterval(updateClocks, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">World Clock</h1>
          </div>
          <p className="text-slate-300 text-lg">Current time across different time zones</p>
        </div>

        {/* Clock Grid */}
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-slate-300 mt-4">Loading time zones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {timeZones.map((tz, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 border border-slate-600 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105"
              >
                {/* Location Name */}
                <h3 className="text-white font-semibold text-sm mb-2 truncate">{tz.name}</h3>

                {/* Digital Time Display */}
                <div className="mb-3">
                  <div className="font-mono text-3xl font-bold text-blue-400 tracking-wider">
                    {tz.time}
                  </div>
                </div>

                {/* Time Zone Abbreviation */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{tz.abbreviation}</span>
                  <span className="text-xs font-mono text-slate-500">{tz.timezone}</span>
                </div>

                {/* Decorative indicator */}
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Updates every second • Time format: 24-hour</p>
          <p className="mt-2">Displaying 10 major global time zones</p>
        </div>
      </div>
    </div>
  )
}
