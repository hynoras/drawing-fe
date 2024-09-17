import { useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hook/UserContext';
import {
    loginUser
} from "../../actionCreators/LoginAction";
import { connect } from "react-redux";

const cx = classNames.bind(styles);

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useUser(); // Assuming `loginUser` is passed as a prop
    const navigate = useNavigate();

    const handleMailChange = (e) => {
        setEmail(e.target.value);
        setHasEmailError(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setHasPasswordError(false);
    };

    const validateForm = () => {
        let isValid = true;
        if (!email) {
            setHasEmailError(true);
            isValid = false;
        }
        if (!password) {
            setHasPasswordError(true);
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = { email, password };
    
            try {
                const response = await props.loginUser(data);
                console.log(response); // Log the entire response object
                const output = response.data;
    
                if (output.status === "success") {
                login({ token: output.token , email }); // Assuming login is a function that stores user information
                navigate('/'); // Navigate to the home page
                } else {
                    // Handle unsuccessful login (show an error message, etc.)
                    setLoading(false);
                }
            } catch (error) {
                // Handle any errors from the loginUser action
                console.error('Error during login:', error);
                setLoading(false);
            }
        }
    };
    

    return (
        <div className={cx('Desktop3')}>
            <div className={cx('Login')}>
                <div className={cx('text')}>
                    <h2> LOGIN </h2>{' '}
                </div>{' '}
                <form onSubmit={handleSubmit} className={cx('form')}>
                    <label htmlFor="uname">
                        <b> User Name </b>{' '}
                    </label>{' '}
                    <input
                        placeholder="Enter email"
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleMailChange}
                        className={cx({
                            error: hasEmailError,
                        })}
                        required
                    />
                    {hasEmailError && <p className="error-message"> Please enter a valid email </p>}
                    <label htmlFor="psw">
                        <b> Password </b>{' '}
                    </label>{' '}
                    <input
                        placeholder="Enter password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={cx({
                            error: hasPasswordError,
                        })}
                        required
                    />
                    <div className={cx('regis')}>
                        <p className={cx('regis')}>
                            <i>
                                <Link to="/register"> Do not have an account ? </Link>{' '}
                            </i>{' '}
                        </p>{' '}
                    </div>
                    <label className={cx('check')}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            name="remember"
                        />{' '}
                        Remember me{' '}
                    </label>
                    <button className={cx('button')} type="submit" disabled={loading}>
                        {' '}
                        {loading ? 'Signing in...' : 'Sign in'}{' '}
                    </button>{' '}
                </form>{' '}
            </div>{' '}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
      alertData: state.LoginReducer.alert,
      tokenUser: state.LoginReducer.tokenUser,
    };
  };
  
  const mapDispatchToProps = { loginUser};
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);
  