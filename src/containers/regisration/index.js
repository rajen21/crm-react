import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";
import { useSelector, useDispatch } from 'react-redux';

import AlertPopup from '../../components/alertPopup/alert';
import { getRoles, rolesData } from './store';
import { loggedinUserData } from '../home/sotre';

const Registration = () => {
    const [localUser, setLocalUser] = useState({});
    const [checkboxVal, setCheckboxVal] = useState(false);
    const [regiError, setRegiError] = useState('');
    const {
        active,
        adminID,
        age,
        agentID,
        email,
        error,
        first_name,
        id,
        password,
        isLoading,
        last_name,
        role
    } = useSelector(loggedinUserData);
    const { isRoleLoading, roleResult, roleError } = useSelector(rolesData);
    const { editid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        let tempRole;
        if (!editid) tempRole = JSON.parse(e.target.role.value);
        let tempUser = {};

        tempUser.first_name = e.target.first_name.value;
        tempUser.last_name = e.target.last_name.value;
        tempUser.email = e.target.email.value;
        tempUser.age = parseInt(e.target.age.value);

        if (editid) tempUser.editid = editid;

        if (!editid) {
            tempUser.password = e.target.password.value;
            tempUser.active = checkboxVal;
            tempUser.roleID = tempRole.id;
        }

        if (!editid && tempRole.role === 'Agent' && role === 'Admin') {
            tempUser.adminID = id;
        } else if (!editid && role === 'Agent') {
            tempUser.adminID = adminID;
            tempUser.agentID = id;
        }
        onSubmit(tempUser);
        tempUser = {};
    }

    const onSubmit = async (formData) => {
        try {
            let URL = 'http://localhost:8080/user/';
            let method = 'POST';
            if (editid) {
                URL = 'http://localhost:8080/user/' + editid;
                method = 'PUT';
            }

            if (formData.email) {
                const result = await fetch(URL, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                const data = await result.json();
                if (data.status) navigate('/');
                else setRegiError(data.message);
            }
        } catch (err) {
            setRegiError(err.message);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            if (!user) {
                localStorage.removeItem('token');
                window.location.href = '/user/login';
            } else setLocalUser(user);

            if (!editid && user.role === 'User') navigate('/');
        } else {
            window.location.href = '/user/login';
        }
    }, []);

    useEffect(() => {
        if (!editid) dispatch(getRoles());
    }, [editid]);

    useEffect(() => {
        if (editid && editid !== id) {
            if (localUser.role === 'Admin') {
                if (role === 'Agent' || role === 'User') {
                    if (id != adminID) navigate('/');
                } else if (role === 'Admin') navigate('/');
            } else if (role === 'Agent') {
                if (role === 'Admin') navigate('/');
                else if (role === 'User') {
                    if (id !== agentID) navigate('/');
                } else if (role === 'Agent') navigate('/');
            } else if (role === 'User') {
                if (role === 'Admin' || role === 'Agent' || role === 'User') navigate('/');
            }
            navigate('/')
        }
    }, [editid]);

    return (
        <>
            <div className="position-relative d-flex justify-content-center">
                {regiError ? <AlertPopup message={regiError} type='danger' /> : ''}
            </div>
            <div className="h-75 d-flex align-items-center justify-content-center">
                <form className="row g-3 justify-content-center col-sm-5" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="validationDefault01" className="form-label">First name</label>
                        <input
                            type="text"
                            defaultValue={editid && localUser.first_name ? localUser.first_name : ''}
                            className="form-control"
                            name="first_name"
                            id="validationDefault01"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="validationDefault02" className="form-label">Last name</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={editid && localUser.last_name ? localUser.last_name : ''}
                            name="last_name"
                            id="validationDefault02"
                            required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="validationDefaultEmail" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={editid && localUser.email ? localUser.email : ''}
                            name="email"
                            id="validationDefaultEmail"
                            aria-describedby="inputGroupPrepend2"
                            required />
                    </div>
                    {
                        !editid ? (
                            <>
                                <div className="col-md-6">
                                    <label htmlFor="validationDefault03" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        id="validationDefault03"
                                        required />
                                </div>
                                <div className="dropdown col-md-6">
                                    <select name="role" id="role1" required>
                                        {roleResult.map((elem, index) => {
                                            if ((role === 'Admin' && elem.role === 'User') ||
                                                (role === 'Agent' && elem.role === 'Admin')
                                                || (role === 'Agent' && elem.role === 'Agent')) return
                                            return <option key={index} value={JSON.stringify(elem)}>{elem.role}</option>
                                        })}
                                    </select>
                                </div>
                            </>
                        ) : ''
                    }
                    <div className="col-md-6">
                        <label htmlFor="validationDefault04" className="form-label">Age</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={editid && localUser.age ? localUser.age : ''}
                            name="age"
                            id="validationDefault04"
                            required />
                    </div>
                    {
                        !editid ? (
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    onChange={(e) => setCheckboxVal((prevState) => !prevState)}
                                    name="active"
                                    type="checkbox"
                                    id="defaultCheck1"
                                />
                                <label className="form-check-label" htmlFor="defaultCheck1">
                                    Active
                                </label>
                            </div>

                        ) : ''
                    }
                    <div className="">
                        <button className="btn btn-primary" onClick={onSubmit} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Registration;
