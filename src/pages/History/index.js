/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import HeaderHistory from '../../components/Layout/DefautLayout/HeaderHistory';
import styles from './History.module.scss';
import classNames from 'classnames/bind';
import { createContext } from 'react';
import Loader from '~/components/items/Loader';
import Snackbar from '~/components/items/Snackbar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogout } from '../../actionCreators/LoginAction';
import { setEditMode } from '../../actionCreators/UserAction';

const cx = classNames.bind(styles);

export const SizeContext = createContext();

function History(props) {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [width, setWidth] = useState(1080);
    const [height, setHeight] = useState(540);
    const pathBackEnd = 'https://backendpainter-v1.onrender.com';
    const [images, setImages] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [deleteImages, setDeleteImages] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');

    const openSnackbar = (message, type) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
    };

    const closeSnackbar = () => {
        setSnackbarVisible(false);
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeDeleteDialog();
        }
    };

    const openDeleteDialog = (isDeleteAll) => {
        setShowDeleteDialog(true);
        setDeleteImages(isDeleteAll);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setDeleteImages(false);
        setImageToDelete(null);
    };

    const setSize = (newWidth, newHeight) => {
        setWidth(newWidth);
        setHeight(newHeight);
    };

    const handleLogout = () => {
        props.userLogout();
    };

    const getUserIDByUserEmail = async (email) => {
        try {
            const response = await fetch(`${pathBackEnd}/users/getUserIDByEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const responseData = await response.json();
            console.log('getUserIDByUserEmail response:', responseData);
            return responseData.userID; // Adjust this based on your actual response structure
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null; // Handle the error appropriately in your application
        }
    };

    const fetchImages = async () => {
        try {
            const userId = await getUserIDByUserEmail(localStorage.getItem('email'));
            const response = await fetch(`${pathBackEnd}/getImagesOfUser/${userId}`);
            const responseData = await response.json();

            const imagesArray = Array.isArray(responseData.images) ? responseData.images : [];
            console.log('The current user ' + userId + ' is ');
            const userImages = imagesArray.filter((image) => image.user_id === userId);
            setImages(userImages);
            setLoading(false);
            setDeleting(false);
        } catch (error) {
            console.error('Error fetching images:', error);
            setLoading(false);
            setDeleting(false);
        }
    };

    const deleteImageId = async (imageID) => {
        try {
            setDeleting(true);
            await fetch(`${pathBackEnd}/delete/${imageID}`, {
                method: 'DELETE',
            });

            closeDeleteDialog();
            fetchImages();
            openSnackbar('Image deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting image: ', error);
            closeDeleteDialog();
            openSnackbar('Failed to delete image', 'error');
        }
    };

    const deleteAllImages = async (email) => {
        const user_id = await getUserIDByUserEmail(email);
        try {
            setDeleting(true);
            await fetch(`${pathBackEnd}/deleteAllImageByUserID/${user_id}`, {
                method: 'DELETE',
            });
            closeDeleteDialog();
            fetchImages();
            openSnackbar('All images deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting all images: ', error);
            closeDeleteDialog();
            openSnackbar('Failed to delete all images', 'error');
        }
    };

    const formatImageDate = (fullDate) => {
        const dateObject = new Date(fullDate);
        const formattedDate = dateObject.toLocaleDateString();
        return formattedDate;
    };

    localStorage.setItem('isEditValue', false);

    const isEditMode = async (value) => {
        localStorage.setItem('isEditValue', value);
    };

    useEffect(() => {
        props.setEditMode(true);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('email') === null) {
            alert('Directing you back to home');
            window.location.href = '/'; // Redirect to the home page
            props.setEditMode(false);
        } else {
            // Only fetch images if userInfo is not null
            fetchImages();
        }
    }, []);

    return (
        <SizeContext.Provider
            value={{
                width,
                height,
                setWidth,
                setHeight,
                setSize,
            }}
        >
            <HeaderHistory handleLogout={handleLogout} />{' '}
            <div className={cx('wrapper')}>
                <div className={cx('container-history')}>
                    {loading || deleting ? (
                        <div className={cx('overlay')}>
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className={cx('container-header')}>
                                <h3>{localStorage.getItem('email')} </h3>
                                <div className={cx('buttons-action')}>
                                    {/* <button onClick={() => deleteAllImages(localStorage.getItem('email'))}>
                                        Delete All
                                    </button> */}
                                    <button onClick={() => openDeleteDialog(true)}>Delete All</button>
                                </div>
                            </div>
                            <div className={cx('list-images')}>
                                {images.map((image) => (
                                    <div key={image.imageID} className={cx('image-item')}>
                                        <img src={image.image_data} alt="anh" className={cx('card-image')} />
                                        <p className={cx('image-item-date')}>
                                            Created at: {formatImageDate(image.dateImage)}
                                        </p>
                                        <div className={cx('buttons-action')}>
                                            <Link to={`/edit/${image.imageID}`}>
                                                <button onClick={() => isEditMode(true)}>Edit</button>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    openDeleteDialog();
                                                    setImageToDelete(image.imageID);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* Confirmation Dialog for Delete Single Image */}
                                        {showDeleteDialog && !deleteImages && image.imageID === imageToDelete && (
                                            <div className={cx('confirmation-dialog')} onClick={handleOverlayClick}>
                                                <div className={cx('confirmation-dialog-content')}>
                                                    <p>Are you sure you want to delete image?</p>
                                                    <div className={cx('confirmation-dialog-buttons')}>
                                                        <button onClick={() => deleteImageId(image.imageID)}>
                                                            Yes
                                                        </button>
                                                        <button onClick={() => closeDeleteDialog()}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* Confirmation Dialog for Delete All */}
                            {showDeleteDialog && deleteImages && (
                                <div className={cx('confirmation-dialog')} onClick={handleOverlayClick}>
                                    <div className={cx('confirmation-dialog-content')}>
                                        <p>Are you sure you want to delete all images?</p>
                                        <div className={cx('confirmation-dialog-buttons')}>
                                            <button onClick={() => deleteAllImages(localStorage.getItem('email'))}>
                                                Yes
                                            </button>
                                            <button onClick={() => closeDeleteDialog()}>No</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Snackbar */}
                            {snackbarVisible && (
                                <Snackbar message={snackbarMessage} type={snackbarType} onClose={closeSnackbar} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </SizeContext.Provider>
    );
}

const mapStateToProps = (state) => {
    return {
        tokenUser: state.LoginReducer.tokenUser,
        dataCart: state.UserReducer.dataCart,
        editMode: state.UserReducer.editMode,
    };
};

const mapDispatchToProps = {
    userLogout,
    setEditMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(History);
