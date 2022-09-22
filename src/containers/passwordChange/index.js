import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";
import AlertPopup from '../../components/alertPopup/alert';

const PasswordChange = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [localUser, setLocalUser] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { editid } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await fetch(`http://localhost:8080/user/${editid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    passwordChange: true,
                    userID: localUser.id,
                })
            });

            const data = await result.json();
            if (data.status) navigate('/');
            else setPasswordError(data.message)
        } catch (err) {
            setPasswordError('Error');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            if (!user) {
                localStorage.removeItem('token');
                window.location.href = '/user/login';
            } else {
                setLocalUser(user);
            }
        } else {
            window.location.href = '/user/login';
        }
    }, []);

    useEffect(() => {
        if (localUser.id && localUser.id !== editid) {
            navigate('/');
        }
    }, [localUser]);

    return (
        <>
            <div className="position-relative d-flex justify-content-center">
                {passwordError ? <AlertPopup message={passwordError} type='danger' /> : ''}
            </div>
            <div className="h-75 d-flex align-items-center justify-content-center">
                <div className='col-sm-4'>
                    <div className='d-flex justify-content-center'>
                        <h2>Password Change</h2>
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <form className='col-lg-10' onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    id="floatingOldPassword"
                                    value={oldPassword}
                                    placeholder="Old Password"
                                    required
                                />
                                <label htmlFor="floatingOldPassword">Old Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    id="floatingNewPassword"
                                    placeholder="New Password"
                                    required
                                />
                                <label htmlFor="floatingNewPassword">New Password</label>
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PasswordChange;