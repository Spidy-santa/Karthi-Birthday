// Shoot the Boxes Challenge - Game Logic
class ShootTheBoxesGame {
    constructor() {
        this.score = 0;
        this.photosCollected = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.soundEnabled = true;
        this.celebrationMode = false;
        
        this.boxes = [];
        this.fallingItems = [];
        this.gameSpeed = 1;
        this.spawnRate = 2000; // milliseconds
        this.lastSpawn = 0;
        
        // Photo collection for memory gallery
        this.memoryPhotos = this.loadMemoryPhotos();
        
        // Game elements
        this.gameArea = document.getElementById('gameArea');
        this.gameCanvas = document.getElementById('gameCanvas');
        this.crosshair = document.getElementById('crosshair');
        this.shootEffect = document.getElementById('shootEffect');
        
        // UI elements
        this.scoreDisplay = document.getElementById('scoreValue');
        this.photosCountDisplay = document.getElementById('photosCount');
        this.memoryGallery = document.getElementById('memoryGallery');
        
        // Control buttons
        this.startBtn = document.getElementById('startGameBtn');
        this.pauseBtn = document.getElementById('pauseGameBtn');
        this.restartBtn = document.getElementById('restartGameBtn');
        this.soundToggleBtn = document.getElementById('soundToggleBtn');
        
        // Audio elements
        this.sounds = {
            shoot: document.getElementById('shootSound'),
            hit: document.getElementById('hitSound'),
            collect: document.getElementById('collectSound'),
            bomb: document.getElementById('bombSound'),
            celebration: document.getElementById('celebrationSound')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.renderMemoryGallery();
        
        // Load saved game state
        this.loadGameState();
    }

    setupEventListeners() {
        // Game controls
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
        
        // Mouse/touch events for shooting
        this.gameArea.addEventListener('click', (e) => this.handleShoot(e));
        this.gameArea.addEventListener('mousemove', (e) => this.updateCrosshair(e));
        
        // Touch events for mobile
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleShoot(e.touches[0]);
        });
        
        this.gameArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.updateCrosshair(e.touches[0]);
        });
        
        // Celebration mode buttons
        document.getElementById('viewGalleryBtn').addEventListener('click', () => {
            this.hideCelebrationOverlay();
            const modal = new bootstrap.Modal(document.getElementById('memoryGalleryModal'));
            modal.show();
        });
        
        document.getElementById('continuePlaying').addEventListener('click', () => {
            this.hideCelebrationOverlay();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.gameRunning && !this.gamePaused) {
                        this.handleShoot({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    }
                    break;
                case 'KeyP':
                    this.togglePause();
                    break;
                case 'KeyR':
                    this.restartGame();
                    break;
                case 'KeyM':
                    this.toggleSound();
                    break;
            }
        });
    }

    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'block';
        this.gameArea.style.cursor = 'none';
        this.crosshair.style.opacity = '1';
        
        this.gameLoop();
        this.spawnBoxes();
    }

    togglePause() {
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.gameCanvas.classList.add('game-paused');
        } else {
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.gameCanvas.classList.remove('game-paused');
        }
    }

    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.photosCollected = 0;
        this.celebrationMode = false;
        this.gameSpeed = 1;
        this.spawnRate = 2000;
        
        // Clear game elements
        this.boxes = [];
        this.fallingItems = [];
        this.gameCanvas.innerHTML = '';
        
        // Reset UI
        this.startBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
        this.gameArea.style.cursor = 'crosshair';
        this.crosshair.style.opacity = '0';
        this.gameCanvas.classList.remove('game-paused');
        
        this.updateUI();
        this.saveGameState();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        if (this.soundEnabled) {
            this.soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.soundToggleBtn.classList.remove('sound-off');
        } else {
            this.soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.soundToggleBtn.classList.add('sound-off');
        }
    }

    updateCrosshair(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const rect = this.gameArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.crosshair.style.left = x + 'px';
        this.crosshair.style.top = y + 'px';
    }

    handleShoot(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const rect = this.gameArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Show shoot effect
        this.showShootEffect(x, y);
        
        // Play shoot sound
        this.playSound('shoot');
        
        // Check for box hits
        this.checkBoxHits(x, y);
    }

    showShootEffect(x, y) {
        this.shootEffect.style.left = x + 'px';
        this.shootEffect.style.top = y + 'px';
        this.shootEffect.classList.add('active');
        
        setTimeout(() => {
            this.shootEffect.classList.remove('active');
        }, 300);
    }

    checkBoxHits(shootX, shootY) {
        for (let i = this.boxes.length - 1; i >= 0; i--) {
            const box = this.boxes[i];
            const boxRect = box.element.getBoundingClientRect();
            const gameRect = this.gameArea.getBoundingClientRect();
            
            const boxX = boxRect.left - gameRect.left + boxRect.width / 2;
            const boxY = boxRect.top - gameRect.top + boxRect.height / 2;
            
            const distance = Math.sqrt(Math.pow(shootX - boxX, 2) + Math.pow(shootY - boxY, 2));
            
            if (distance < 40) { // Hit detection radius
                this.hitBox(box, i, boxX, boxY);
                break; // Only hit one box per shot
            }
        }
    }

    hitBox(box, index, x, y) {
        // Remove box from game
        box.element.remove();
        this.boxes.splice(index, 1);
        
        // Play hit sound
        this.playSound('hit');
        
        // Generate random drop
        this.generateDrop(x, y);
        
        // Add hit effect
        this.addHitEffect(x, y);
    }

    generateDrop(x, y) {
        const dropTypes = [
            // Regular gifts
            { type: 'gift', icon: '🎁', points: 100, weight: 25, name: 'Gift Box' },
            { type: 'gift', icon: '🏓', points: 150, weight: 20, name: 'Sports Item' },
            { type: 'gift', icon: '🎉', points: 200, weight: 18, name: 'Party Item' },
            { type: 'gift', icon: '⭐', points: 300, weight: 12, name: 'Star Prize' },
            { type: 'gift', icon: '💎', points: 500, weight: 8, name: 'Diamond' },

            // Special items
            { type: 'photo', icon: '📷', points: 0, weight: 10, name: 'Memory Photo' },
            { type: 'powerup', icon: '⚡', points: 0, weight: 5, name: 'Speed Boost', effect: 'speed' },
            { type: 'powerup', icon: '🎯', points: 0, weight: 4, name: 'Multi Shot', effect: 'multishot' },
            { type: 'powerup', icon: '🛡️', points: 0, weight: 3, name: 'Shield', effect: 'shield' },

            // Negative items
            { type: 'bomb', icon: '💥', points: -50, weight: 3, name: 'Bomb' },
            { type: 'freeze', icon: '❄️', points: 0, weight: 2, name: 'Freeze', effect: 'freeze' }
        ];

        // Weighted random selection
        const totalWeight = dropTypes.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        let selectedDrop = dropTypes[0];
        for (const drop of dropTypes) {
            random -= drop.weight;
            if (random <= 0) {
                selectedDrop = drop;
                break;
            }
        }

        this.createFallingItem(x, y, selectedDrop);
    }

    createFallingItem(x, y, drop) {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = drop.icon;
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        
        this.gameCanvas.appendChild(item);
        
        // Handle different drop types
        setTimeout(() => {
            this.collectItem(drop);
            item.remove();
        }, 1000);
        
        // Show score popup
        if (drop.points !== 0) {
            this.showScorePopup(x, y, drop.points);
        }
    }

    collectItem(drop) {
        switch (drop.type) {
            case 'gift':
                this.score += drop.points;
                this.playSound('collect');
                break;
            case 'photo':
                this.addPhotoToGallery();
                this.playSound('collect');
                break;
            case 'bomb':
                this.score = Math.max(0, this.score + drop.points);
                this.playSound('bomb');
                break;
        }
        
        this.updateUI();
        this.checkCelebrationMode();
        this.saveGameState();
    }

    addPhotoToGallery() {
        this.photosCollected++;

        // Create enhanced photo data
        const photoData = {
            url: this.getRandomPhotoUrl(),
            title: this.getRandomPhotoTitle(),
            description: this.getRandomPhotoDescription(),
            collectedAt: new Date().toISOString(),
            gameScore: this.score,
            collectionMethod: 'shooting_game'
        };

        // Add to local memory photos array
        this.memoryPhotos.push(photoData.url);
        this.renderMemoryGallery();

        // Dispatch event for gallery system
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('photoCollected', {
                detail: photoData
            }));
        }

        // Show collection feedback
        this.showPhotoCollectionFeedback(photoData);
    }

    getRandomPhotoUrl() {
        // Karthi's actual photos - add more photos to this array
        const karthiPhotos = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face'
        ];

        return karthiPhotos[Math.floor(Math.random() * karthiPhotos.length)];
    }

    getRandomPhotoTitle() {
        const titles = [
            "Karthi's Bright Smile",
            "A Moment of Joy",
            "Captured Happiness",
            "Birthday Memories",
            "Special Moment",
            "Precious Memory",
            "Karthi's Adventure",
            "Celebration Time",
            "Happy Days",
            "Unforgettable Moment"
        ];

        return titles[Math.floor(Math.random() * titles.length)];
    }

    getRandomPhotoDescription() {
        const descriptions = [
            "A beautiful moment captured during the birthday celebration",
            "This photo holds a special place in our hearts",
            "A memory that will be cherished forever",
            "Karthi looking absolutely radiant in this shot",
            "One of those perfect moments that define happiness",
            "A snapshot of pure joy and celebration",
            "This image captures Karthi's wonderful personality",
            "A precious memory from a day filled with love",
            "The smile that lights up every room",
            "A moment of pure happiness and celebration"
        ];

        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    showPhotoCollectionFeedback(photoData) {
        // Create a special photo collection effect in the game
        const feedback = document.createElement('div');
        feedback.className = 'photo-collection-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-camera"></i>
                <span>📷 Memory Captured!</span>
                <small>${photoData.title}</small>
            </div>
        `;

        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            text-align: center;
            font-weight: 600;
            animation: photoFeedback 2s ease-out forwards;
            pointer-events: none;
        `;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes photoFeedback {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                80% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(feedback);

        // Remove feedback after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 2000);
    }

    showScorePopup(x, y, points) {
        const popup = document.createElement('div');
        popup.className = `score-popup ${points > 0 ? 'positive' : 'negative'}`;
        popup.textContent = points > 0 ? `+${points}` : points;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        this.gameCanvas.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    addHitEffect(x, y) {
        // Create explosion effect
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#ff4757';
            particle.style.borderRadius = '50%';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.pointerEvents = 'none';
            
            const angle = (i / 6) * Math.PI * 2;
            const velocity = 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            this.gameCanvas.appendChild(particle);
            
            gsap.to(particle, {
                x: vx,
                y: vy,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    }

    checkCelebrationMode() {
        if (this.score >= 1000 && !this.celebrationMode) {
            this.celebrationMode = true;
            this.activateCelebrationMode();
        }
    }

    activateCelebrationMode() {
        this.playSound('celebration');

        // Trigger the enhanced Party Explosion system
        if (window.PartyExplosion) {
            window.PartyExplosion.trigger({
                type: 'game_completion',
                title: '🎯 GAME MASTER! 🎯',
                message: `Amazing! You scored ${this.score} points and unlocked celebration mode!`,
                score: this.score,
                photosCollected: this.photosCollected
            });
        } else {
            // Fallback to original celebration
            this.showCelebrationOverlay();
            this.createConfetti();
        }

        // Animate all photos to gallery
        if (typeof gsap !== 'undefined') {
            gsap.from('.memory-photo', {
                scale: 0,
                rotation: 360,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });
        }
    }

    showCelebrationOverlay() {
        const overlay = document.getElementById('celebrationOverlay');
        overlay.style.display = 'flex';
        
        gsap.from('.celebration-content', {
            scale: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }

    hideCelebrationOverlay() {
        const overlay = document.getElementById('celebrationOverlay');
        overlay.style.display = 'none';
    }

    createConfetti() {
        const container = document.querySelector('.confetti-container');
        const colors = ['#ff4757', '#2ecc71', '#3742fa', '#ffa502', '#ff6b81'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 6000);
        }
    }

    spawnBoxes() {
        if (!this.gameRunning) return;
        
        const now = Date.now();
        if (now - this.lastSpawn > this.spawnRate) {
            this.createBox();
            this.lastSpawn = now;
            
            // Increase difficulty over time
            if (this.spawnRate > 800) {
                this.spawnRate -= 10;
            }
        }
        
        setTimeout(() => this.spawnBoxes(), 100);
    }

    createBox() {
        const box = document.createElement('div');
        box.className = 'game-box';
        
        // 15% chance for photo box
        const isPhotoBox = Math.random() < 0.15;
        if (isPhotoBox) {
            box.classList.add('photo-box');
        }
        
        // Random spawn position
        const startX = Math.random() * (window.innerWidth - 60);
        const startY = -60;
        
        box.style.left = startX + 'px';
        box.style.top = startY + 'px';
        
        this.gameCanvas.appendChild(box);
        
        // Animate box movement
        const endY = window.innerHeight + 60;
        const duration = 4000 / this.gameSpeed;
        
        gsap.to(box, {
            y: endY,
            duration: duration / 1000,
            ease: "none",
            onComplete: () => {
                box.remove();
                // Remove from boxes array
                const index = this.boxes.findIndex(b => b.element === box);
                if (index > -1) {
                    this.boxes.splice(index, 1);
                }
            }
        });
        
        this.boxes.push({ element: box, isPhoto: isPhotoBox });
    }

    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.gamePaused) {
            // Update game logic here if needed
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updateUI() {
        this.scoreDisplay.textContent = this.score;
        this.photosCountDisplay.textContent = this.photosCollected;
    }

    renderMemoryGallery() {
        this.memoryGallery.innerHTML = '';
        
        if (this.memoryPhotos.length === 0) {
            this.memoryGallery.innerHTML = '<p class="text-center text-muted">Shoot photo boxes to collect memories!</p>';
            return;
        }
        
        this.memoryPhotos.forEach((photoUrl, index) => {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.alt = `Memory ${index + 1}`;
            img.className = 'memory-photo';
            img.addEventListener('click', () => this.viewPhotoFullscreen(photoUrl));
            this.memoryGallery.appendChild(img);
        });
    }

    viewPhotoFullscreen(photoUrl) {
        // Create fullscreen photo viewer
        const viewer = document.createElement('div');
        viewer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.objectFit = 'contain';
        
        viewer.appendChild(img);
        document.body.appendChild(viewer);
        
        viewer.addEventListener('click', () => {
            viewer.remove();
        });
    }

    playSound(soundName) {
        if (!this.soundEnabled || !this.sounds[soundName]) return;

        try {
            // Create synthetic sound if audio files are not available
            if (this.sounds[soundName].error || this.sounds[soundName].networkState === 3) {
                this.createSyntheticSound(soundName);
                return;
            }

            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                console.log('Audio play failed, using synthetic sound:', e);
                this.createSyntheticSound(soundName);
            });
        } catch (error) {
            console.log('Audio error, using synthetic sound:', error);
            this.createSyntheticSound(soundName);
        }
    }

    createSyntheticSound(soundName) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different sounds for different actions
            switch (soundName) {
                case 'shoot':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'collect':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'bomb':
                    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.4);
                    break;
                case 'celebration':
                    // Play a happy tune
                    const frequencies = [523, 659, 784, 1047]; // C, E, G, C
                    frequencies.forEach((freq, index) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.2);
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.2);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.3);
                        osc.start(audioContext.currentTime + index * 0.2);
                        osc.stop(audioContext.currentTime + index * 0.2 + 0.3);
                    });
                    break;
            }
        } catch (error) {
            console.log('Synthetic sound creation failed:', error);
        }
    }

    saveGameState() {
        const gameState = {
            score: this.score,
            photosCollected: this.photosCollected,
            memoryPhotos: this.memoryPhotos,
            soundEnabled: this.soundEnabled
        };
        
        localStorage.setItem('shootBoxesGame', JSON.stringify(gameState));
    }

    loadGameState() {
        try {
            const saved = localStorage.getItem('shootBoxesGame');
            if (saved) {
                const gameState = JSON.parse(saved);
                this.score = gameState.score || 0;
                this.photosCollected = gameState.photosCollected || 0;
                this.memoryPhotos = gameState.memoryPhotos || [];
                this.soundEnabled = gameState.soundEnabled !== false;
                
                this.updateUI();
                this.renderMemoryGallery();
                
                if (!this.soundEnabled) {
                    this.toggleSound();
                }
            }
        } catch (error) {
            console.log('Failed to load game state:', error);
        }
    }

    loadMemoryPhotos() {
        // Load existing photos from localStorage
        try {
            const saved = localStorage.getItem('shootBoxesGame');
            if (saved) {
                const gameState = JSON.parse(saved);
                return gameState.memoryPhotos || [];
            }
        } catch (error) {
            console.log('Failed to load memory photos:', error);
        }
        return [];
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ShootTheBoxesGame();
});

// Export for potential external use
window.ShootTheBoxesGame = ShootTheBoxesGame;
