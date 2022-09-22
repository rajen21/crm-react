import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import AlertPopup from '../../components/alertPopup/alert';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, password
                })
            });

            const data = await result.json();
            if (!data.status) setLoginError(data.message);
            let user = decodeToken(data.user);

            if (data.user) {
                localStorage.setItem('token', data.user);
                if (user.role !== 'User') window.location.href = '/';
                if (user.role === 'User') window.location.href = `/profile/${user.id}`;
                user = {};
            }
        } catch (err) {
            setLoginError('Error')
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            if (user) {
                navigate('/');
            }
        }
    }, []);

    return (
        <>
            <div className="position-relative d-flex justify-content-center">
                {loginError ? <AlertPopup message={loginError} type='danger' /> : ''}
            </div>
            <div className="h-75 d-flex align-items-center justify-content-center">
                <div className='col-sm-4'>
                    <div className='d-flex justify-content-center'>
                        <h2>Login</h2>
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <form className='col-lg-10' onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="floatingInput"
                                    value={email}
                                    placeholder="Email"
                                    required
                                />
                                <label htmlFor="floatingInput">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    id="floatingPassword"
                                    placeholder="Password"
                                    required
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};

export default LoginForm;
