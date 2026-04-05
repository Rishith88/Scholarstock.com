import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>ScholarStock</h3>
          <a onClick={() => navigate('/')}>Home</a>
          <a onClick={() => navigate('/browse')}>Browse Materials</a>
        </div>
        <div className="footer-col">
          <h3>Categories</h3>
          <a onClick={() => navigate('/browse')}>JEE Main</a>
          <a onClick={() => navigate('/browse')}>NEET UG</a>
          <a onClick={() => navigate('/browse')}>UPSC CSE</a>
          <a onClick={() => navigate('/browse')}>CAT</a>
        </div>
        <div className="footer-col">
          <h3>Support</h3>
          <a>Help Center</a>
          <a>Contact Us</a>
          <a>Terms of Service</a>
          <a>Privacy Policy</a>
        </div>
        <div className="footer-col">
          <h3>Connect</h3>
          <a>Twitter</a>
          <a>LinkedIn</a>
          <a>Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 ScholarStock. All rights reserved. Made with ❤️ for students.
      </div>
    </div>
  );
}
