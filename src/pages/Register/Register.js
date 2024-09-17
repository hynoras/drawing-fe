import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import { isEmail } from 'validator';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const pathBackEnd = 'https://backendpainter-v1.onrender.com';
// const pathBackEnd = 'http://localhost:8081';

function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState([]);

    const [email, setEmail] = useState('');
    const [hasEmailError, setHasEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [hasPasswordError, setHasPasswordError] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const handleMailChange = (e) => {
        setEmail(e.target.value);
        setHasEmailError(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setHasPasswordError(false);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMismatch(false);
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${pathBackEnd}/users`);
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user: ', err);
        }
    };

    const handleRegisterUser = (user) => {
        return axios
            .post(`${pathBackEnd}/register/`, user)
            .then(() => {
                alert('User registration successfully');
                fetchUser();
            })
            .catch((err) => {
                console.log(err);
                throw err; // Rethrow the error to be caught in the calling code
            });
    };

    const validateForm = () => {
        let isValid = true;

        if (!email || !isEmail(email)) {
            setHasEmailError(true);
            isValid = false;
        } else if (user.some((u) => u.email === email)) {
            setHasEmailError(true);
            isValid = false;
        } else {
            setHasEmailError(false);
        }

        if (!confirmPassword || password !== confirmPassword) {
            isValid = false;
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }

        if (!password) {
            setHasPasswordError(true);
            isValid = false;
        } else {
            setHasPasswordError(false);
        }

        return isValid;
    };

    // const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const userData = {
                email,
                password,
                role: 'user',
            };
            handleRegisterUser(userData)
                .then(() => {
                    console.log('User registered successfully');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    navigate('/login')
                })
                .catch((error) => {
                    console.error('Error registering user:', error);
                });
        }
    };

    return (
        <div className={cx('Desktop3')}>
            <div className={cx('Login')}>
                <div className={cx('text')}>
                    <h2> Register </h2>{' '}
                </div>{' '}
                <form onSubmit={handleSubmit} className={cx('form')}>
                    <label htmlFor="uname">
                        <b> User Name </b>{' '}
                    </label>{' '}
                    <input
                        placeholder="Enter your email"
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleMailChange}
                        className={cx({
                            error: hasEmailError,
                        })}
                        required
                    />
                    {hasEmailError && <p className="error-message"> Invalid email format or email already exists </p>}
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
                    <label htmlFor="psw">
                        <b> Confirm Password </b>{' '}
                    </label>{' '}
                    <input
                        placeholder="Confirm password"
                        type="password"
                        id="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={cx({
                            error: hasPasswordError,
                        })}
                        required
                    />
                    {passwordMismatch && <p className="error-message"> Passwords do not match </p>}
                    <button className={cx('button')} type="submit" onClick={handleSubmit}>
                        Register{' '}
                    </button>{' '}
                    <Link to="/login"> Already have an account ? </Link>{' '}
                </form>{' '}
            </div>{' '}
        </div>
    );
}

export default Register;
