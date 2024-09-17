import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { SizeContext } from '~/components/Layout/DefautLayout';
import styles from './Dialog.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dialog({ onClose }) {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const { width, height, setWidth, setHeight, setSize } = useContext(SizeContext);

    // Retrieve width and height from localStorage
    const originalWidth = localStorage.getItem('width') || 1080;
    const originalHeight = localStorage.getItem('height') || 570;

    const handleConfirm = () => {
        setSize(width, height);
        onClose();

        // Save width and height to localStorage
        localStorage.setItem('width', width);
        localStorage.setItem('height', height);

        // Use an IIFE to wait for the local storage to be updated
        (async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Navigate to the home page
            navigate('/');
        })();
    };

    const handleCancel = () => {
        // Khôi phục giá trị ban đầu khi hủy bỏ
        setWidth(originalWidth);
        setHeight(originalHeight);
        onClose();
    };

    return (
        <div className={cx('dialog')}>
            <h2>Create New Item</h2>
            <div className={cx('wrapper-items')}>
                <label htmlFor="Width">Width:</label>
                <input
                    className={cx('input')}
                    type="number"
                    id="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                />
                <label htmlFor="Height">Height:</label>
                <input
                    className={cx('input')}
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />
            </div>
            <button className={cx('button')} onClick={handleConfirm}>
                Create
            </button>

            <button className={cx('button')} onClick={handleCancel}>
                Cancel
            </button>
        </div>
    );
}

export default Dialog;
