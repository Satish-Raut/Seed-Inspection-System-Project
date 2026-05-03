import { useState } from 'react'

/**
 * useGeolocation
 * Custom hook to capture the real-time GPS coordinates of the field inspector.
 * getLocation() returns a Promise that resolves with { latitude, longitude, accuracy }
 * or resolves with null if an error occurs (error state is set separately).
 * @returns {Object} - { location, error, loading, getLocation }
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, accuracy: null })
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by your browser.'
      setError(msg)
      return Promise.resolve(null)
    }

    setLoading(true)
    setError(null)

    // Return a Promise so callers can await the result directly
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          const result = { latitude, longitude, accuracy }
          setLocation(result)
          setLoading(false)
          resolve(result)           // ✅ Caller receives the coords
        },
        (err) => {
          // Map GeolocationPositionError codes to friendly messages
          const messages = {
            1: 'Location permission denied. Please allow location access in your browser settings.',
            2: 'Location unavailable. Make sure GPS/location services are enabled on your device.',
            3: 'Location request timed out. Try again in an open area.',
          }
          const msg = messages[err.code] || err.message
          setError(msg)
          setLoading(false)
          resolve(null)             // ✅ Resolve null so caller can check for failure
        },
        {
          enableHighAccuracy: true,   // Use GPS chip when available
          timeout: 15000,             // Wait up to 15s before timing out
          maximumAge: 0,              // Never use a cached position — always fresh
          ...options,
        }
      )
    })
  }

  return { location, error, loading, getLocation }
}
