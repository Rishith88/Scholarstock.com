import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const API_URL = 'https://scholarstock-backend-rfr4.onrender.com'
function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  async function doSignup(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch(err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        {error && <div className="auth-error on">{error}</div>}
        <form onSubmit={doSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-grad" style={{width:'100%'}}>Create Account</button>
        </form>
        <div className="auth-link">Have account? <a onClick={() => navigate('/login')} style={{cursor:'pointer'}}>Login</a></div>
      </div>
    </div>
  )
}
export default Signup
