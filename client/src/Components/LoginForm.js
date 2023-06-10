import { useState } from "react"

const LoginForm = ({ handleuserLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    try {
      event.preventDefault()
      handleuserLogin({ username, password })
      // setUsername("")
      // setPassword("")
    } catch (exception) {
      window.alert(`Wrong: ${exception}`)
    } finally {
      setUsername("")
      setPassword("")
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

export default LoginForm