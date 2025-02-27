import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Url() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  
  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${id}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error('URL not found')
        }
        
        // Redirect to original URL
        window.location.href = data.url
      } catch (err) {
        console.error('Error fetching URL:', err)
        setError(true)
        // Navigate to 404 page after a short delay
        setTimeout(() => {
          navigate('/404', { replace: true })
        }, 1000)
      }
    }
    
    if (id) {
      fetchOriginalUrl()
    }
  }, [id, navigate])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error ? (
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600">URL not found</h2>
          <p className="text-gray-600 mt-2">Redirecting to error page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your destination...</p>
        </div>
      )}
    </div>
  )
}

export default Url