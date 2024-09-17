// import { toast } from 'react-toastify';
const initialState = {
    isProductLoading: false,
    alert: {
        show: false,
        message: '',
        variant: 'light',
    },
    editMode: false,
    isFetchingImage: false,
    fetchedImageData: null,
    fetchImageError: null,
    imageWidth: 0,
    imageHeight: 0,
};
const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_IS_PRODUCT_LOADING':
            return {
                ...state,
                isProductLoading: action.boolean,
            };

        case 'USER_GET_DATA_PRODUCT':
            return {
                ...state,
                dataProduct: action.payload,
            };

        case 'SET_EDIT_MODE':
            return { ...state, editMode: action.payload };

        case 'FETCH_IMAGE_START':
            return {
                ...state,
                isFetchingImage: true,
                fetchedImageData: null,
                fetchImageError: null,
            };

        case 'FETCH_IMAGE_SUCCESS':
            // const { imageData } = action.payload;
            const { image, naturalWidth, naturalHeight } = action.payload;
            return {
                ...state,
                isFetchingImage: false,
                fetchedImageData: image,
                fetchImageError: null,
                imageWidth: naturalWidth,
                imageHeight: naturalHeight,
            };

        case 'FETCH_IMAGE_FAILURE':
            return {
                ...state,
                isFetchingImage: false,
                fetchedImageData: null,
                fetchImageError: action.payload,
            };

        default:
            return state;
    }
};

export default UserReducer;
