class ConservationComparison { // Renamed class
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
         if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.atomsReactants = [];
        this.atomsProducts = [];

        this.colors = { C: '#333333', H: '#666666', O: '#ff0000' };
        this.radii = { C: 16, H: 10, O: 14 };

        this.setupAtomGroups();
        this.draw(); // Initial draw (static)
    }

    setupAtomGroups() {
        // CH₄ group - moved more to left and down
        this.atomsReactants = [
            // CH₄ - Centered around x=180, y=160
            { x: 180, y: 160, r: this.radii.C, color: this.colors.C },
            { x: 160, y: 140, r: this.radii.H, color: this.colors.H },
            { x: 200, y: 140, r: this.radii.H, color: this.colors.H },
            { x: 160, y: 180, r: this.radii.H, color: this.colors.H },
            { x: 200, y: 180, r: this.radii.H, color: this.colors.H },
            // O₂ molecules - moved right and down
            { x: 300, y: 140, r: this.radii.O, color: this.colors.O },
            { x: 340, y: 140, r: this.radii.O, color: this.colors.O },
            { x: 300, y: 180, r: this.radii.O, color: this.colors.O },
            { x: 340, y: 180, r: this.radii.O, color: this.colors.O }
        ];

        // Products - moved more apart
        this.atomsProducts = [
            // CO₂ - Centered around x=500
            { x: 500, y: 160, r: this.radii.C, color: this.colors.C },
            { x: 460, y: 160, r: this.radii.O, color: this.colors.O },
            { x: 540, y: 160, r: this.radii.O, color: this.colors.O },
            // H₂O 1 - moved up
            { x: 650, y: 120, r: this.radii.O, color: this.colors.O },
            { x: 630, y: 100, r: this.radii.H, color: this.colors.H },
            { x: 670, y: 100, r: this.radii.H, color: this.colors.H },
            // H₂O 2 - moved down
            { x: 650, y: 200, r: this.radii.O, color: this.colors.O },
            { x: 630, y: 220, r: this.radii.H, color: this.colors.H },
            { x: 670, y: 220, r: this.radii.H, color: this.colors.H }
        ];
    }

    drawAtomGroup(atoms) {
         atoms.forEach(atom => {
            this.ctx.beginPath();
            this.ctx.arc(atom.x, atom.y, atom.r, 0, Math.PI * 2);
            this.ctx.fillStyle = atom.color;
            this.ctx.fill();
        });
    }

    drawKey() {
        const keyY = this.canvas.height - 25;
        const startX = 200; // Adjusted start X for key on wider canvas
        const spacing = 150; // Adjusted spacing for key
        let currentX = startX;

        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#333';

        // Carbon Key
        this.ctx.beginPath();
        this.ctx.arc(currentX, keyY, this.radii.C, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.C;
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Carbon (C)', currentX + this.radii.C + 5, keyY + 4);
        currentX += spacing;

        // Hydrogen Key
        this.ctx.beginPath();
        this.ctx.arc(currentX, keyY, this.radii.H, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.H;
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Hydrogen (H)', currentX + this.radii.H + 5, keyY + 4);
        currentX += spacing;

        // Oxygen Key
        this.ctx.beginPath();
        this.ctx.arc(currentX, keyY, this.radii.O, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.O;
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('Oxygen (O)', currentX + this.radii.O + 5, keyY + 4);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Reactants Side
        this.drawAtomGroup(this.atomsReactants);
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Reactants', 230, 30); // Adjusted X position
        this.ctx.font = '14px Inter, sans-serif';
        this.ctx.fillText('Count: 1 C, 4 H, 4 O', 230, 50); // Adjusted X position


        // Draw Arrow
        const arrowY = 100;
        const startArrowX = 380; // Adjusted arrow position
        const endArrowX = 440;   // Adjusted arrow position
        const arrowSize = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(startArrowX, arrowY);
        this.ctx.lineTo(endArrowX, arrowY);
        this.ctx.strokeStyle = '#7c3aed';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.fillStyle = '#7c3aed';
        this.ctx.beginPath();
        this.ctx.moveTo(endArrowX, arrowY);
        this.ctx.lineTo(endArrowX - arrowSize, arrowY - arrowSize / 2);
        this.ctx.lineTo(endArrowX - arrowSize, arrowY + arrowSize / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw Products Side
        this.drawAtomGroup(this.atomsProducts);
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Products', 580, 30); // Adjusted X position
         this.ctx.font = '14px Inter, sans-serif';
        this.ctx.fillText('Count: 1 C, 4 H, 4 O', 580, 50); // Adjusted X position

        this.drawKey();
    }

    drawStateLabel() {
        // Move labels up
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.textAlign = 'center';
        const labelY = 80; // Moved up from bottom

        // Draw labels higher up
        if (this.state === 'initial') {
            this.ctx.fillText('Reactants', 240, labelY);
        } else {
            this.ctx.fillText('Products', 575, labelY);
        }
    }

    // Remove animate, play, pause, toggle, reset methods as it's static now
}
