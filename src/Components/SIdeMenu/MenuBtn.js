import React, {useEffect, useState} from 'react';

export const MenuBtn = ({onClick, useRef}) => {
    const [isHovered, setHovered] = useState(false);
    const [isClicked, setClicked] = useState(false);

    const handleDocumentClick = (event) => {
        const lineElement = document.getElementById("MenuBtnIndex").getElementsByTagName("line")[0];
        const computedStyle = window.getComputedStyle(lineElement);
        const opacity = computedStyle.getPropertyValue("opacity");
        if (
            (useRef.current &&
            !useRef.current.contains(event.target) &&
            !document.getElementById("SideBarIndex").contains(event.target) &&
            opacity === "0") ||
            (!document.getElementById("SideBarIndex").classList.contains("visible") && opacity === "0")
        ) {
            setClicked(true);

            setTimeout(() => {
                setClicked(false);
            }, 500);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <svg
            width="60"
            height="38"
            viewBox="0 0 60 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`MenuBtn ${isHovered ? 'hovered' : ''}`}
            id="MenuBtnIndex"
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onClick={() => {setClicked((prevClicked) => !prevClicked); onClick();}}
        >
            <line y1="-1.5" x2="59" y2="-1.5" transform="matrix(1 0 0.0144674 0.999895 0.998169 3.3302)" stroke="white"
                  strokeWidth="3" style={applyStyle(isClicked, isHovered, "End")} />
            <line y1="-1.5" x2="59" y2="-1.5" transform="matrix(1 0 0.0144674 0.999895 0.998169 20.5)" stroke="white"
                  strokeWidth="3" style={applyStyle(isClicked, isHovered, "Middle")} />
            <line y1="-1.5" x2="59" y2="-1.5" transform="matrix(1 0 0.0144674 0.999895 0.998169 37.6699)" stroke="white"
                  strokeWidth="3" style={applyStyle(isClicked, isHovered, "End")} />
        </svg>
    );
};

function applyStyle(isClicked, isHovered, strEndMiddle) {
    const element= document.getElementById("MenuBtnIndex");
    let opacity = 1
    if (element) {
        const lineElement = element.getElementsByTagName("line")[0];
        const computedStyle = window.getComputedStyle(lineElement);
        opacity = computedStyle.getPropertyValue("opacity");
    }

    const lineStyleMiddle = {
        transition: 'stroke-dashoffset 0.3s ease-in-out',
        strokeDasharray: '59',
        strokeDashoffset: isHovered ? '0' : '9',
    };

    const lineStyleEnds = {
        transition: 'stroke-dashoffset 0.3s ease-in-out',
        strokeDasharray: '59',
        strokeDashoffset: isHovered ? '9' : '0',
    };

    const clickStyles = {
        transition: '0.5s ease-in-out',
        transform: isClicked ? ((opacity === 0) ? 'rotate(0deg)' : 'rotate(45deg)') : 'rotate(0deg)',
        opacity: isClicked ? ((opacity === 0) ? 1 : 0) : 1,
    };

    let lineStyleAll = strEndMiddle === "Middle" ? lineStyleMiddle : lineStyleEnds;
    let lineStyle;

    if (isClicked) {
        lineStyle = clickStyles;
    } else {
        lineStyle = lineStyleAll;
    }

    return lineStyle;
}