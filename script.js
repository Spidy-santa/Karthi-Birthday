// Birthday Intro Page - Interactive Script
class BirthdayIntro {
    constructor() {
        this.isLoaded = false;
        this.musicEnabled = false;
        this.isTransitioning = false;
        this.hasInteracted = false;

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPage());
        } else {
            this.setupPage();
        }
    }

    setupPage() {
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            mainContainer: document.getElementById('mainContainer'),
            splineFrame: document.getElementById('splineFrame'),
            giftContainer: document.getElementById('giftContainer'),
            fadeTransition: document.getElementById('fadeTransition'),
            musicToggle: document.getElementById('musicToggle'),
            backgroundMusic: document.getElementById('backgroundMusic')
        };

        this.setupEventListeners();
        this.simulateLoading();
    }

    setupEventListeners() {
        // Spline frame load detection
        this.elements.splineFrame.addEventListener('load', () => {
            console.log('3D gift box loaded');
            this.handleSplineLoad();
        });

        // Gift container click detection - single reliable handler
        this.elements.giftContainer.addEventListener('click', () => {
            this.handleGiftBoxClick();
        });

        // Touch events for mobile with proper handling
        this.elements.giftContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleGiftBoxClick();
        });

        // Music toggle
        this.elements.musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMusic();
        });

        // Keyboard interaction (Space or Enter to open)
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && this.isLoaded && !this.isTransitioning) {
                e.preventDefault();
                this.handleGiftBoxClick();
            }
        });

        // Prevent context menu on long press (mobile)
        this.elements.giftContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Handle visibility change (pause music when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.musicEnabled) {
                this.elements.backgroundMusic.pause();
            } else if (!document.hidden && this.musicEnabled) {
                this.playMusic();
            }
        });
    }

    simulateLoading() {
        // Optimized loading time for better UX
        const minLoadTime = 1500; // 1.5 seconds minimum
        const startTime = Date.now();

        const checkLoadComplete = () => {
            const elapsedTime = Date.now() - startTime;

            if (elapsedTime >= minLoadTime) {
                this.hideLoadingScreen();
            } else {
                setTimeout(checkLoadComplete, 100);
            }
        };

        // Start checking after a short delay
        setTimeout(checkLoadComplete, 300);
    }

    hideLoadingScreen() {
        this.elements.loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
            this.elements.mainContainer.classList.add('loaded');
            this.isLoaded = true;
            
            // Auto-play music if supported (with user gesture requirement)
            this.setupMusicAutoplay();
        }, 500);
    }

    handleSplineLoad() {
        // Add any specific handling for when Spline content is loaded
        console.log('3D gift box is ready for interaction');
        
        // Add a subtle animation to indicate interactivity
        this.addInteractivityHints();
    }

    addInteractivityHints() {
        // Add extra visual cues that the gift box is interactive
        const giftContainer = document.querySelector('.gift-container');
        
        // Add a subtle hover effect
        giftContainer.addEventListener('mouseenter', () => {
            if (!this.isTransitioning) {
                giftContainer.style.transform = 'translate(-50%, -50%) scale(1.02)';
            }
        });

        giftContainer.addEventListener('mouseleave', () => {
            if (!this.isTransitioning) {
                giftContainer.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    }

    handleGiftBoxClick() {
        // Prevent multiple clicks and ensure page is loaded
        if (this.isTransitioning || !this.isLoaded || this.hasInteracted) {
            return;
        }

        console.log('Gift box clicked! Opening surprise...');
        this.hasInteracted = true;
        this.isTransitioning = true;

        // Add subtle click effect
        this.addClickEffect();

        // Play click sound effect
        this.playClickSound();

        // Immediate transition to main page
        setTimeout(() => {
            this.transitionToMainPage();
        }, 400);
    }

    addClickEffect() {
        // Add subtle scale effect to gift container
        this.elements.giftContainer.style.transform = 'translate(-50%, -50%) scale(0.98)';

        setTimeout(() => {
            this.elements.giftContainer.style.transform = 'translate(-50%, -50%) scale(1.02)';
        }, 100);

        setTimeout(() => {
            this.elements.giftContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 200);
    }

    playClickSound() {
        // Create and play a subtle click sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio context not available');
        }
    }

    transitionToMainPage() {
        // Fade out current page
        this.elements.fadeTransition.classList.add('active');

        // Stop music
        if (this.musicEnabled) {
            this.elements.backgroundMusic.pause();
        }

        // Redirect after fade completes
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 600);
    }

    setupMusicAutoplay() {
        // Check if background music file exists and setup autoplay
        this.elements.backgroundMusic.addEventListener('canplaythrough', () => {
            console.log('Background music is ready');
        });

        this.elements.backgroundMusic.addEventListener('error', () => {
            console.log('Background music file not found - hiding music control');
            this.elements.musicToggle.style.display = 'none';
        });

        // Try to load the music
        this.elements.backgroundMusic.load();
    }

    toggleMusic() {
        if (this.musicEnabled) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        try {
            const playPromise = this.elements.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.musicEnabled = true;
                    this.elements.musicToggle.classList.remove('muted');
                    this.elements.musicToggle.title = 'Mute Music';
                }).catch((error) => {
                    console.log('Music autoplay prevented:', error);
                    this.musicEnabled = false;
                });
            }
        } catch (error) {
            console.log('Music play error:', error);
        }
    }

    pauseMusic() {
        this.elements.backgroundMusic.pause();
        this.musicEnabled = false;
        this.elements.musicToggle.classList.add('muted');
        this.elements.musicToggle.title = 'Play Music';
    }

    // Utility method for mobile detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Utility method for touch device detection
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

// Initialize the birthday intro when script loads
const birthdayIntro = new BirthdayIntro();

// Export for potential external use
window.BirthdayIntro = BirthdayIntro;
