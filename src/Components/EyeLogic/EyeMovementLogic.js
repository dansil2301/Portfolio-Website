export class EyeMovementLogic {
    canvas;
    ctx;
    pupilRad;
    centerX;
    centerY;

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    EyeMove(horizontalPos, verticalPos, eyeLidPos) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;

        this.pupilRad = this.canvas.width / 2 * 0.3;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        this.pupil(horizontalPos, verticalPos);
        this.innerPupil(horizontalPos, verticalPos);

        this.aboveEyeLid(horizontalPos, verticalPos, "Top");
        this.aboveEyeLid(horizontalPos, verticalPos, "Bottom");

        this.middleEyeLidContinuation(horizontalPos, verticalPos, "Bottom");
        this.middleEyeLidContinuation(horizontalPos, verticalPos, "Top");

        this.lastEyeLidReversed(horizontalPos, verticalPos, "Bottom");
        this.lastEyeLidReversed(horizontalPos, verticalPos, "Top");
    }

    pupil(horizontalPos, verticalPos) {
        this.ctx.beginPath();

        const a = this.centerX + horizontalPos;
        const b = this.centerY - verticalPos;
        this.ctx.arc(a, b, this.pupilRad, 0, 2 * Math.PI);

        this.ctx.lineWidth = 11;
        this.ctx.stroke();
    }

    innerPupil(horizontalPos, verticalPos) {
        this.ctx.beginPath();

        const a = this.centerX + horizontalPos;
        const b = this.centerY - verticalPos;
        this.ctx.arc(a + horizontalPos * 0.3, b - verticalPos * 0.65, this.pupilRad * 0.5, 0, 2 * Math.PI);

        this.ctx.fillStyle = 'rgba(89, 89, 81, 0.5)'; // Change 'blue' to your desired color
        this.ctx.fill();
        this.ctx.strokeStyle = '#595951';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    solve2PoweredFunc(a, b, c) {
        const D = (b**2) - 4*a*c;
        return (-b + Math.sqrt(D)) / (2*a);
    }

    hasParabolaTouchedCircle(x, y, a, b) {
        if (this.pupilRad**2-40 <= ((x - a)**2 + (y - b)**2) &&
            ((x - a)**2 + (y - b)**2) <= this.pupilRad**2+40){
            return true;
        }
        return false;
    }

    aboveEyeLidParams(horizontalPos, verticalPos, position) {
        let a; let b;
        if (position === "Top"){
            a = horizontalPos;
            b = verticalPos;
        } else if (position === "Bottom") {
            a = -horizontalPos;
            b = -verticalPos;
        }

        //parabola (x;y) starting coordinate
        const parabolaStartX = this.canvas.width / 2 - this.canvas.width / 2 * 0.1 + (a * 0.3);
        const parabolaStartY = -b * 0.5;

        //constant that is responsible for eye movement on X
        const parabolaWidthCoef = (parabolaStartX - a) / (this.pupilRad**2);

        // count tan
        let tanA = Math.tan((b + parabolaStartY) / (parabolaStartX - a));

        // sin and cos calculation for parabola rotation
        let sinA = tanA / Math.sqrt(tanA**2 + 1);
        let cosA = 1 / Math.sqrt(tanA**2 + 1);
        cosA = cosA === 0 ? 0.000001 : cosA;
        sinA = sinA === 0 ? 0.000001 : sinA;

        return {a, b, parabolaStartX, parabolaStartY, parabolaWidthCoef, cosA, sinA};
    }

    aboveEyeLid(horizontalPos, verticalPos, position, countWidthStep) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';

        let { a, b, parabolaStartX, parabolaStartY, parabolaWidthCoef, cosA, sinA } = this.aboveEyeLidParams(horizontalPos, verticalPos, position);

        const wantedSize = 8;
        const originalSize = 3;
        this.ctx.lineWidth = wantedSize;

        let countSteps = 0;
        for (let x = this.centerX + 15; x >= -this.centerX; x -= 1) {
            countSteps++;
            const xsinA = (x - parabolaStartX) * sinA;
            const xcosA = (x - parabolaStartX) * cosA;

            const aForFunc = parabolaWidthCoef * (cosA**2);
            const bForFunc = parabolaWidthCoef * 2 * xsinA * cosA - sinA;
            const cForFunc = xcosA + parabolaWidthCoef * (xsinA**2);

            const y = this.solve2PoweredFunc(aForFunc, bForFunc, cForFunc) - parabolaStartY;

            if (this.hasParabolaTouchedCircle(x, y, a, b)) {break}

            if (position === "Top"){
                this.ctx.lineTo(this.canvas.width / 2 + x, this.canvas.height / 2 - y);
            } else if (position === "Bottom") {
                this.ctx.lineTo(this.canvas.width / 2 - x, this.canvas.height / 2 + y);
            }

            if (countWidthStep) {
                this.ctx.lineWidth -= (wantedSize - originalSize) / countWidthStep;
                if (parseInt(x) % 15 === 0){ this.ctx.stroke(); }
            }
        }

        // first time counts how many steps it takes to get to eye pupil. Second time draws a line with correct width
        if (!countWidthStep) { this.aboveEyeLid(horizontalPos, verticalPos, position, countSteps); }
    }

    middleEyeLidContinuation(horizontalPos, verticalPos, position) {
        this.ctx.beginPath();

        let a; let b;
        if (position === "Top"){
            a = -horizontalPos;
            b = -verticalPos;
        } else if (position === "Bottom") {
            a = horizontalPos;
            b = verticalPos;
        }

        // parabola starting point
        const parabolaStartX = this.canvas.width / 2 - this.canvas.width / 2 * 0.1 + (a * 0.3) + 2;
        const parabolaStartY = -b * 0.4;

        // current parabola params calculations
        const parabolaEdge = -this.canvas.height / 2 + parabolaStartY * 0.5;
        const xCoef = (-parabolaEdge) / (parabolaStartX**2);
        const freeCoef = parabolaEdge - xCoef*(0**2);

        const wantedSize = 8;
        const originalSize = 4;
        this.ctx.lineWidth = wantedSize;

        for (let x = this.centerX; x >= -this.centerX; x -= 1) {
            const y = xCoef * (x + 1.5)**2 + freeCoef + 5 - parabolaStartY;

            if (x <= parabolaStartX - 0.7 && x > -25) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth -= (wantedSize - originalSize) / (this.centerX + 25 - 0.7);

                if (position === "Bottom") {
                    this.ctx.lineTo(this.canvas.width / 2 + x, this.canvas.height / 2 - y);
                } else if (position === "Top") {
                    this.ctx.lineTo(this.canvas.width / 2 - x, this.canvas.height / 2 + y);
                }

                if (parseInt(x) % 15 === 0) { this.ctx.stroke(); }
            }
        }
    }

    lastEyeLidReversed(horizontalPos, verticalPos, position) {
        this.ctx.beginPath();

        let a; let b;
        if (position === "Top"){
            a = -horizontalPos;
            b = -verticalPos;
        } else if (position === "Bottom") {
            a = horizontalPos;
            b = verticalPos;
        }

        //prevParabola starting point
        const parabolaStartPrevX = this.canvas.width / 2 - this.canvas.width / 2 * 0.1 + (a * 0.3) + 2;
        const parabolaStartPrevY = -b * 0.4;

        // prevParabola params
        const parabolaEdge = -this.canvas.height / 2 + parabolaStartPrevY * 0.4;
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
        this.ctx.lineWidth = originalSize;

        for (let x = this.centerX; x >= -this.centerX; x -= 0.5) {
            const y = xCoef * (x+parabolaXEdge)**2 - parabolaYEdge;

            if (x <= -15 && x >= -parabolaStartPrevX - 2){
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth += (wantedSize - originalSize) / (this.centerX + 25 - 0.7);

                if (position === "Bottom"){
                    this.ctx.lineTo(this.canvas.width / 2 - x, this.canvas.height / 2 + y);
                } else if (position === "Top") {
                    this.ctx.lineTo(this.canvas.width / 2 + x, this.canvas.height / 2 - y);
                }

                if (parseInt(x) % 15 === 0) { this.ctx.stroke(); }
            }
        }
    }
}