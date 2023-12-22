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
        ctx.arc(a + horizontalPos * 0.3, b - verticalPos * 0.3, pupilRad * 0.5, 0, 2 * Math.PI);

        ctx.fillStyle = 'rgba(43, 106, 188, 0.5)'; // Change 'blue' to your desired color
        ctx.fill();
        ctx.strokeStyle = '#2B6ABC';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    const solve2PoweredFunc = (a, b, c) => {
        const D = (b**2) - 4*a*c;
        return (-b + Math.sqrt(D)) / (2*a);
    }

    const hasParavolaTouchedCircle = (x, y, a, b) => {
        if (pupilRad**2-40 <= ((x - a)**2 + (y - b)**2) &&
            ((x - a)**2 + (y - b)**2) <= pupilRad**2+40){
            return true;
        }
        return false;
    }

    const aboveEyeLid = (ctx, canvas, position, countWidthStep) => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        let a; let b;
        if (position === "Top"){
            a = horizontalPos;
            b = verticalPos;
        } else if (position === "Bottom") {
            a = -horizontalPos;
            b = -verticalPos;
        }

        const parabolaStart = canvas.width / 2 - 3;

        //constant that is responsible for eye movement on X
        const parabolaWidthCoef = (parabolaStart - a) / (pupilRad**2);

        // count tan
        let tanA = Math.tan(b / (parabolaStart - a));

        // sin and cos calculation for parabola rotation
        let sinA = tanA / Math.sqrt(tanA**2 + 1);
        let cosA = 1 / Math.sqrt(tanA**2 + 1);
        cosA = cosA == 0 ? 0.000001 : cosA;
        sinA = sinA == 0 ? 0.000001 : sinA;

        ctx.lineWidth = 8;
        const wantedSize = 8;
        const originalSize = 3;
        let countSteps = 0;
        for (let x = centerX; x >= -centerX; x -= 1.5) {
            const xsinA = (x - parabolaStart) * sinA;
            const xcosA = (x - parabolaStart) * cosA;

            const aForFunc = parabolaWidthCoef * (cosA**2);
            const bForFunc = parabolaWidthCoef * 2 * xsinA * cosA - sinA;
            const cForFunc = xcosA + parabolaWidthCoef * (xsinA**2);

            const y = solve2PoweredFunc(aForFunc, bForFunc, cForFunc);

            if (hasParavolaTouchedCircle(x, y, a, b)) {break}
            countSteps++;

            //ctx.lineWidth = lineWidth;
            if (position === "Top"){
                ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
            } else if (position === "Bottom") {
                ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
            }

            if (countWidthStep) {
                ctx.lineWidth -= (wantedSize - originalSize) / countWidthStep;
                if (x%14 === 0){
                    ctx.stroke();
                }
            }
        }

        if (!countWidthStep) {
            aboveEyeLid(ctx, canvas, position, countSteps);
        }
        else {
            ctx.stroke();
        }
    }

    const middleEyeLidContinueation = (ctx, canvas, position) => {
        ctx.beginPath();

        const parabolaStart = canvas.width / 2 - 5;

        const parabolaEdge = -canvas.height / 2 + 2;
        const xCoef = (-parabolaEdge) / (parabolaStart**2);
        const freeCoef = parabolaEdge - xCoef*(0**2);

        ctx.lineWidth = 8;
        const wantedSize = 8;
        const originalSize = 4;
        for (let x = centerX; x >= -centerX; x -= 1) {
            const y = xCoef * (x + 1.5)**2 + freeCoef + 1;

            if (x <= parabolaStart - 0.7 && x > -25) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth -= (wantedSize - originalSize) / (centerX + 25 - 0.7);

                if (position === "Bottom") {
                    ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
                } else if (position === "Top") {
                    ctx.lineTo(canvas.width / 2 - x, canvas.height / 2 + y);
                }

                if (x % 10 === 0) {
                    ctx.stroke();
                }
            }
        }
    }

    const lastEyeLid = (ctx, canvas, position) => {
        ctx.beginPath();

        const parabolaStartInitial = canvas.width / 2 - 5;

        const parabolaEdge = -canvas.height / 2 + 2;
        const xCoefPrev = (-parabolaEdge) / (parabolaStartInitial**2);
        const freeCoefPrev = parabolaEdge - xCoefPrev*(0**2);

        const prevParabolaXedge = 15; // prev graph ended here
        const prevParabolaYEdge = -(xCoefPrev * prevParabolaXedge**2 + freeCoefPrev);

        const parabolaYEdge = (-canvas.height / 2 + 2) * 0.75;
        const parabolaXEdge = (-canvas.width / 2 + 5) * 1.2;

        const xCoef = (prevParabolaYEdge + parabolaYEdge) / (prevParabolaXedge + parabolaXEdge)**2;

        ctx.lineWidth = 4;
        const wantedSize = 1.5;
        const originalSize = 4;
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

                if (x % 15 === 0) {
                    ctx.stroke();
                }
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

        //set x from -30 to 30
        const percentCoordX = tmpCoordX / canvasCenterX;
        const eyeMovementX = percentCoordX * 35; // 30 is an edge number that eye can move to
        setHorizontalPos(eyeMovementX);

        const tmpCoordY = mouseY < canvasCenterY ? canvasCenterY - mouseY : -(mouseY - canvasCenterY);

        //set x from -20 to 20
        let percentCoordY = tmpCoordY < 0 ? tmpCoordY / (window.innerHeight - canvasCenterY) : tmpCoordY / canvasCenterY;
        percentCoordY = easeInOut(Math.abs(percentCoordY)) * Math.sign(percentCoordY);
        let eyeMovementY = lerp(verticalPos, percentCoordY * 25, 0.25);
        setVerticalPos(eyeMovementY);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const handleMouseMove = (e) => {
            handleMouseOnMove(e, canvas);
        };

        const drawEye = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const eyeImg = document.querySelector('.EyeImg');
            const eyeImgStyle = window.getComputedStyle(eyeImg);
            const width = parseFloat(eyeImgStyle.width);
            const height = parseFloat(eyeImgStyle.height);

            const ratio = window.devicePixelRatio || 1;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(ratio, ratio);

            ctx.imageSmoothingEnabled = true;

            pupilRad = canvas.width / 2 * 0.3;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;

            pupil(ctx);
            innerPupil(ctx);
            aboveEyeLid(ctx, canvas, "Top");
            aboveEyeLid(ctx, canvas, "Bottom")
            middleEyeLidContinueation(ctx, canvas, "Bottom");
            middleEyeLidContinueation(ctx, canvas, "Top");
            lastEyeLid(ctx, canvas, "Bottom");
            lastEyeLid(ctx, canvas, "Top");
        }

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