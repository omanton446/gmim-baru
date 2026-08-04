import React from 'react'

function LoginBox({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  loginError, 
  onLogin 
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
        <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
          <i className="fas fa-sign-in-alt"></i> Login
        </button>
      </form>
    </div>
  )
}

export default LoginBox