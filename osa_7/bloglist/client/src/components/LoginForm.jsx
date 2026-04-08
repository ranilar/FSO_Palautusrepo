import PropTypes from 'prop-types'
import Togglable from './Togglable'

const LoginForm = ({
    handleLogin,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    return (
    <Togglable buttonLabel='login' buttonLabel2='cancel' >
    <form onSubmit={handleLogin}>
        <div>
            username
            <input
                type="text"
                value={username}
                name="Username"
                placeholder='username'
                onChange={handleUsernameChange}
            />
        </div>
        <div>
            password
            <input
                type="password"
                value={password}
                name="Password"
                placeholder='password'
                onChange={handlePasswordChange}
            />
        </div>
        <button type="submit">login</button>
    </form>
    </Togglable>
    )

}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}

export default LoginForm