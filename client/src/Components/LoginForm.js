import { useState } from "react"
import PropTypes from "prop-types"

const LoginForm = ({ handleUserLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    try {
      event.preventDefault()
      handleUserLogin({ username, password })
    } catch (exception) {
      window.alert(`Wrong: ${exception}`)
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <h2> Login </h2>
      <div>
        username:
        <input
          id="user-name"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          id="pass-word"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button
        id="login-button"
        type="submit"> login </button>
    </form>
  )
}
LoginForm.propTypes = {
  handleUserLogin: PropTypes.func.isRequired
}

export default LoginForm