class ReactantsProductsAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.arrowProgress = 0;
        this.animationFrame = null;
        this.draw(); // Initial draw
    }

    drawBox(x, y, width, height, text1, text2) {
        this.ctx.fillStyle = '#e0e7ff';
        this.ctx.strokeStyle = '#a5b4fc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, width, height, 8);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text1, x + width / 2, y + height / 2 - 5);
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.fillText(text2, x + width / 2, y + height / 2 + 15);
    }

    drawArrow() {
        const startX = 150;
        const endX = 250;
        const y = 75;
        const currentEndX = startX + (endX - startX) * this.arrowProgress;

        this.ctx.beginPath();
        this.ctx.moveTo(startX, y);
        this.ctx.lineTo(currentEndX, y);
        this.ctx.strokeStyle = '#7c3aed'; // var(--primary-accent)
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw arrowhead if arrow is mostly drawn
        if (this.arrowProgress > 0.9) {
            const arrowSize = 10;
            this.ctx.fillStyle = '#7c3aed';
            this.ctx.beginPath();
            this.ctx.moveTo(currentEndX, y);
            this.ctx.lineTo(currentEndX - arrowSize, y - arrowSize / 2);
            this.ctx.lineTo(currentEndX - arrowSize, y + arrowSize / 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // White background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBox(20, 40, 120, 70, 'Reactants', '(CH₄ + 2O₂)');
        this.drawArrow();
        if (this.arrowProgress >= 1) {
            this.drawBox(260, 40, 120, 70, 'Products', '(CO₂ + 2H₂O)');
        }
    }

    animate() {
        if (this.arrowProgress < 1) {
            this.arrowProgress += 0.02;
            this.draw();
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            this.arrowProgress = 1; // Ensure it stops exactly at 1
            this.draw(); // Final draw
        }
    }

    resetAndPlay() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.arrowProgress = 0;
        this.animate();
    }
}
