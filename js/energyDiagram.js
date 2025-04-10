class EnergyDiagram {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.setupCanvas();
        this.setupControls();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'animation-controls';
        controls.innerHTML = `
            <button class="prev-btn">Previous</button>
            <button class="next-btn">Next</button>
            <button class="reset-btn">Reset</button>
        `;
        this.container.appendChild(controls);

        controls.querySelector('.prev-btn').addEventListener('click', () => this.prevStep());
        controls.querySelector('.next-btn').addEventListener('click', () => this.nextStep());
        controls.querySelector('.reset-btn').addEventListener('click', () => this.reset());
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.draw();
        }
    }

    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.draw();
        }
    }

    reset() {
        this.currentStep = 0;
        this.draw();
    }

    draw() {
        // Drawing logic for each step
    }
}

class EnergyAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.progress = 0;
        this.setupCoordinates();
    }

    setupCoordinates() {
        this.startY = 200; // Initial energy level
        this.peakY = 100;  // Activation energy peak
        this.endY = 300;   // Final energy level
        this.curvePoints = this.calculateCurvePoints();
    }

    calculateCurvePoints() {
        const points = [];
        for(let x = 0; x <= this.canvas.width; x += 10) {
            const progress = x / this.canvas.width;
            let y;
            if(progress < 0.5) {
                // Rising part - breaking bonds
                y = this.startY - Math.sin(progress * Math.PI) * (this.startY - this.peakY);
            } else {
                // Falling part - forming bonds
                y = this.peakY + Math.sin((progress - 0.5) * Math.PI) * (this.endY - this.peakY);
            }
            points.push({x, y});
        }
        return points;
    }

    draw() {
        // Fill white background first
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw energy curve
        this.ctx.beginPath();
        this.ctx.moveTo(50, this.startY);
        
        // Draw axis lines
        this.ctx.beginPath();
        this.ctx.moveTo(50, 50);
        this.ctx.lineTo(50, 350);  // Y-axis
        this.ctx.moveTo(50, 350);
        this.ctx.lineTo(550, 350); // X-axis
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();

        // Draw curve
        this.ctx.beginPath();
        this.ctx.moveTo(50, this.startY);
        for(let i = 0; i < this.curvePoints.length * this.progress; i++) {
            const point = this.curvePoints[i];
            if(i === 0) {
                this.ctx.moveTo(point.x + 50, point.y);
            } else {
                this.ctx.lineTo(point.x + 50, point.y);
            }
        }
        
        this.ctx.strokeStyle = '#7c3aed';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Add labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Energy', 45, 70);
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Reaction Progress', 300, 380);
    }

    animate() {
        if(this.progress < 1) {
            this.progress += 0.02;
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    reset() {
        this.progress = 0;
        this.draw();
    }
}
