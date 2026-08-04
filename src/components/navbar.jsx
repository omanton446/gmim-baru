import React from 'react'

function Navbar({ 
  isAdmin, 
  onLogout, 
  onLogin, 
  activePage, 
  onNavigate,
  isDropdownOpen,
  setIsDropdownOpen
}) {
  return (
    <nav className="navbar-left">
      <div className="navbar-brand">
        <span className="navbar-logo"><i className="fas fa-cross"></i></span>
        <span className="navbar-title">GMIM</span>
        <span className="navbar-subtitle">Arsip</span>
      </div>

      <button 
        className={`navbar-hamburger ${isDropdownOpen ? 'active' : ''}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-dropdown ${isDropdownOpen ? 'open' : ''}`}>
        <button 
          className={`navbar-link ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('dashboard')
            setIsDropdownOpen(false)
          }}
        >
          <i className="fas fa-chart-pie"></i>
          <span>Dashboard</span>
        </button>
        
        <button 
          className={`navbar-link ${activePage === 'dokumen' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('dokumen')
            setIsDropdownOpen(false)
          }}
        >
          <i className="fas fa-file-alt"></i>
          <span>Dokumen</span>
        </button>
        
        <button 
          className={`navbar-link ${activePage === 'files' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('files')
            setIsDropdownOpen(false)
          }}
        >
          <i className="fas fa-paperclip"></i>
          <span>File</span>
        </button>
        
        <button 
          className={`navbar-link ${activePage === 'admin' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('admin')
            setIsDropdownOpen(false)
          }}
        >
          <i className="fas fa-user-shield"></i>
          <span>Admin Panel</span>
        </button>

        <div className="navbar-divider"></div>

        {!isAdmin ? (
          <button 
            className="navbar-link navbar-login-btn"
            onClick={() => {
              setIsDropdownOpen(false)
              onLogin()
            }}
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Login Admin</span>
          </button>
        ) : (
          <>
            <div className="navbar-user">
              <i className="fas fa-user-circle"></i>
              <span>👑 Admin</span>
            </div>
            <button className="navbar-logout" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar