import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Study Smarter, Pay Less</h1>
        <button className="btn btn-grad" onClick={() => navigate('/browse')}>Browse Materials</button>
      </div>
    </div>
  )
}
export default Home
