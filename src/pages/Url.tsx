import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

function Url() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error('URL not found')
        }
        setTimeout(() => {
          window.location.href = data.url
        }, 500)
      } catch (err) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-gray-200">
      <div className="w-full max-w-sm bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 text-center flex flex-col items-center justify-center">
        <div className="mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-blue-300">Redirecting...</h2>
      </div>
    </div>
  )
}

export default Url
