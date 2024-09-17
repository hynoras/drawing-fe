import styles from './Loader.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Loader() {
    return (
        <div className={cx('boxes')}>
            <div className={cx('box')}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={cx('box')}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={cx('box')}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className={cx('box')}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Loader;
