import styles from './SubHeader.module.scss';
import classNames from 'classnames/bind';
import Rectangle from '~/assets/icons/Rectangle.svg';
import Triangle from '~/assets/icons/Triangle.svg';
import Circle from '~/assets/icons/Circle.svg';
import Line from '~/assets/icons/Line-Tool.svg';
import Brush from '~/assets/icons/Brush-1.svg';
import Eraser from '~/assets/icons/Eraser-Tool.svg';
import Fill from '~/assets/icons/Paint-Bucket.svg';
// import Select from '~/assets/icons/Direction-Select.svg';
import trash from '~/assets/icons/trash-solid.svg';
import { useState } from 'react';

const cx = classNames.bind(styles);

function SubHeader({
    selectedTool,
    setSelectedTool,
    brushWidth,
    setBrushWidth,
    selectedColor,
    setSelectedColor,
    setIsClear,
    // setIsDragging
}) {
    const colorOptions = [
        '#A9A9A9',
        '#000',
        '#765827',
        '#F875AA',
        '#D80032',
        '#FF6C22',
        '#FFFB73',
        '#A7D397',
        '#4a98f7',
        '#39A7FF',
        '#B15EFF',
        '#d2e3c8',
    ];

    // State to track the selected color
    const [selectedColorIndex, setSelectedColorIndex] = useState(1);

    const handleToolClick = (tool) => {
        setSelectedTool(tool.toLowerCase()); // Convert the tool ID to lowercase
    };

    // Event handler to update the brush width
    const handleBrushWidthChange = (e) => {
        const newBrushWidth = parseInt(e.target.value, 10);
        setBrushWidth(newBrushWidth); // Update the brush width in the parent component
    };

    const handleClearCanvas = () => {
        setIsClear(true);
    };

    // const handleDragging = () => {
    //     setIsDragging(true);
    // }

    const handleColorClick = (color, index) => {
        setSelectedColor(color.toLowerCase());
        setSelectedColorIndex(index);
    };

    return (
        <section className={cx('container')}>
            <div className={cx('column')}>
                <label className={cx('title')}>Shapes</label>
                <ul className={cx('options', 'grid-tool')}>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'line' })}
                        id="line"
                        onClick={() => handleToolClick('line')}
                    >
                        <img src={Line} alt="Line" />
                        <span>Line</span>
                    </li>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'rectangle' })}
                        id="rectangle"
                        onClick={() => handleToolClick('rectangle')}
                    >
                        <img src={Rectangle} alt="Rectangle" />
                        <span>Rectangle</span>
                    </li>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'triangle' })}
                        id="triangle"
                        onClick={() => handleToolClick('triangle')}
                    >
                        <img src={Triangle} alt="Triangle" />
                        <span>Triangle</span>
                    </li>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'circle' })}
                        id="circle"
                        onClick={() => handleToolClick('circle')}
                    >
                        <img src={Circle} alt="Circle" />
                        <span>Circle</span>
                    </li>
                    {/* <li className={cx('option')}>
                            <input type="checkbox" id="fill-color"></input>
                            <label for="fill-color">Fill color</label>
                        </li> */}
                </ul>
            </div>
            {/* ------------------------------------Options------------------------------- */}
            <div className={cx('column')}>
                <label className={cx('title')}>Options</label>
                <ul className={cx('options', 'grid-tool', 'grid-3')}>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'brush' })}
                        id="brush"
                        onClick={() => handleToolClick('brush')}
                    >
                        <img src={Brush} alt="Brush" />
                        <span>Brush</span>
                    </li>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'eraser' })}
                        id="eraser"
                        onClick={() => handleToolClick('eraser')}
                    >
                        <img src={Eraser} alt="Eraser" />
                        <span>Eraser</span>
                    </li>
                    <li
                        className={cx('option', 'tool', { active: selectedTool === 'fill' })}
                        id="fill"
                        onClick={() => handleToolClick('fill')}
                    >
                        <img src={Fill} alt="Fill" />
                        <span>Fill</span>
                    </li>
                    {/* <li
                        className={cx('option', 'tool', { active: selectedTool === 'selection' })}
                        id="selection"
                        onClick={() => handleToolClick('selection')}
                    >
                        <img src={Select} alt="Selection" />
                        <span>Select</span>
                    </li> */}
                </ul>
                <div className={cx('option', 'tool', 'slider')}>
                    <input
                        type="range"
                        className={cx('size-slider')}
                        id="size-slider"
                        min={1}
                        max={80}
                        value={brushWidth}
                        onChange={handleBrushWidthChange}
                    />
                </div>
            </div>
            {/* ----------------------------Color--------------------- */}
            <div className={cx('column', 'colors')}>
                <label className={cx('title')}>Colors</label>
                <ul className={cx('options', 'grid-color')}>
                    {colorOptions.map((color, index) => (
                        <li
                            key={index}
                            className={cx('option', { selected: index === selectedColorIndex })}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorClick(color, index)}
                        ></li>
                    ))}
                    {/* <li className={cx('option', 'selected')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li>
                    <li className={cx('option')}></li> */}
                    <li className={cx('option')}>
                        <input
                            type="color"
                            className={cx('color-picker')}
                            value="#FFF4F4"
                            onChange={(e) => handleColorClick(e.target.value, colorOptions.length)}
                        />
                    </li>
                    <li className={cx('option')}>
                        <input
                            type="color"
                            className={cx('color-picker')}
                            value="#FFF4F4"
                            onChange={(e) => handleColorClick(e.target.value, colorOptions.length)}
                            style={{ backgroundColor: selectedColor }}
                        />
                    </li>
                    <li className={cx('option')}>
                        <input
                            type="color"
                            className={cx('color-picker')}
                            value="#FFF4F4"
                            onChange={(e) => handleColorClick(e.target.value, colorOptions.length)}
                        />
                    </li>
                    <li className={cx('option')}>
                        <input
                            type="color"
                            className={cx('color-picker')}
                            value="#FFF4F4"
                            onChange={(e) => handleColorClick(e.target.value, colorOptions.length)}
                            style={{ backgroundColor: selectedColor }}
                        />
                    </li>
                </ul>
            </div>
            <div className={cx('column', 'df')}>
                <button onClick={handleClearCanvas} className={cx('button-clear')}>
                    <img src={trash} alt="trash" />
                </button>
            </div>
        </section>
    );
}

export default SubHeader;
