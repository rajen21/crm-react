import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import ErrorIcon from '../../static/icons/error.svg'
import AlertPopup from '../../components/alertPopup/alert';
import { adjacentData, fetchUserLoggedin, getAdjacentData, loggedinUserData } from './sotre';

const Home = () => {
    const [localUser, setLocalUser] = useState('');
    const [ageID, setAgeID] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { listData, isDataLoading, dataError } = useSelector(adjacentData);
    const {
        active,
        adminID,
        age,
        agentID,
        email,
        userError,
        first_name,
        id,
        isLoading,
        last_name,
        role,
    } = useSelector(loggedinUserData);

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
        if (localUser) {
            dispatch(fetchUserLoggedin(`/${localUser.id}`));
            if (localUser.role === 'Admin') dispatch(getAdjacentData(`?adminID=${localUser.id}&role=Agent`));
            if (localUser.role === 'Agent') dispatch(getAdjacentData(`?agentID=${localUser.id}&role=User`));
        }
    }, [localUser]);

    return (
        <>
            <div className="position-relative d-flex justify-content-center">
                {dataError ? <AlertPopup message={userError} type='danger' /> : ''}
            </div>
            <div className="h-75 d-flex align-items-center justify-content-center">
                <div className="container">
                    {!isLoading && !userError ? (
                        <div className="d-flex justify-content-center">
                            <h1>{`${role}: ${first_name} ${last_name}`}</h1>
                        </div>
                    ) : ''}
                    {isDataLoading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only" />
                            </div>
                        </div>
                    ) : !isDataLoading && !dataError ? (
                        <>
                            <div className="mt-2">
                                <h2 className="d-flex justify-content-center">
                                    Your {role === "Admin" ? "Agents List" : role === "Agent" ? "Users List" : ""}
                                </h2>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <ol className="list-group list-group-numbered col-md-8 ">
                                    {listData.map((elem, ind) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-start"
                                            key={ind}
                                            onClick={() => {
                                                ageID && ageID === elem.id ? setAgeID('') : setAgeID(elem.id)
                                            }}
                                        >
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{elem.first_name} {elem.last_name}</div>
                                                {elem.email}
                                            </div>
                                            <div>
                                                {
                                                    ageID === elem.id ? (
                                                        <div className="mt-1">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => navigate(`/profile/${elem.id}`)}
                                                            >
                                                                Profile
                                                            </button>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={ErrorIcon} />
                            <h2 className="ms-2">
                                {dataError}
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home;
