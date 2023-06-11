import { useState } from "react"
import PropTypes from "prop-types"

const LoginForm = ({ handleuserLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    try {
      event.preventDefault()
      handleuserLogin({ username, password })
    } catch (exception) {
      window.alert(`Wrong: ${exception}`)
    }
  }
  return (
    <div>
      <h2> Login </h2>
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit"> login </button>
      </form>
    </div>
  )
}
LoginForm.prototype = {
  handleuserLogin: PropTypes.func.isRequired
}

export default LoginForm