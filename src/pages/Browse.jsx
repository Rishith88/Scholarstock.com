import { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = 'https://scholarstock-backend-rfr4.onrender.com'
function Browse() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get(`${API_URL}/api/materials`)
      .then(res => setMaterials(res.data.materials || []))
      .finally(() => setLoading(false))
  }, [])
  if(loading) return <div style={{textAlign:'center',padding:'3rem'}}>⏳ Loading...</div>
  return (
    <div className="sec" style={{marginTop:'2rem'}}>
      <h2 className="sec-title">Browse Study Materials</h2>
      <div className="doc-grid">
        {materials.map(m => (
          <div key={m._id} className="doc-card">
            <div className="doc-title">{m.title}</div>
            <div className="doc-price">₹{m.pricePerDay}/day</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Browse
