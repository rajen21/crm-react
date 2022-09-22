import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decodeToken } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";

import AlertPopup from '../../components/alertPopup/alert';
import { loggedinUserData } from '../home/sotre';
import {
    getUserData,
    profileUserData,
    adjacentData,
    getAdjacentData,
    onDeleteUser,
    userDeletedData,
    onDeleteUserAdjacentData,
} from './store';

const Profile = () => {
    const [profileError, setProfileError] = useState('');
    const [localUser, setLocalUser] = useState({});
    const [useID, setUseID] = useState('');
    const {
        active,
        adminID,
        age,
        agentID,
        email,
        error,
        first_name,
        id,
        isLoading,
        last_name,
        role,
    } = useSelector(profileUserData);
    const loggedinUser = useSelector(loggedinUserData);
    const { deleteLoading, isUserDeleted, deleteError } = useSelector(userDeletedData);
    const { isDataLoading, dataError, listData } = useSelector(adjacentData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { viewid } = useParams();

    const onInactive = async () => {
        try {
            const req = await fetch(`http://localhost:8080/user/${viewid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !active, changeActive: true })
            });
            const res = await req.json();
            if (!res.status) setProfileError(res.message);
            else dispatch(getUserData(viewid));
        } catch (err) {
            setProfileError(err.message)
        }
    }

    const onDelete = async () => {
        dispatch(onDeleteUser(viewid));
        if (viewid && loggedinUser.role === 'Admin' && role === 'Agent') {
            dispatch(onDeleteUserAdjacentData(`?role=User&agentID=${viewid}`))
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            if (!user) {
                localStorage.removeItem('token');
                window.location.href = '/user/login';
            } else {
                setLocalUser(user)
                dispatch(getUserData(viewid));
            }
        } else {
            window.location.href = '/user/login';
        }
    }, []);

    useEffect(() => {
        if (loggedinUser.id !== viewid && role === 'Agent') dispatch(getAdjacentData(`?agentID=${viewid}&role=User`));
        if (loggedinUser.id !== viewid && role === 'Admin') dispatch(getAdjacentData(`?adminID=${viewid}&role=Agent`));
    }, [role]);

    useEffect(() => {
        if (isUserDeleted) {
            navigate('/');
        }
    }, [isUserDeleted]);

    useEffect(() => {
        if (error) setProfileError(error);
        if (deleteError) setProfileError(deleteError);
    }, [error, deleteError]);

    useEffect(() => {
        if (localUser.id !== id) {
            if (localUser.role === 'Admin') {
                if (role === 'Agent' || role === 'User') {
                    if (localUser.id != adminID) navigate('/');
                } else if (role === 'Admin') navigate('/');
            } else if (localUser.role === 'Agent') {
                if (role === 'Admin') navigate('/');
                else if (role === 'User') {
                    if (localUser.id !== agentID) navigate('/');
                } else if (role === 'Agent') navigate('/');
            } else if (localUser.role === 'User') {
                if (role === 'Admin' || role === 'Agent' || role === 'User') navigate('/');
            }
        }
    }, [id]);

    return (
        <>
            <div className="position-relative d-flex justify-content-center">
                {profileError ? <AlertPopup message={profileError} type='danger' /> : ''}
            </div>
            <div className="h-75 d-flex align-items-center">
                <div className='d-flex justify-content-center'>
                    {isLoading ? (
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : !isLoading && !error ? (
                        <form className="row g-3 col-sm-8">
                            {
                                id === viewid ? (
                                    <div className="col-sm-5">
                                        <label htmlFor="validationDefault04" className="form-label">ID</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={id}
                                            className="form-control"
                                            id="validationDefault04"
                                        />
                                    </div>
                                ) : ''
                            }
                            <div className="col-sm-5">
                                <label htmlFor="validationDefaultEmail" className="form-label">Email</label>
                                <input
                                    type="text"
                                    disabled
                                    value={email}
                                    className="form-control"
                                    id="validationDefaultEmail"
                                    aria-describedby="inputGroupPrepend2"
                                />
                            </div>
                            <div className="col-sm-5">
                                <label htmlFor="validationDefault01" className="form-label">First name</label>
                                <input
                                    type="text"
                                    disabled
                                    value={first_name}
                                    className="form-control"
                                    id="validationDefault01"
                                />
                            </div>
                            <div className="col-sm-5">
                                <label htmlFor="validationDefault02" className="form-label">Last name</label>
                                <input
                                    type="text"
                                    disabled
                                    value={last_name}
                                    className="form-control"
                                    id="validationDefault02"
                                />
                            </div>
                            <div className="col-sm-5">
                                <label htmlFor="validationDefault03" className="form-label">Age</label>
                                <input
                                    type="text"
                                    disabled
                                    value={age}
                                    className="form-control"
                                    id="validationDefault03"
                                />
                            </div>
                            {role === 'Admin' || role === 'Agent' ? (
                                <div className="col-sm-5 p-3">
                                    <label>{role === 'Admin' ? 'Total Agents: ' : 'Total Users: '}</label>
                                    <label>{listData.length}</label>
                                </div>
                            ) : ''}
                            <div className="col-sm-10 mb-3">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        disabled
                                        type="checkbox"
                                        id="inlineCheckbox1"
                                        checked={active}
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox1">Active</label>
                                </div>
                            </div>
                            {loggedinUser.id === viewid ? (
                                <div className='d-flex'>
                                    <div className='d-flex justify-content-start me-3'>
                                        <button
                                            className="btn btn-secondary"
                                            type="button"
                                            onClick={() => navigate(`/profile/edit/${id}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className='d-flex justify-content-start w-75'>
                                        <button
                                            className="btn btn-secondary"
                                            type="button"
                                            onClick={() => navigate(`/profile/password-change/${id}`)}
                                        >
                                            Password Change
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='d-flex'>
                                    <div className='d-flex justify-content-start'>
                                        <button
                                            className="btn btn-secondary"
                                            type="button"
                                            onClick={onInactive}
                                        >
                                            {active ? 'Inactive User' : 'Active User'}
                                        </button>
                                    </div>
                                    {
                                        loggedinUser.role !== 'User' ? (
                                            <>
                                                {
                                                    deleteLoading ? (
                                                        <div className='d-flex justify-content-start ms-3'>
                                                            <button className="btn btn-danger" type="button" disabled>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                Loading...
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className='d-flex justify-content-start ms-3'>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={onDelete}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </>

                                        ) : ''
                                    }
                                </div>
                            )}
                        </form>
                    ) : ''}
                    {
                        loggedinUser.id !== viewid && role === 'Agent' ? (
                            <div className="col-sm-2">
                                <h2>Users List</h2>
                                <ol className="list-group list-group-numbered">
                                    {
                                        listData.map((elem, ind) => (
                                            <li
                                                className="list-group-item d-flex justify-content-between align-items-start"
                                                key={ind}
                                                onClick={() => useID && useID === elem.id ? setUseID('') : setUseID(elem.id)}
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">{elem.first_name} {elem.last_name}</div>
                                                    {elem.email}
                                                </div>
                                                <div>
                                                    {
                                                        useID === elem.id ? (
                                                            <div className="mt-1">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    onClick={() => navigate(`/profile/${elem.id}`)}
                                                                >
                                                                    Profile
                                                                </button>
                                                            </div>
                                                        ) : ''}
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ol>
                            </div>
                        ) : ''
                    }
                </div>
            </div>
        </>
    )
}

export default Profile;