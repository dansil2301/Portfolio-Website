import Eye from '../Imgs/Eye.png'
import {useEffect, useRef, useState} from "react";

export function EyeElement({show}) {
    const eyeContainerClasses = `EyeContainer ${show ? 'visibleEye' : ''}`
    const canvasRef = useRef(null);
    const [horizontalPos, setHorizontalPos] = useState(0); // -30 30
    const [verticalPos, setVerticalPos] = useState(0); // -20 20

    let pupilRad;
    let centerX;
    let centerY;

    const pupil = (ctx) => {
        ctx.beginPath();

        const a = centerX + horizontalPos;
        const b = centerY - verticalPos;
        ctx.arc(a, b, pupilRad, 0, 2 * Math.PI);

        ctx.lineWidth = 11;
        ctx.stroke();
    }

    const innerPupil = (ctx) => {
        ctx.beginPath();

        const a = centerX + horizontalPos;
        const b = centerY - verticalPos;
        ctx.arc(a + horizontalPos * 0.3, b - verticalPos * 0.65, pupilRad * 0.5, 0, 2 * Math.PI);

        ctx.fillStyle = 'rgba(89, 89, 81, 0.5)'; // Change 'blue' to your desired color
        ctx.fill();
        ctx.strokeStyle = '#595951';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    const solve2PoweredFunc = (a, b, c) => {
        const D = (b**2) - 4*a*c;
        return (-b + Math.sqrt(D)) / (2*a);
    }

    const hasParabolaTouchedCircle = (x, y, a, b) => {
        if (pupilRad**2-40 <= ((x - a)**2 + (y - b)**2) &&
            ((x - a)**2 + (y - b)**2) <= pupilRad**2+40){
            return true;
        }
        return false;
    }

    const aboveEyeLidParams = (canvas, position) =>{
        let a; let b;
        if (position === "Top"){
            a = horizontalPos;
            b = verticalPos;
        } else if (position === "Bottom") {
            a = -horizontalPos;
            b = -verticalPos;
        }

        //parabola (x;y) starting coordinate
        const parabolaStartX = canvas.width / 2 - canvas.width / 2 * 0.1 + (a * 0.3);
        const parabolaStartY = -b * 0.5;

        //constant that is responsible for eye movement on X
        const parabolaWidthCoef = (parabolaStartX - a) / (pupilRad**2);

        // count tan
        let tanA = Math.tan((b + parabolaStartY) / (parabolaStartX - a));

        // sin and cos calculation for parabola rotation
        let sinA = tanA / Math.sqrt(tanA**2 + 1);
        let cosA = 1 / Math.sqrt(tanA**2 + 1);
        cosA = cosA === 0 ? 0.000001 : cosA;
        sinA = sinA === 0 ? 0.000001 : sinA;

        return {a, b, parabolaStartX, parabolaStartY, parabolaWidthCoef, cosA, sinA};
    }

    const aboveEyeLid = (ctx, canvas, position, countWidthStep) => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        let { a, b, parabolaStartX, parabolaStartY, parabolaWidthCoef, cosA, sinA } = aboveEyeLidParams(canvas, position);

        const wantedSize = 8;
        const originalSize = 3;
        ctx.lineWidth = wantedSize;

        let countSteps = 0;
        for (let x = centerX + 15; x >= -centerX; x -= 1) {
            countSteps++;
            const xsinA = (x - parabolaStartX) * sinA;
            const xcosA = (x - parabolaStartX) * cosA;

            const aForFunc = parabolaWidthCoef * (cosA**2);
            const bForFunc = parabolaWidthCoef * 2 * xsinA * cosA - sinA;
            const cForFunc = xcosA + parabolaWidthCoef * (xsinA**2);

            const y = solve2PoweredFunc(aForFunc, bForFunc, cForFunc) - parabolaStartY;

            if (hasParabolaTouchedCircle(x, y, a, b)) {break}

            if (position === "Top"){
                ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
            } else if (position === "Bottom") {
                ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
            }

            if (countWidthStep) {
                ctx.lineWidth -= (wantedSize - originalSize) / countWidthStep;
                if (parseInt(x) % 15 === 0){ ctx.stroke(); }
            }
        }

        // first time counts how many steps it takes to get to eye pupil. Second time draws a line with correct width
        if (!countWidthStep) { aboveEyeLid(ctx, canvas, position, countSteps); }
    }

    const middleEyeLidContinuation = (ctx, canvas, position) => {
        ctx.beginPath();

        let a; let b;
        if (position === "Top"){
            a = -horizontalPos;
            b = -verticalPos;
        } else if (position === "Bottom") {
            a = horizontalPos;
            b = verticalPos;
        }

        // parabola starting point
        const parabolaStartX = canvas.width / 2 - canvas.width / 2 * 0.1 + (a * 0.3) + 2;
        const parabolaStartY = -b * 0.4;

        // current parabola params calculations
        const parabolaEdge = -canvas.height / 2 + parabolaStartY * 0.5;
        const xCoef = (-parabolaEdge) / (parabolaStartX**2);
        const freeCoef = parabolaEdge - xCoef*(0**2);

        const wantedSize = 8;
        const originalSize = 4;
        ctx.lineWidth = wantedSize;

        for (let x = centerX; x >= -centerX; x -= 1) {
            const y = xCoef * (x + 1.5)**2 + freeCoef + 5 - parabolaStartY;

            if (x <= parabolaStartX - 0.7 && x > -25) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth -= (wantedSize - originalSize) / (centerX + 25 - 0.7);

                if (position === "Bottom") {
                    ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
                } else if (position === "Top") {
                    ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
                }

                if (parseInt(x) % 15 === 0) { ctx.stroke(); }
            }
        }
    }

    const lastEyeLidReversed = (ctx, canvas, position) => {
        ctx.beginPath();

        let a; let b;
        if (position === "Top"){
            a = -horizontalPos;
            b = -verticalPos;
        } else if (position === "Bottom") {
            a = horizontalPos;
            b = verticalPos;
        }

        //prevParabola starting point
        const parabolaStartPrevX = canvas.width / 2 - canvas.width / 2 * 0.1 + (a * 0.3) + 2;
        const parabolaStartPrevY = -b * 0.4;

        // prevParabola params
        const parabolaEdge = -canvas.height / 2 + parabolaStartPrevY * 0.4;
        const xCoefPrev = (-parabolaEdge) / (parabolaStartPrevX**2);
        const freeCoefPrev = parabolaEdge - xCoefPrev*(0**2) + 4.5;

        // prevParabola ending point
        const prevParabolaXedge = 15; // prev graph ended here //
        const prevParabolaYEdge = -(xCoefPrev * prevParabolaXedge**2 + freeCoefPrev);

        // current parabola starting point
        const parabolaYEdge = prevParabolaYEdge;
        const parabolaXEdge = prevParabolaXedge - 12;

        const xCoef = (-b * 0.4 + parabolaYEdge) / (parabolaStartPrevX + parabolaXEdge)**2;

        const wantedSize = 3;
        const originalSize = 4;
        ctx.lineWidth = originalSize;

        for (let x = centerX; x >= -centerX; x -= 0.5) {
            const y = xCoef * (x+parabolaXEdge)**2 - parabolaYEdge;

            if (x <= -15 && x >= -parabolaStartPrevX - 2){
            ctx.strokeStyle = 'white';
            ctx.lineWidth += (wantedSize - originalSize) / (centerX + 25 - 0.7);

            if (position === "Bottom"){
                ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
            } else if (position === "Top") {
                ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
            }

            if (parseInt(x) % 15 === 0) { ctx.stroke(); }
            }
        }
    }

    const lastEyeLid = (ctx, canvas, position) => {
        ctx.beginPath();

        let a; let b;
        if (position === "Top"){
            a = -horizontalPos;
            b = -verticalPos;
        } else if (position === "Bottom") {
            a = horizontalPos;
            b = verticalPos;
        }

        //prevParabola starting point
        const parabolaStartPrevX = canvas.width / 2 - canvas.width / 2 * 0.1 + (a * 0.3) + 2;
        const parabolaStartPrevY = -b * 0.4;

        // prevParabola params
        const parabolaEdge = -canvas.height / 2 + parabolaStartPrevY * 0.4;
        const xCoefPrev = (-parabolaEdge) / (parabolaStartPrevX**2);
        const freeCoefPrev = parabolaEdge - xCoefPrev*(0**2) + 4.5;

        // prevParabola ending point
        const prevParabolaXedge = 15; // prev graph ended here //
        const prevParabolaYEdge = -(xCoefPrev * prevParabolaXedge**2 + freeCoefPrev);

        // current parabola starting point
        const parabolaYEdge = (-canvas.height / 2 + 2) * 0.8 - b*0.1;
        const parabolaXEdge = (-canvas.width / 2 + 5) * 1.5 - a*0.1;

        // current parabola coef
        const xCoef = (prevParabolaYEdge + parabolaYEdge) / (prevParabolaXedge + parabolaXEdge)**2;

        const wantedSize = 4; //1.5
        const originalSize = 4;
        ctx.lineWidth = originalSize;

        for (let x = -centerX; x <= centerX; x += 0.5) {
            const y = xCoef * (x+parabolaXEdge)**2 - parabolaYEdge;

            if (x >= 17 && x <= canvas.width / 2 * 0.88){
                ctx.strokeStyle = 'white';
                ctx.lineWidth += (wantedSize - originalSize) / (centerX + 25 - 0.7);

                if (position === "Bottom"){
                    ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
                } else if (position === "Top") {
                    ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
                }

                if (parseInt(x) % 15 === 0) { ctx.stroke(); }
            }
        }
    }

    const handleMouseOnMove = (e, canvas) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasCenterX = canvasRect.left + canvas.width / 2;
        const canvasCenterY = canvasRect.top + canvas.height / 2;
        const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const lerp = (a, b, t) => a * (1 - t) + b * t;

        const tmpCoordX = mouseX < canvasCenterX ? -(canvasCenterX - mouseX) : mouseX - canvasCenterX;

        //set x from -canvas.width * 0.1 to canvas.width * 0.1
        const percentCoordX = tmpCoordX / canvasCenterX;
        const eyeMovementX = percentCoordX * canvas.width * 0.1; // 35 is an edge number that eye can move to
        setHorizontalPos(eyeMovementX);

        const tmpCoordY = mouseY < canvasCenterY ? canvasCenterY - mouseY : -(mouseY - canvasCenterY);

        //set x from -canvas.height * 0.06 to canvas.height * 0.06
        let percentCoordY = tmpCoordY < 0 ? tmpCoordY / (window.innerHeight - canvasCenterY) : tmpCoordY / canvasCenterY;
        percentCoordY = easeInOut(Math.abs(percentCoordY)) * Math.sign(percentCoordY);
        let eyeMovementY = lerp(verticalPos, percentCoordY * canvas.height * 0.06, 0.20);
        setVerticalPos(eyeMovementY);
    }

    const drawEye = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const eyeImg = document.querySelector('.EyeImg');
        const eyeImgStyle = window.getComputedStyle(eyeImg);

        canvas.style.width = `${parseFloat(eyeImgStyle.width)}px`;
        canvas.style.height = `${parseFloat(eyeImgStyle.height)}px`;

        canvas.width = parseFloat(canvas.style.width) * devicePixelRatio;
        canvas.height = parseFloat(canvas.style.height) * devicePixelRatio;

        ctx.imageSmoothingEnabled = true;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;

        pupilRad = canvas.width / 2 * 0.3;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        pupil(ctx);
        innerPupil(ctx);
        aboveEyeLid(ctx, canvas, "Top");
        aboveEyeLid(ctx, canvas, "Bottom")
        middleEyeLidContinuation(ctx, canvas, "Bottom");
        middleEyeLidContinuation(ctx, canvas, "Top");
        lastEyeLidReversed(ctx, canvas, "Bottom");
        lastEyeLidReversed(ctx, canvas, "Top");
/*        lastEyeLid(ctx, canvas, "Bottom");
        lastEyeLid(ctx, canvas, "Top");*/
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        const handleMouseMove = (e) => {
            handleMouseOnMove(e, canvas);
        };

        window.addEventListener('mousemove', handleMouseMove);

        drawEye();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [show, horizontalPos, horizontalPos]);

    return (
        <div className={eyeContainerClasses} >
            <canvas className="EyeImg" ref={canvasRef} />
        </div>
    )
}