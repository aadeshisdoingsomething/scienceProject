class PropertyComparison {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isPaused = true;
        this.setupCanvas();
        this.setupControls();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 300;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'animation-controls';
        controls.innerHTML = `
            <button class="play-btn">Play</button>
            <button class="reset-btn">Reset</button>
        `;
        this.container.appendChild(controls);

        const playBtn = controls.querySelector('.play-btn');
        playBtn.addEventListener('click', () => this.togglePlay());
        
        const resetBtn = controls.querySelector('.reset-btn');
        resetBtn.addEventListener('click', () => this.reset());
    }

    togglePlay() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) this.animate();
    }

    reset() {
        // Reset animation state
    }

    animate() {
        if (this.isPaused) return;
        // Animation logic here
        requestAnimationFrame(() => this.animate());
    }
}

class PropertyAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.state = 'initial';
        this.progress = 0;
        this.setupMolecules();
        this.setupControls();
    }

    setupMolecules() {
        this.reactants = [
            { x: 150, y: 150, label: 'CH₄', color: '#333', properties: ['Gas', 'Flammable'] },
            { x: 350, y: 150, label: '2O₂', color: '#f00', properties: ['Gas', 'Supports burning'] }
        ];
        
        this.products = [
            { x: 150, y: 150, label: 'CO₂', color: '#666', properties: ['Gas', 'Non-flammable'] },
            { x: 350, y: 150, label: '2H₂O', color: '#00f', properties: ['Liquid', 'Non-flammable'] }
        ];
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'animation-controls';
        controls.innerHTML = `
            <button class="toggle-btn">Compare Properties</button>
        `;
        this.canvas.parentElement.appendChild(controls);

        controls.querySelector('.toggle-btn').addEventListener('click', () => {
            this.toggleState();
        });
    }

    draw() {
        // Fill white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const molecules = this.state === 'initial' ? this.reactants : this.products;
        
        // Draw section divider
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width/2, 50);
        this.ctx.lineTo(this.canvas.width/2, 250);
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.stroke();

        // Draw molecules
        molecules.forEach(mol => {
            // Draw molecule circle
            this.ctx.beginPath();
            this.ctx.arc(mol.x, mol.y, 40, 0, Math.PI * 2);
            this.ctx.fillStyle = mol.color;
            this.ctx.fill();
            
            // Draw molecule label
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(mol.label, mol.x, mol.y + 8);

            // Draw properties
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#333';
            mol.properties.forEach((prop, i) => {
                this.ctx.fillText(prop, mol.x, mol.y + 80 + i * 25);
            });
        });

        // Draw state label
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            this.state === 'initial' ? 'Reactants' : 'Products',
            this.canvas.width/2,
            40
        );
    }

    toggleState() {
        this.state = this.state === 'initial' ? 'final' : 'initial';
        this.draw();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const propertyAnim = new PropertyAnimation('propertyCanvas');
    propertyAnim.draw();
});
