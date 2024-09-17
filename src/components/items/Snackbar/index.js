// Snackbar.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Snackbar.module.scss';
import successIcon from '~/assets/icons/circle-check-solid.svg';
import failIcon from '~/assets/icons/circle-exclamation-solid.svg';

const cx = classNames.bind(styles);

const Snackbar = ({ message, type, onClose, key }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div key={key} className={cx('snackbar', `${type}`, `${visible ? 'show' : ''}`)}>
            <div className={cx('icon')}>
                <img src={type === 'success' ? successIcon : failIcon} alt={type} />
            </div>
            <div className={cx('message')}>{message}</div>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

export default Snackbar;
