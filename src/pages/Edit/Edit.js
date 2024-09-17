import styles from './Edit.module.scss';
import classNames from 'classnames/bind';
import undoAction from '~/assets/icons/rotate-left-solid.svg';
import redoAction from '~/assets/icons/rotate-right-solid.svg';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

function Edit({ canvasRef, selectedTool, brushWidth, selectedColor, width, height, isClear, setIsClear, props }) {
    const { imageID } = useParams();

    localStorage.setItem('isImageEdit', imageID);

    const [isDrawing, setIsDrawing] = useState(false);
    const [prevMouseX, setPrevMouseX] = useState(null);
    const [prevMouseY, setPrevMouseY] = useState(null);
    const [snapshot, setSnapshot] = useState(null);

    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    // const pathBackEnd = 'https://backendpainter-v1.onrender.com';
    const pathBackEnd = 'https://backendpainter-v1.onrender.com';
    const [imageData, setImageData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${pathBackEnd}/getImage/${imageID}`);
                if (response.status === 200) {
                    const imageDataFromResponse = response.data.images[0]?.image_data;
                    if (imageDataFromResponse) {
                        setImageData(imageDataFromResponse);
                    } else {
                        console.error('Error fetching image. No image_data in response.');
                    } // console.log('Response Data:', response.data);
                    setImageData(response.images.imageData);
                } else {
                    console.error('Error fetching image. Status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        fetchData();
    }, [imageID]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context && imageData) {
            const img = new Image();
            img.src = imageData;
            img.onload = () => {
                console.log('Image loaded successfully:', img);
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                // context.drawImage(img, 0, 0);
            };
            img.onerror = (error) => {
                console.error('Error loading image:', error);
            };
        }

        if (isClear) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            clearCanvas();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClear, imageData]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            context.willReadFrequently = true;
            setCanvasBackground(context);
            setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
        }

        if (isClear) {
            clearCanvas();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClear, canvasRef]);

    const setCanvasBackground = (context) => {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = selectedColor;
    };

    const saveCanvasState = (context) => {
        const canvas = context.canvas;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack([...undoStack, imageData]);
        setRedoStack([]); // Clear the redoStack after saving a new state
    };

    const undo = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            setRedoStack([...redoStack, context.getImageData(0, 0, canvas.width, canvas.height)]);
            context.putImageData(lastState, 0, 0);
        }
    };

    const redo = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack([...undoStack, context.getImageData(0, 0, canvas.width, canvas.height)]);
            context.putImageData(nextState, 0, 0);
        }
    };


    const startDraw = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        setIsDrawing(true);
        setIsClear(false);
        setPrevMouseX(e.nativeEvent.offsetX);
        setPrevMouseY(e.nativeEvent.offsetY);
        saveCanvasState(context);

        context.beginPath();
        context.lineCap = 'round';
        context.strokeStyle = selectedColor;
        context.lineWidth = brushWidth;
        setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
    };

    const drawing = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.putImageData(snapshot, 0, 0);

        if (selectedTool === 'brush' || selectedTool === 'eraser') {
            context.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
            // context.moveTo(prevMouseX, prevMouseY);
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            context.stroke();
        } else if (selectedTool === 'line') {
            drawLine(context, e);
        } else if (selectedTool === 'rectangle') {
            drawRect(context, e);
        } else if (selectedTool === 'triangle') {
            drawTriangle(context, e);
        } else if (selectedTool === 'circle') {
            drawCircle(context, e);
        } else if (selectedTool === 'fill') {
            floodFill(context, getFillColor());
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        updateSnapshot();
    };

    const drawLine = (context, e) => {
        context.beginPath();
        context.moveTo(prevMouseX, prevMouseY);
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
    };

    const drawRect = (context, e) => {
        const startX = Math.min(prevMouseX, e.nativeEvent.offsetX);
        const startY = Math.min(prevMouseY, e.nativeEvent.offsetY);
        const width = Math.abs(prevMouseX - e.nativeEvent.offsetX);
        const height = Math.abs(prevMouseY - e.nativeEvent.offsetY);

        context.strokeStyle = selectedColor;
        context.strokeRect(startX, startY, width, height);
    };

    const drawTriangle = (context, e) => {
        context.beginPath();
        context.moveTo(prevMouseX, prevMouseY);
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.lineTo(prevMouseX * 2 - e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.closePath();
        context.stroke();
    };

    const drawCircle = (context, e) => {
        context.beginPath();
        let radius = Math.sqrt(
            Math.pow(prevMouseX - e.nativeEvent.offsetX, 2) + Math.pow(prevMouseY - e.nativeEvent.offsetY, 2),
        );
        context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        context.stroke();
    };

    // ------------Fill color----------------------------------
    const floodFill = () => {
        console.log('Flood Fill called');
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const targetColor = getPixel(imageData, prevMouseX, prevMouseY);
        const fillColor = getFillColor();

        if (!colorsMatch(targetColor, fillColor, 30)) {
            fillPixel(imageData, prevMouseX, prevMouseY, targetColor, fillColor);
            context.putImageData(imageData, 0, 0);
        }
    };

    const getPixel = (imageData, x, y) => {
        const index = (y * imageData.width + x) * 4;
        return [
            imageData.data[index], // Red component
            imageData.data[index + 1], // Green component
            imageData.data[index + 2], // Blue component
            imageData.data[index + 3], // Alpha component
        ];
    };
    const colorsMatch = (color1, color2) => {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
    };

    const fillPixel = (imageData, x, y, targetColor, fillColor) => {
        // const index = (y * imageData.width + x) * 4;
        const imageDataArray = imageData.data;

        const queue = [];
        queue.push([x, y]);

        while (queue.length > 0) {
            const [pixelX, pixelY] = queue.shift();
            const pixelIndex = (pixelY * imageData.width + pixelX) * 4;
            const pixelColor = [
                imageDataArray[pixelIndex], // Red component
                imageDataArray[pixelIndex + 1], // Green component
                imageDataArray[pixelIndex + 2], // Blue component
                imageDataArray[pixelIndex + 3], // Alpha component
            ];

            if (colorsMatch(pixelColor, targetColor)) {
                imageDataArray[pixelIndex] = fillColor[0];
                imageDataArray[pixelIndex + 1] = fillColor[1];
                imageDataArray[pixelIndex + 2] = fillColor[2];
                imageDataArray[pixelIndex + 3] = fillColor[3];

                if (pixelX > 0) {
                    queue.push([pixelX - 1, pixelY]);
                }
                if (pixelX < imageData.width - 1) {
                    queue.push([pixelX + 1, pixelY]);
                }
                if (pixelY > 0) {
                    queue.push([pixelX, pixelY - 1]);
                }
                if (pixelY < imageData.height - 1) {
                    queue.push([pixelX, pixelY + 1]);
                }
            }
        }
    };

    const getFillColor = () => {
        const colorString = selectedColor.toLowerCase();
        // Check for color names or hexadecimal format
        const namedColor = nameToRGB(colorString);
        if (namedColor) {
            return namedColor;
        }
        // Check for RGB format
        const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
        const rgbMatch = colorString.match(rgbRegex);
        if (rgbMatch) {
            const red = parseInt(rgbMatch[1], 10);
            const green = parseInt(rgbMatch[2], 10);
            const blue = parseInt(rgbMatch[3], 10);

            if (
                !isNaN(red) &&
                !isNaN(green) &&
                !isNaN(blue) &&
                red >= 0 &&
                red <= 255 &&
                green >= 0 &&
                green <= 255 &&
                blue >= 0 &&
                blue <= 255
            ) {
                return [red, green, blue, 255];
            }
        }
        // Check for hexadecimal format
        const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/;
        const hexMatch = colorString.match(hexRegex);
        if (hexMatch) {
            const red = parseInt(hexMatch[1], 16);
            const green = parseInt(hexMatch[2], 16);
            const blue = parseInt(hexMatch[3], 16);

            if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
                return [red, green, blue, 255];
            }
        }
        // If the colorString doesn't match any expected format, return a default color (black) with a default alpha value of 255 (fully opaque)
        return [0, 0, 0, 255];
    };
    // Helper function to convert color names to RGB
    const nameToRGB = (colorName) => {
        const namedColors = {
            grey: [128, 128, 128, 255],
            // Add more named colors as needed
        };

        const normalizedColorName = colorName.toLowerCase();
        if (namedColors[normalizedColorName]) {
            return namedColors[normalizedColorName];
        }

        return null;
    };
    // -------------------------------------------------------
    const updateSnapshot = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        //Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground(context);
    };

    return (
        <section className={cx('drawing-board')}>
            <div className={cx('actions')}>
                <button
                    className={cx(styles['button'], { [styles['disabled-button']]: undoStack.length === 0 })}
                    onClick={undo}
                >
                    {' '}
                    <img src={undoAction} alt="undo" className={cx('items')} />
                </button>
                <button
                    className={cx(styles['button'], { [styles['disabled-button']]: redoStack.length === 0 })}
                    onClick={redo}
                >
                    {' '}
                    <img src={redoAction} alt="redo" className={cx('items')} />
                </button>
            </div>
            <canvas
                id="myCanvas"
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={startDraw}
                onMouseMove={drawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>
        </section>
    );
}

export default Edit;
