class MechanismAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.atoms = [];
        this.bonds = [];
        this.state = 'initial'; // initial, breaking, rearranging, forming, final
        this.progress = 0; // Controls animation stages
        this.animationFrame = null;
        this.isPaused = true;

        this.colors = { C: '#333333', H: '#666666', O: '#ff0000' };
        this.radii = { C: 16, H: 10, O: 14 };

        this.setupInitialState();
        this.draw(); // Initial draw
    }

    setupInitialState() {
        this.atoms = [
            // CH₄
            { id: 'C', x: 100, y: 100, tx: 450, ty: 100, r: this.radii.C, color: this.colors.C },
            { id: 'H1', x: 80, y: 80, tx: 530, ty: 55, r: this.radii.H, color: this.colors.H },
            { id: 'H2', x: 120, y: 80, tx: 570, ty: 55, r: this.radii.H, color: this.colors.H },
            { id: 'H3', x: 80, y: 120, tx: 530, ty: 145, r: this.radii.H, color: this.colors.H },
            { id: 'H4', x: 120, y: 120, tx: 570, ty: 145, r: this.radii.H, color: this.colors.H },
            // 2O₂
            { id: 'O1', x: 230, y: 80, tx: 410, ty: 100, r: this.radii.O, color: this.colors.O },
            { id: 'O2', x: 270, y: 80, tx: 550, ty: 70, r: this.radii.O, color: this.colors.O },
            { id: 'O3', x: 230, y: 120, tx: 490, ty: 100, r: this.radii.O, color: this.colors.O },
            { id: 'O4', x: 270, y: 120, tx: 550, ty: 130, r: this.radii.O, color: this.colors.O }
        ];
        this.atoms.forEach(a => { a.startX = a.x; a.startY = a.y; });

        this.updateBonds();
    }

    getAtomById(id) {
        return this.atoms.find(a => a.id === id);
    }

    updateBonds() {
        // Define bonds based on the current state
        this.bonds = [];
        if (this.state === 'initial' || this.state === 'breaking') {
            // CH₄ bonds
            this.bonds.push({ a1: 'C', a2: 'H1' });
            this.bonds.push({ a1: 'C', a2: 'H2' });
            this.bonds.push({ a1: 'C', a2: 'H3' });
            this.bonds.push({ a1: 'C', a2: 'H4' });
            // O₂ bonds
            this.bonds.push({ a1: 'O1', a2: 'O2' });
            this.bonds.push({ a1: 'O3', a2: 'O4' });
        } else if (this.state === 'forming' || this.state === 'final') {
            // CO₂ bonds
            this.bonds.push({ a1: 'C', a2: 'O1' });
            this.bonds.push({ a1: 'C', a2: 'O3' });
            // H₂O bonds
            this.bonds.push({ a1: 'O2', a2: 'H1' });
            this.bonds.push({ a1: 'O2', a2: 'H2' });
            this.bonds.push({ a1: 'O4', a2: 'H3' });
            this.bonds.push({ a1: 'O4', a2: 'H4' });
        }
        // No bonds drawn during 'rearranging'
    }

    updateState() {
        // Adjust progress thresholds for slower, more distinct phases
        if (this.progress < 0.20) this.state = 'initial';      // Initial state longer
        else if (this.progress < 0.40) this.state = 'breaking'; // Breaking bonds phase
        else if (this.progress < 0.70) this.state = 'rearranging';// Atom movement phase
        else if (this.progress < 0.90) this.state = 'forming';  // Forming bonds phase
        else this.state = 'final';                             // Final state

        this.updateBonds();
    }

    updateAtoms() {
        if (this.state === 'rearranging' || this.state === 'forming') {
             this.atoms.forEach(atom => {
                // Adjust moveProgress mapping to the new state durations (0.40 to 0.90)
                const moveProgress = Math.max(0, Math.min(1, (this.progress - 0.40) / 0.50));
                atom.x = atom.startX + (atom.tx - atom.startX) * moveProgress;
                atom.y = atom.startY + (atom.ty - atom.startY) * moveProgress;
            });
        } else if (this.state === 'initial' || this.state === 'breaking') {
             this.atoms.forEach(atom => { // Ensure atoms are at start
                atom.x = atom.startX;
                atom.y = atom.startY;
             });
        } else if (this.state === 'final') {
             this.atoms.forEach(atom => { // Ensure atoms are at end
                atom.x = atom.tx;
                atom.y = atom.ty;
             });
        }
    }

    drawBonds() {
        this.ctx.setLineDash([]); // Reset dash

        // Draw initial bonds faintly if breaking/rearranging
        if (this.state === 'breaking' || this.state === 'rearranging') {
            this.ctx.strokeStyle = '#dddddd'; // Very light gray
            this.ctx.lineWidth = 2;
            this.drawSpecificBonds(['C-H1', 'C-H2', 'C-H3', 'C-H4', 'O1-O2', 'O3-O4']);
        }

        // Draw final bonds faintly if forming/rearranging
        if (this.state === 'forming' || this.state === 'rearranging') {
             this.ctx.strokeStyle = '#dddddd'; // Very light gray
             this.ctx.lineWidth = 2;
             this.drawSpecificBonds(['C-O1', 'C-O3', 'O2-H1', 'O2-H2', 'O4-H3', 'O4-H4']);
        }

        // Draw active bonds based on state
        this.ctx.strokeStyle = '#aaaaaa'; // Regular bond color
        this.ctx.lineWidth = 3;

        let dash = [];
        if (this.state === 'breaking') {
            // Adjust breakProgress mapping (0.20 to 0.40)
            const breakProgress = (this.progress - 0.20) / 0.20;
            dash = [10 - breakProgress * 8, 2 + breakProgress * 8];
            this.ctx.setLineDash(dash);
            this.drawSpecificBonds(['C-H1', 'C-H2', 'C-H3', 'C-H4', 'O1-O2', 'O3-O4']); // Draw breaking bonds
        } else if (this.state === 'forming') {
             // Adjust formProgress mapping (0.70 to 0.90)
             const formProgress = (this.progress - 0.70) / 0.20;
             dash = [2 + formProgress * 8, 10 - formProgress * 8];
             this.ctx.setLineDash(dash);
             this.drawSpecificBonds(['C-O1', 'C-O3', 'O2-H1', 'O2-H2', 'O4-H3', 'O4-H4']); // Draw forming bonds
        } else if (this.state === 'initial') {
             this.drawSpecificBonds(['C-H1', 'C-H2', 'C-H3', 'C-H4', 'O1-O2', 'O3-O4']); // Draw initial solid
        } else if (this.state === 'final') {
             this.drawSpecificBonds(['C-O1', 'C-O3', 'O2-H1', 'O2-H2', 'O4-H3', 'O4-H4']); // Draw final solid
        }

        this.ctx.setLineDash([]); // Reset line dash
    }

    // Helper to draw specific bonds by atom IDs
    drawSpecificBonds(bondKeys) {
         const bondMap = {
            'C-H1': { a1: 'C', a2: 'H1' }, 'C-H2': { a1: 'C', a2: 'H2' },
            'C-H3': { a1: 'C', a2: 'H3' }, 'C-H4': { a1: 'C', a2: 'H4' },
            'O1-O2': { a1: 'O1', a2: 'O2' }, 'O3-O4': { a1: 'O3', a2: 'O4' },
            'C-O1': { a1: 'C', a2: 'O1' }, 'C-O3': { a1: 'C', a2: 'O3' },
            'O2-H1': { a1: 'O2', a2: 'H1' }, 'O2-H2': { a1: 'O2', a2: 'H2' },
            'O4-H3': { a1: 'O4', a2: 'H3' }, 'O4-H4': { a1: 'O4', a2: 'H4' }
         };

         bondKeys.forEach(key => {
            const bond = bondMap[key];
            if (bond) {
                const atom1 = this.getAtomById(bond.a1);
                const atom2 = this.getAtomById(bond.a2);
                if (atom1 && atom2) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(atom1.x, atom1.y);
                    this.ctx.lineTo(atom2.x, atom2.y);
                    this.ctx.stroke();
                }
            }
         });
    }

     drawStateLabel() {
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        const labelY = 30;
        let label = '';
        switch(this.state) {
            case 'initial': label = '1. Starting Materials (Reactants)'; break;
            case 'breaking': label = '2. Breaking Bonds...'; break;
            case 'rearranging': label = '3. Atoms Rearranging...'; break;
            case 'forming': label = '4. Forming New Bonds...'; break;
            case 'final': label = '5. Final Products'; break;
        }
        this.ctx.fillText(label, this.canvas.width / 2, labelY);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff'; // White background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawStateLabel();
        this.drawBonds(); // Draw bonds first

        // Draw atoms on top
        this.atoms.forEach(atom => {
            this.ctx.beginPath();
            this.ctx.arc(atom.x, atom.y, atom.r, 0, Math.PI * 2);
            this.ctx.fillStyle = atom.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#333'; // Outline atoms
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    animate() {
        if (this.isPaused) return;

        this.progress += 0.002; // Significantly reduced increment for slower animation

        if (this.progress > 1) {
            this.progress = 1;
            this.isPaused = true;
            // Find the button and update its text to 'Play Steps' when done
            const btn = document.getElementById('mechPlayPauseButton');
            if (btn) btn.textContent = 'Play Steps';
        }

        this.updateState();
        this.updateAtoms();
        this.draw();

        if (!this.isPaused) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }

    play() {
        if (this.progress >= 1) { // If already finished, reset first
            this.reset();
        }
        this.isPaused = false;
        this.animate();
    }

    pause() {
        this.isPaused = true;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    togglePlayPause() {
        if (this.isPaused) {
            this.play();
        } else {
            this.pause();
        }
        return this.isPaused;
    }

    reset() {
        this.pause();
        this.progress = 0;
        this.updateState();
        this.atoms.forEach(a => { // Reset positions explicitly
            a.x = a.startX;
            a.y = a.startY;
        });
        this.draw();
        // Reset button text
        const btn = document.getElementById('mechPlayPauseButton');
        if (btn) btn.textContent = 'Play Steps';
    }
}
