// Party Explosion - Ultimate Celebration System
class PartyExplosion {
    constructor() {
        this.isActive = false;
        this.celebrationDuration = 15000; // 15 seconds
        this.musicEnabled = true;
        this.currentCelebration = null;
        
        // Animation elements
        this.balloons = [];
        this.floatingEmojis = [];
        this.candies = [];
        
        // Audio context for celebration sounds
        this.audioContext = null;
        this.celebrationMusic = null;
        
        this.init();
    }

    init() {
        this.loadCanvasConfetti();
        this.createCelebrationContainer();
        this.setupEventListeners();
        this.initializeAudio();
    }

    loadCanvasConfetti() {
        // Load canvas-confetti library if not already loaded
        if (typeof confetti === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
            script.onload = () => {
                console.log('Canvas confetti loaded successfully');
            };
            document.head.appendChild(script);
        }
    }

    createCelebrationContainer() {
        // Create main celebration container if it doesn't exist
        if (!document.getElementById('partyExplosionContainer')) {
            const container = document.createElement('div');
            container.id = 'partyExplosionContainer';
            container.className = 'party-explosion-container';
            container.innerHTML = `
                <div class="celebration-background"></div>
                <div class="floating-elements-container"></div>
                <div class="pony-car-container"></div>
                <div class="celebration-overlay-content">
                    <div class="celebration-message">
                        <h1 class="party-title">🎉 PARTY TIME! 🎉</h1>
                        <p class="party-subtitle">Let's celebrate Karthi's special day!</p>
                        <div class="celebration-controls">
                            <button class="btn-party-control" id="replayCelebration">
                                <i class="fas fa-redo"></i> Replay Party
                            </button>
                            <button class="btn-party-control" id="toggleCelebrationMusic">
                                <i class="fas fa-volume-up"></i> Music
                            </button>
                            <button class="btn-party-control" id="closeCelebration">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
        }
    }

    setupEventListeners() {
        // Celebration control buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'replayCelebration' || e.target.closest('#replayCelebration')) {
                this.replayCelebration();
            }
            if (e.target.id === 'toggleCelebrationMusic' || e.target.closest('#toggleCelebrationMusic')) {
                this.toggleMusic();
            }
            if (e.target.id === 'closeCelebration' || e.target.closest('#closeCelebration')) {
                this.endCelebration();
            }
        });

        // Global celebration triggers
        window.addEventListener('celebrationTrigger', (e) => {
            this.activateCelebrationMode(e.detail);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.activateCelebrationMode({ type: 'manual', message: 'Manual Party Mode!' });
            }
        });
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio context not available:', error);
        }
    }

    activateCelebrationMode(options = {}) {
        if (this.isActive) {
            this.endCelebration();
        }

        this.isActive = true;
        this.currentCelebration = options;

        // Update celebration message if provided
        this.updateCelebrationMessage(options);

        // Show celebration container
        const container = document.getElementById('partyExplosionContainer');
        if (container) {
            container.style.display = 'flex';
            container.classList.add('active');
        }

        // Add celebration class to body
        document.body.classList.add('celebration-active');

        // Start the party sequence
        this.startPartySequence();

        // Auto-end celebration after duration
        setTimeout(() => {
            if (this.isActive) {
                this.endCelebration();
            }
        }, this.celebrationDuration);
    }

    updateCelebrationMessage(options) {
        const titleElement = document.querySelector('.party-title');
        const subtitleElement = document.querySelector('.party-subtitle');

        if (titleElement && options.title) {
            titleElement.textContent = options.title;
        }

        if (subtitleElement && options.message) {
            subtitleElement.textContent = options.message;
        }
    }

    startPartySequence() {
        // 1. Immediate confetti blast
        this.triggerConfettiBurst();

        // 2. Background color shift
        this.animateBackgroundColors();

        // 3. Start floating balloons (delayed)
        setTimeout(() => this.startFloatingBalloons(), 500);

        // 4. Start floating emojis (delayed)
        setTimeout(() => this.startFloatingEmojis(), 1000);

        // 5. Animate pony car (delayed)
        setTimeout(() => this.animatePonyCar(), 2000);

        // 6. Memory photos glow effect (if photos exist)
        setTimeout(() => this.animateMemoryPhotos(), 3000);

        // 7. Falling candies (delayed)
        setTimeout(() => this.startFallingCandies(), 4000);

        // 8. Play celebration music
        if (this.musicEnabled) {
            setTimeout(() => this.playCelebrationMusic(), 500);
        }

        // 9. Additional confetti bursts
        setTimeout(() => this.triggerConfettiBurst(), 5000);
        setTimeout(() => this.triggerConfettiBurst(), 10000);
    }

    triggerConfettiBurst() {
        if (typeof confetti !== 'undefined') {
            // Multiple confetti bursts with different configurations
            
            // Main burst from center
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Side bursts
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
            }, 200);

            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 400);

            // Continuous small bursts
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    particleCount,
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2
                    }
                });

                confetti({
                    particleCount,
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2
                    }
                });
            }, 250);
        } else {
            // Fallback to custom confetti
            this.createCustomConfetti();
        }
    }

    createCustomConfetti() {
        const container = document.querySelector('.floating-elements-container');
        if (!container) return;

        const colors = ['#ff4757', '#2ecc71', '#3742fa', '#ffa502', '#ff6b81', '#5f27cd', '#f39c12', '#e74c3c'];

        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'custom-confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                z-index: 10000;
                pointer-events: none;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: customConfettiFall ${3 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;

            container.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 8000);
        }
    }

    animateBackgroundColors() {
        const background = document.querySelector('.celebration-background');
        if (background) {
            background.classList.add('party-colors-active');
        }

        // Also add party colors to body
        document.body.classList.add('party-background');
    }

    startFloatingBalloons() {
        const container = document.querySelector('.floating-elements-container');
        if (!container) return;

        const balloonColors = ['#ff4757', '#2ecc71', '#3742fa', '#ffa502', '#ff6b81'];
        const balloonCount = 8;

        for (let i = 0; i < balloonCount; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'floating-balloon';
                balloon.innerHTML = '🎈';
                balloon.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 20 + 30}px;
                    left: ${Math.random() * 90}%;
                    bottom: -50px;
                    z-index: 9999;
                    pointer-events: none;
                    animation: floatUp ${8 + Math.random() * 4}s ease-out forwards;
                    animation-delay: ${Math.random() * 2}s;
                    filter: hue-rotate(${Math.random() * 360}deg);
                `;

                container.appendChild(balloon);
                this.balloons.push(balloon);

                setTimeout(() => {
                    if (balloon.parentNode) {
                        balloon.parentNode.removeChild(balloon);
                    }
                }, 12000);
            }, i * 500);
        }
    }

    startFloatingEmojis() {
        const container = document.querySelector('.floating-elements-container');
        if (!container) return;

        const emojis = ['🎉', '🥳', '🎊', '🎁', '🎂', '🌟', '✨', '💖', '🎈', '🎀'];
        const emojiCount = 15;

        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'floating-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 15 + 25}px;
                    left: ${Math.random() * 95}%;
                    bottom: -30px;
                    z-index: 9998;
                    pointer-events: none;
                    animation: floatUpRotate ${6 + Math.random() * 3}s ease-out forwards;
                    animation-delay: ${Math.random() * 3}s;
                `;

                container.appendChild(emoji);
                this.floatingEmojis.push(emoji);

                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 10000);
            }, i * 300);
        }
    }

    animatePonyCar() {
        const container = document.querySelector('.pony-car-container');
        if (!container) return;

        // Create pony car element
        const ponyCar = document.createElement('div');
        ponyCar.className = 'pony-car';
        ponyCar.innerHTML = `
            <div class="car-body">🏎️</div>
            <div class="pony-driver">🦄</div>
        `;
        ponyCar.style.cssText = `
            position: fixed;
            bottom: 20%;
            left: -150px;
            z-index: 9997;
            pointer-events: none;
            animation: driveAcross 6s ease-in-out forwards;
            font-size: 2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        container.appendChild(ponyCar);

        // Create candy trail
        this.createCandyTrail(ponyCar);

        // Remove after animation
        setTimeout(() => {
            if (ponyCar.parentNode) {
                ponyCar.parentNode.removeChild(ponyCar);
            }
        }, 7000);
    }

    createCandyTrail(ponyCar) {
        const candyEmojis = ['🍬', '🍭', '🧁', '🍰', '🎂'];
        let candyIndex = 0;

        const createCandy = () => {
            if (!ponyCar.parentNode) return;

            const candy = document.createElement('div');
            candy.className = 'candy-trail';
            candy.textContent = candyEmojis[candyIndex % candyEmojis.length];
            candy.style.cssText = `
                position: fixed;
                bottom: 22%;
                left: ${ponyCar.offsetLeft + 50}px;
                z-index: 9996;
                pointer-events: none;
                font-size: 1.5rem;
                animation: candyFade 2s ease-out forwards;
            `;

            document.body.appendChild(candy);
            candyIndex++;

            setTimeout(() => {
                if (candy.parentNode) {
                    candy.parentNode.removeChild(candy);
                }
            }, 2000);
        };

        // Create candy trail every 200ms while car is moving
        const candyInterval = setInterval(createCandy, 200);
        setTimeout(() => clearInterval(candyInterval), 6000);
    }

    startFallingCandies() {
        const container = document.querySelector('.floating-elements-container');
        if (!container) return;

        const candyEmojis = ['🍬', '🍭', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫'];
        const candyCount = 20;

        for (let i = 0; i < candyCount; i++) {
            setTimeout(() => {
                const candy = document.createElement('div');
                candy.className = 'falling-candy';
                candy.textContent = candyEmojis[Math.floor(Math.random() * candyEmojis.length)];
                candy.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 10 + 20}px;
                    left: ${Math.random() * 95}%;
                    top: -30px;
                    z-index: 9995;
                    pointer-events: none;
                    animation: candyFall ${4 + Math.random() * 2}s ease-in forwards;
                    animation-delay: ${Math.random() * 2}s;
                `;

                container.appendChild(candy);
                this.candies.push(candy);

                setTimeout(() => {
                    if (candy.parentNode) {
                        candy.parentNode.removeChild(candy);
                    }
                }, 8000);
            }, i * 200);
        }
    }

    animateMemoryPhotos() {
        // Animate memory photos if they exist
        const memoryPhotos = document.querySelectorAll('.memory-photo, .memory-card, .memory-image');

        memoryPhotos.forEach((photo, index) => {
            setTimeout(() => {
                photo.classList.add('celebration-glow');

                // Remove glow effect after animation
                setTimeout(() => {
                    photo.classList.remove('celebration-glow');
                }, 2000);
            }, index * 100);
        });

        // Also animate any photos in the game gallery modal
        const gamePhotos = document.querySelectorAll('#memoryGallery img');
        gamePhotos.forEach((photo, index) => {
            setTimeout(() => {
                photo.style.animation = 'celebrationPhotoGlow 2s ease-in-out';

                setTimeout(() => {
                    photo.style.animation = '';
                }, 2000);
            }, index * 150);
        });
    }

    playCelebrationMusic() {
        if (!this.musicEnabled || !this.audioContext) return;

        try {
            // Create a happy birthday melody using Web Audio API
            const melody = [
                { freq: 523, duration: 0.5 }, // C
                { freq: 523, duration: 0.5 }, // C
                { freq: 587, duration: 1 },   // D
                { freq: 523, duration: 1 },   // C
                { freq: 698, duration: 1 },   // F
                { freq: 659, duration: 2 },   // E
                { freq: 523, duration: 0.5 }, // C
                { freq: 523, duration: 0.5 }, // C
                { freq: 587, duration: 1 },   // D
                { freq: 523, duration: 1 },   // C
                { freq: 784, duration: 1 },   // G
                { freq: 698, duration: 2 }    // F
            ];

            let currentTime = this.audioContext.currentTime;

            melody.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                gainNode.gain.setValueAtTime(0.1, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);

                currentTime += note.duration;
            });
        } catch (error) {
            console.log('Failed to play celebration music:', error);
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const musicBtn = document.getElementById('toggleCelebrationMusic');

        if (musicBtn) {
            const icon = musicBtn.querySelector('i');
            if (this.musicEnabled) {
                icon.className = 'fas fa-volume-up';
                musicBtn.title = 'Disable Music';
            } else {
                icon.className = 'fas fa-volume-mute';
                musicBtn.title = 'Enable Music';
            }
        }

        // Save preference
        localStorage.setItem('celebrationMusicEnabled', this.musicEnabled.toString());
    }

    replayCelebration() {
        if (this.currentCelebration) {
            this.endCelebration();
            setTimeout(() => {
                this.activateCelebrationMode(this.currentCelebration);
            }, 500);
        }
    }

    endCelebration() {
        this.isActive = false;

        // Hide celebration container
        const container = document.getElementById('partyExplosionContainer');
        if (container) {
            container.classList.remove('active');
            setTimeout(() => {
                container.style.display = 'none';
            }, 500);
        }

        // Remove celebration classes
        document.body.classList.remove('celebration-active', 'party-background');

        // Clean up floating elements
        this.cleanupFloatingElements();

        // Stop any ongoing audio
        if (this.audioContext) {
            try {
                this.audioContext.suspend();
            } catch (error) {
                console.log('Error suspending audio context:', error);
            }
        }
    }

    cleanupFloatingElements() {
        // Remove all floating elements
        const elementsToClean = [
            '.floating-balloon',
            '.floating-emoji',
            '.falling-candy',
            '.pony-car',
            '.candy-trail',
            '.custom-confetti-piece'
        ];

        elementsToClean.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });

        // Clear arrays
        this.balloons = [];
        this.floatingEmojis = [];
        this.candies = [];
    }

    // Static method to trigger celebration from anywhere
    static trigger(options = {}) {
        if (window.partyExplosion) {
            window.partyExplosion.activateCelebrationMode(options);
        }
    }

    // Method to add "Celebrate Now" button to any page
    static addCelebrateButton(targetElement = document.body) {
        const button = document.createElement('button');
        button.className = 'btn-celebrate-now';
        button.innerHTML = '<i class="fas fa-party-horn"></i> Celebrate Now!';
        button.onclick = () => PartyExplosion.trigger({
            type: 'manual',
            title: '🎉 PARTY TIME! 🎉',
            message: 'Let\'s celebrate Karthi\'s special day!'
        });

        targetElement.appendChild(button);
        return button;
    }
}

// Initialize party explosion system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.partyExplosion = new PartyExplosion();

    // Load music preference
    const musicPref = localStorage.getItem('celebrationMusicEnabled');
    if (musicPref !== null) {
        window.partyExplosion.musicEnabled = musicPref === 'true';
    }
});

// Export for external use
window.PartyExplosion = PartyExplosion;
