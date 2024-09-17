import Header from '~/components/Layout/DefautLayout/Header';
import SubHeader from '~/components/Layout/DefautLayout/SubHeader';
import Home from '~/pages/Home';
import Edit from '~/pages/Edit';
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import { createContext, useState, useEffect, useRef } from 'react';
import { useUser } from '../../../hook/UserContext';
import { connect } from 'react-redux';
import { userLogout } from '../../../actionCreators/LoginAction';
import { setEditMode } from '../../../actionCreators/UserAction';
import { useNavigate  } from 'react-router-dom';

const cx = classNames.bind(styles);

export const SizeContext = createContext();

function DefaultLayout(props) {
    const navigate = useNavigate();

    const [selectedTool, setSelectedTool] = useState('brush');
    const [brushWidth, setBrushWidth] = useState(5);
    const [selectedColor, setSelectedColor] = useState('rgb(0,0,0)');
    const [isClear, setIsClear] = useState(false);
    // const [isDraging, setIsDragging] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [width, setWidth] = useState(1080);
    const [height, setHeight] = useState(540);
    const canvasRef = useRef(null);

    const setSize = (newWidth, newHeight) => {
        setWidth(newWidth);
        setHeight(newHeight);
    };
    const handleSetEditMode = (value) => {
        setEditMode(value);
        props.setEditMode(value); // Dispatch action to update Redux store
    };

    const { userInfo, logout } = useUser();
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const decoded = JSON.parse(atob(base64));
            return decoded;
        } catch (e) {
            console.error('Error parsing JWT:', e);
            return null;
        }
    };
    useEffect(() => {
        handleSetEditMode(props.editMode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.editMode]);
    // Usage
    if (localStorage.getItem('token-user')) {
        var userData = parseJwt(localStorage.getItem('token-user'));
        // Now userData contains the decoded JWT payload
    }

    const handleLogout = () => {
        props.userLogout();
        logout();
    };

    const handleDownloadImage = () => {
        // const canvas = document.getElementById('myCanvas');
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const timestamp = new Date().getTime();
            const randomString = Math.random().toString(36).substring(7);
            const fileName = `drawing_${timestamp}_${randomString}.jpg`;

            // Get the Data URL of the canvas content as a JPEG image
            const imageDataURL = canvas.toDataURL('image/jpeg');

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = imageDataURL;
            link.download = fileName;

            // Trigger a click on the link to initiate the download
            link.click();
        }
    };

    return (
        <SizeContext.Provider value={{ width, height, setWidth, setHeight, setSize }}>
            <div className={cx('wrapper')}>
                <Header handleLogout={handleLogout} handleDownloadImage={handleDownloadImage} canvasRef={canvasRef}/>
                <SubHeader
                    selectedTool={selectedTool}
                    setSelectedTool={setSelectedTool}
                    brushWidth={brushWidth}
                    setBrushWidth={setBrushWidth}
                    setSelectedColor={setSelectedColor}
                    setIsClear={setIsClear}
                    // setIsDragging={setIsDragging}
                />
                <div className={cx('container')}>
                    {localStorage.getItem('isEditValue') ? (
                        <Edit
                            userInfo={userInfo}
                            selectedTool={selectedTool}
                            brushWidth={brushWidth}
                            selectedColor={selectedColor}
                            width={width}
                            height={height}
                            isClear={isClear}
                            setIsClear={setIsClear}
                            canvasRef={canvasRef}
                        />
                    ) : (
                        <Home
                            userInfo={userInfo}
                            selectedTool={selectedTool}
                            brushWidth={brushWidth}
                            selectedColor={selectedColor}
                            width={width}
                            height={height}
                            isClear={isClear}
                            setIsClear={setIsClear}
                            canvasRef={canvasRef}
                        />
                    )}
                </div>
            </div>
        </SizeContext.Provider>
    );
}

const mapStateToProps = (state) => {
    return {
        tokenUser: state.LoginReducer.tokenUser,
        editMode: state.UserReducer.editMode,
    };
};

const mapDispatchToProps = {
    userLogout,
    setEditMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
