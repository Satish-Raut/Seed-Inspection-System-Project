import { useState, useEffect } from 'react'

/**
 * useGeolocation 
 * Custom hook to capture the real-time GPS coordinates of the field inspector.
 * @returns {Object} - { location, error, loading, getLocation }
 */
export const useGeolocation = (options = { enableHighAccuracy: true }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, accuracy: null })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setLocation({ latitude, longitude, accuracy })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      options
    )
  }

  // Automatically attempt to get location on mount (optional)
  useEffect(() => {
    getLocation()
  }, [])

  return { location, error, loading, getLocation }
}
