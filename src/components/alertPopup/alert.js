import { useEffect } from 'react';

import ErrorIcon from '../../static/icons/errorSmall.svg'

const Alert = ({ message, type }) => {

    useEffect(() => {
        if (message) {
            const alertTrigger = document.getElementById('alert404');
            alertTrigger.innerHTML = `<div class="alert alert-${type} " role="alert">
            <img src=${ErrorIcon} />
            ${message}
            </div>`;
            setTimeout(() => {
                alertTrigger.innerHTML = '';
            }, 5000);
        }
    }, [message]);
    return (
        <div className="position-absolute mt-3" id="alert404">
            {/* <div class={`alert alert-${type} `} role="alert">
                {message}
            </div> */}
        </div>
    )
};

export default Alert;