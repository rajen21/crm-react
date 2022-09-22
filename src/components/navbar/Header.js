import { useEffect, useState } from 'react';
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { loggedinUserData } from '../../containers/home/sotre';
import { userLogout, logoutData } from './store';
import AlertPopup from '../alertPopup/alert';

const Header = () => {
    const [isDropdown, setIsDropdown] = useState(false);
    const [error, setError] = useState('');
    const { id, role } = useSelector(loggedinUserData);
    const { isUserLogedout, logoutLoading, logoutError } = useSelector(logoutData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            if (user) {
                dispatch(userLogout());
            }
        }
    };

    useEffect(() => {
        if (isUserLogedout) {
            localStorage.removeItem('token');
            window.location.href = '/user/login';
        }
        if (logoutError) setError(logoutError);
    }, [isUserLogedout, logoutError]);

    return (
        <>
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <div className='w-100 d-flex align-items-center justify-content-center'>
                        <div className=''>
                            <div
                                className="navbar-brand m-0 h1 d-flex align-items-center justify-content-center cursor-pointer"
                                onClick={() => {
                                    setIsDropdown((prevState) => prevState ? !prevState : prevState)
                                    navigate('/')
                                }
                                }
                            >
                                CRM
                            </div>
                            {isDropdown ? (
                                <>
                                    <div className="border border-top-0 border-start-0 border-end-0 border-light" />
                                    <div className='navbar-brand m-0'>
                                        <label
                                            className="dropdown-item d-flex justify-content-center cursor-pointer"
                                            onClick={() => {
                                                setIsDropdown((prevState) => prevState ? !prevState : prevState)
                                                navigate(`/profile/${id}`)
                                            }

                                            } 
                                        >
                                            Profile
                                        </label>
                                    </div>
                                    {
                                        role !== 'User' ? (
                                            <div className='navbar-brand m-0'>
                                                <label
                                                    className="dropdown-item d-flex justify-content-center cursor-pointer"
                                                    onClick={() => {
                                                        setIsDropdown((prevState) => prevState ? !prevState : prevState)
                                                        navigate('/user/registration')}
                                                    }
                                                >
                                                    Registration
                                                </label>
                                            </div>
                                        ) : ''
                                    }

                                    <div className='navbar-brand m-0'>
                                        <label
                                            className='dropdown-item d-flex justify-content-center cursor-pointer'
                                            onClick={onLogout}
                                        >
                                            Logout
                                        </label>
                                    </div>
                                </>
                            ) : ''
                            }
                        </div>
                    </div>
                    <div className='m-4 d-flex align-items-center justify-content-end position-absolute h-100'>
                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={() => setIsDropdown((prevState) => !prevState)}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
            </div>
            <div className="position-relative d-flex justify-content-center">
                {error ? <AlertPopup message={error} type='danger' /> : ''}
            </div>
        </>
    );
}

export default Header;
