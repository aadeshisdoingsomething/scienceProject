class Atom {
    constructor(x, y, color, radius = 10) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.color = color;
        this.radius = radius;
    }

    update() {
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ReactionAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.atoms = [];
        this.animationFrame = null;
        this.state = 'initial'; // Track animation state
        this.isPaused = false;
        this.setupAtoms();
        this.setupKey();
        this.createKeyElement();
    }

    setupKey() {
        this.atomKey = [
            { symbol: 'C', name: 'Carbon', color: '#333333' },
            { symbol: 'H', name: 'Hydrogen', color: '#666666' },
            { symbol: 'O', name: 'Oxygen', color: '#ff0000' }
        ];
    }

    createKeyElement() {
        // Remove any existing atom key first
        const existingKey = this.canvas.parentElement.querySelector('.atom-key');
        if (existingKey) {
            existingKey.remove();
        }

        const container = this.canvas.parentElement;
        const keyDiv = document.createElement('div');
        keyDiv.className = 'atom-key';
        
        let keyHTML = '<div class="atom-key-title">Atom Key:</div>';
        this.atomKey.forEach(atom => {
            keyHTML += `
                <div class="atom-key-item">
                    <span style="
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: ${atom.color};
                        border-radius: 50%;">
                    </span>
                    <span>${atom.symbol} - ${atom.name}</span>
                </div>`;
        });
        
        keyDiv.innerHTML = keyHTML;
        container.appendChild(keyDiv);
    }

    drawStateLabel() {
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#666'; // Changed from #333 for better contrast
        this.ctx.textAlign = 'center';
        const labelY = this.canvas.height - 30;
        
        if (this.state === 'initial') {
            this.ctx.fillText('CH₄ + 2O₂ (Initial State)', this.canvas.width / 2, labelY);
        } else {
            this.ctx.fillText('CO₂ + 2H₂O (Final State)', this.canvas.width / 2, labelY);
        }
    }

    drawMoleculeLabels() {
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#333'; // Changed from #000 for better contrast
        this.ctx.textAlign = 'center';

        if (this.state === 'initial') {
            // Label CH4
            this.ctx.fillText('CH₄', 200, 100);
            // Label O2 molecules
            this.ctx.fillText('O₂', 350, 100);
            this.ctx.fillText('O₂', 400, 100);
        } else {
            // Label CO2
            this.ctx.fillText('CO₂', 300, 100);
            // Label H2O molecules
            this.ctx.fillText('H₂O', 410, 100);
            this.ctx.fillText('H₂O', 490, 100);
        }
    }

    setupAtoms() {
        // CH4 atoms (center carbon with 4 hydrogens)
        this.atoms = [
            new Atom(200, 150, '#333'), // Carbon
            new Atom(180, 130, '#666'), // Hydrogens
            new Atom(220, 130, '#666'),
            new Atom(180, 170, '#666'),
            new Atom(220, 170, '#666'),
            // O2 molecules
            new Atom(350, 130, '#f00'), // Oxygen
            new Atom(350, 170, '#f00'),
            new Atom(400, 130, '#f00'),
            new Atom(400, 170, '#f00')
        ];
    }

    animate() {
        if (this.isPaused) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawStateLabel();
        this.drawMoleculeLabels();
        
        // Draw atoms
        this.atoms.forEach(atom => {
            atom.update();
            atom.draw(this.ctx);
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.animate();
        }
    }

    startReaction() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.state = 'initial';
        this.setupAtoms();
        
        // Start transition after 2 seconds
        setTimeout(() => {
            this.state = 'final';
            // Move to CO2 formation
            this.atoms[0].targetX = 300;
            this.atoms[5].targetX = 270;
            this.atoms[6].targetX = 330;
            
            // Move to H2O formation
            this.atoms[1].targetX = 400;
            this.atoms[2].targetX = 420;
            this.atoms[7].targetX = 410;
            
            this.atoms[3].targetX = 480;
            this.atoms[4].targetX = 500;
            this.atoms[8].targetX = 490;
        }, 2000);

        this.isPaused = false;
        this.animate();
    }
}

// Initialize animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const animation = new ReactionAnimation('reactionCanvas');
    
    document.getElementById('replayButton').addEventListener('click', () => {
        animation.startReaction();
    });
    
    // Start initial animation
    animation.startReaction();
});
