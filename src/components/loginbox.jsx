import React from 'react'

function LoginBox({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  loginError, 
  onLogin,
  onCancel
}) {
  return (
    <div className="login-box">
      <div className="login-icon"><i className="fas fa-lock"></i></div>
      <h2>Login Admin</h2>
      {loginError && <div className="error">{loginError}</div>}
      <form onSubmit={onLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <div className="login-actions">
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <i className="fas fa-times"></i> Batal
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginBox