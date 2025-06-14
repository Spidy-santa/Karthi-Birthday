// Memory Gallery - Advanced Photo Management System
class MemoryGallery {
    constructor() {
        this.photos = [];
        this.totalPhotos = 17; // Updated to match ALL actual photos available
        this.currentPhotoIndex = 0;
        this.isComplete = false;
        this.viewMode = 'grid'; // 'grid' or 'list'

        // ALL actual images from memory-photos folder
        this.availablePhotos = [
            {
                url: 'images/memory-photos/IMG-20241225-WA0031.jpg',
                title: 'Christmas Memories',
                description: 'Special holiday moments'
            },
            {
                url: 'images/memory-photos/IMG-20241225-WA0032.jpg',
                title: 'Festive Joy',
                description: 'Celebrating the season'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0016.jpg',
                title: 'Beautiful Moments',
                description: 'Captured memories'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0017.jpg',
                title: 'Happy Times',
                description: 'Joyful celebrations'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0025.jpg',
                title: 'Celebration Time',
                description: 'Celebrating with friends'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0028.jpg',
                title: 'Precious Moments',
                description: 'Memories to cherish'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0029.jpg',
                title: 'Golden Memories',
                description: 'Unforgettable times'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0030.jpg',
                title: 'Special Day',
                description: 'Making memories'
            },
            {
                url: 'images/memory-photos/IMG-20250613-WA0031.jpg',
                title: 'Fun Adventures',
                description: 'Adventure and laughter'
            },
            {
                url: 'images/memory-photos/image-2.jpg',
                title: 'Cherished Moments',
                description: 'Memories to treasure'
            },
            {
                url: 'images/memory-photos/image-3.jpg',
                title: 'Fun Times',
                description: 'Laughter and joy'
            },
            {
                url: 'images/memory-photos/image-4.jpg',
                title: 'Happy Memories',
                description: 'Beautiful moments'
            },
            {
                url: 'images/memory-photos/image-5.jpg',
                title: 'Wonderful Times',
                description: 'Amazing experiences'
            },
            {
                url: 'images/memory-photos/image-6.jpg',
                title: 'Joyful Moments',
                description: 'Pure happiness'
            },
            {
                url: 'images/memory-photos/image-7.jpg',
                title: 'Sweet Memories',
                description: 'Heartwarming times'
            },
            {
                url: 'images/memory-photos/image-8.jpg',
                title: 'Perfect Moments',
                description: 'Life\'s best times'
            },
            {
                url: 'images/memory-photos/image.jpg',
                title: 'Golden Memories',
                description: 'Unforgettable experiences'
            }
        ];
        
        // DOM elements
        this.galleryContainer = document.getElementById('memoryGallery');
        this.emptyState = document.getElementById('emptyState');
        this.photosCollectedDisplay = document.getElementById('photosCollected');
        this.totalPhotosDisplay = document.getElementById('totalPhotos');
        this.progressBar = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        
        // Lightbox elements
        this.lightboxModal = document.getElementById('lightboxModal');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDate = document.getElementById('lightboxDate');
        this.lightboxClose = document.querySelector('.lightbox-close');
        this.prevPhotoBtn = document.getElementById('prevPhoto');
        this.nextPhotoBtn = document.getElementById('nextPhoto');
        
        // Control buttons
        this.gridViewBtn = document.getElementById('viewModeGrid');
        this.listViewBtn = document.getElementById('viewModeList');
        this.clearGalleryBtn = document.getElementById('clearGallery');
        this.downloadAllBtn = document.getElementById('downloadGallery');
        this.shareGalleryBtn = document.getElementById('shareGallery');
        this.shuffleBtn = document.getElementById('shuffleGallery');
        this.sortByDateBtn = document.getElementById('sortByDate');
        this.sortByGameBtn = document.getElementById('sortByGame');
        
        this.init();
    }

    init() {
        this.loadPhotosFromStorage();
        this.preloadAllPhotos(); // Load all available photos
        this.setupEventListeners();
        this.updateUI();
        this.initializeAOS();

        // Set total photos display
        if (this.totalPhotosDisplay) {
            this.totalPhotosDisplay.textContent = this.totalPhotos;
        }
    }

    preloadAllPhotos() {
        // Add all available photos to the gallery for display
        this.availablePhotos.forEach((photo, index) => {
            const existingPhoto = this.photos.find(p => p.url === photo.url);
            if (!existingPhoto) {
                const newPhoto = {
                    id: Date.now() + index,
                    url: photo.url,
                    title: photo.title,
                    description: photo.description,
                    collectedAt: new Date().toISOString(),
                    preloaded: true
                };
                this.photos.push(newPhoto);
            }
        });

        this.renderGallery();
        this.savePhotosToStorage();
    }

    initializeAOS() {
        // Initialize AOS (Animate On Scroll) library
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
    }

    setupEventListeners() {
        // Lightbox controls
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (this.lightboxModal) {
            this.lightboxModal.addEventListener('click', (e) => {
                if (e.target === this.lightboxModal) {
                    this.closeLightbox();
                }
            });
        }

        if (this.prevPhotoBtn) {
            this.prevPhotoBtn.addEventListener('click', () => this.showPreviousPhoto());
        }

        if (this.nextPhotoBtn) {
            this.nextPhotoBtn.addEventListener('click', () => this.showNextPhoto());
        }

        // View mode controls
        if (this.gridViewBtn) {
            this.gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
        }

        if (this.listViewBtn) {
            this.listViewBtn.addEventListener('click', () => this.setViewMode('list'));
        }

        // Gallery management
        if (this.clearGalleryBtn) {
            this.clearGalleryBtn.addEventListener('click', () => this.clearGallery());
        }

        if (this.downloadAllBtn) {
            this.downloadAllBtn.addEventListener('click', () => this.downloadAllPhotos());
        }

        if (this.shareGalleryBtn) {
            this.shareGalleryBtn.addEventListener('click', () => this.shareGallery());
        }

        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.shufflePhotos());
        }

        if (this.sortByDateBtn) {
            this.sortByDateBtn.addEventListener('click', () => this.sortPhotos('date'));
        }

        if (this.sortByGameBtn) {
            this.sortByGameBtn.addEventListener('click', () => this.sortPhotos('game'));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightboxModal && this.lightboxModal.style.display !== 'none') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousPhoto();
                        break;
                    case 'ArrowRight':
                        this.showNextPhoto();
                        break;
                }
            }
        });

        // Listen for photos added from game
        window.addEventListener('photoCollected', (e) => {
            this.addPhotoToGallery(e.detail);
        });
    }

    addPhotoToGallery(photoData) {
        // Prevent duplicate photos
        if (this.photos.some(photo => photo.url === photoData.url)) {
            return;
        }

        const newPhoto = {
            id: Date.now(),
            url: photoData.url,
            title: photoData.title || `Memory ${this.photos.length + 1}`,
            description: photoData.description || 'A precious moment captured during the game',
            collectedAt: new Date().toISOString(),
            ...photoData
        };

        this.photos.push(newPhoto);
        this.savePhotosToStorage();
        this.renderGallery();
        this.updateUI();
        
        // Show photo addition animation
        this.animatePhotoAddition(newPhoto);
        
        // Check if gallery is complete
        if (this.photos.length >= this.totalPhotos && !this.isComplete) {
            this.triggerCompletionCelebration();
        }
    }

    animatePhotoAddition(photo) {
        // Find the newly added photo element and animate it
        setTimeout(() => {
            const photoElements = this.galleryContainer.querySelectorAll('.memory-card');
            const newPhotoElement = photoElements[photoElements.length - 1];
            
            if (newPhotoElement) {
                // Add special animation class
                newPhotoElement.classList.add('photo-entrance');
                
                // Create floating notification
                this.showPhotoCollectedNotification(photo);
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    newPhotoElement.classList.remove('photo-entrance');
                }, 1000);
            }
        }, 100);
    }

    showPhotoCollectedNotification(photo) {
        const notification = document.createElement('div');
        notification.className = 'photo-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-camera"></i>
                <span>New Memory Collected!</span>
                <small>${photo.title}</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    renderGallery() {
        if (!this.galleryContainer) return;

        // Show/hide empty state
        if (this.emptyState) {
            this.emptyState.style.display = this.photos.length === 0 ? 'block' : 'none';
        }

        if (this.photos.length === 0) {
            this.galleryContainer.innerHTML = '';
            return;
        }

        // Clear existing content
        this.galleryContainer.innerHTML = '';
        
        // Apply view mode class
        this.galleryContainer.className = `memory-gallery ${this.viewMode}-view`;

        // Render photos
        this.photos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo, index);
            this.galleryContainer.appendChild(photoCard);
        });

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = `memory-card ${this.viewMode === 'list' ? 'list-view' : ''}`;
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        
        const collectedDate = new Date(photo.collectedAt).toLocaleDateString();
        
        card.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" class="memory-image" loading="lazy">
            <div class="memory-info">
                <h3 class="memory-title">${photo.title}</h3>
                <p class="memory-date">Collected: ${collectedDate}</p>
                <p class="memory-description">${photo.description}</p>
            </div>
            <div class="memory-badge">#${index + 1}</div>
        `;

        // Add click event for lightbox
        card.addEventListener('click', () => this.openLightbox(index));
        
        return card;
    }

    openLightbox(photoIndex) {
        if (!this.lightboxModal || !this.photos[photoIndex]) return;

        this.currentPhotoIndex = photoIndex;
        const photo = this.photos[photoIndex];

        this.lightboxImage.src = photo.url;
        this.lightboxImage.alt = photo.title;
        
        if (this.lightboxTitle) {
            this.lightboxTitle.textContent = photo.title;
        }
        
        if (this.lightboxDate) {
            this.lightboxDate.textContent = new Date(photo.collectedAt).toLocaleDateString();
        }

        this.lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Update navigation buttons
        this.updateLightboxNavigation();
    }

    closeLightbox() {
        if (this.lightboxModal) {
            this.lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    showPreviousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.openLightbox(this.currentPhotoIndex - 1);
        }
    }

    showNextPhoto() {
        if (this.currentPhotoIndex < this.photos.length - 1) {
            this.openLightbox(this.currentPhotoIndex + 1);
        }
    }

    updateLightboxNavigation() {
        if (this.prevPhotoBtn) {
            this.prevPhotoBtn.disabled = this.currentPhotoIndex === 0;
        }
        
        if (this.nextPhotoBtn) {
            this.nextPhotoBtn.disabled = this.currentPhotoIndex === this.photos.length - 1;
        }
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.renderGallery();
        
        // Update button states
        if (this.gridViewBtn && this.listViewBtn) {
            this.gridViewBtn.classList.toggle('active', mode === 'grid');
            this.listViewBtn.classList.toggle('active', mode === 'list');
        }
        
        localStorage.setItem('galleryViewMode', mode);
    }

    updateUI() {
        // Update photo count
        if (this.photosCollectedDisplay) {
            this.photosCollectedDisplay.textContent = this.photos.length;
        }

        // Update progress bar
        const progress = (this.photos.length / this.totalPhotos) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }

        if (this.progressText) {
            this.progressText.textContent = `${this.photos.length} of ${this.totalPhotos} memories collected`;
        }
    }

    triggerCompletionCelebration() {
        this.isComplete = true;

        // Trigger the enhanced Party Explosion system
        if (window.PartyExplosion) {
            window.PartyExplosion.trigger({
                type: 'gallery_completion',
                title: '📷 GALLERY MASTER! 📷',
                message: `Incredible! You've collected all ${this.totalPhotos} precious memories of Karthi!`,
                photosCollected: this.photos.length,
                totalPhotos: this.totalPhotos
            });
        } else {
            // Fallback to original celebration
            this.createCompletionCelebration();
            this.createConfetti();
        }

        // Animate all photos with shuffle effect
        this.animateGalleryCompletion();

        // Save completion state
        localStorage.setItem('galleryComplete', 'true');
    }

    createCompletionCelebration() {
        // Check if celebration already exists
        if (document.querySelector('.completion-celebration')) return;

        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <h2 class="celebration-title">🎉 Gallery Complete! 🎉</h2>
            <p class="celebration-text">
                Congratulations! You've collected all of Karthi's precious memories.
                Each photo tells a story of wonderful moments and cherished experiences.
            </p>
            <div class="celebration-actions">
                <button class="btn-celebration" onclick="memoryGallery.downloadAllPhotos()">
                    <i class="fas fa-download"></i> Download All Photos
                </button>
                <button class="btn-celebration" onclick="memoryGallery.shareGallery()">
                    <i class="fas fa-share"></i> Share Gallery
                </button>
            </div>
        `;

        // Insert before gallery
        if (this.galleryContainer && this.galleryContainer.parentNode) {
            this.galleryContainer.parentNode.insertBefore(celebration, this.galleryContainer);
        }

        // Animate celebration appearance
        setTimeout(() => {
            celebration.style.opacity = '0';
            celebration.style.transform = 'translateY(30px)';
            celebration.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            setTimeout(() => {
                celebration.style.opacity = '1';
                celebration.style.transform = 'translateY(0)';
            }, 100);
        }, 500);
    }

    createConfetti() {
        const confettiContainer = document.getElementById('confettiContainer') || document.body;
        const colors = ['#ff4757', '#2ecc71', '#3742fa', '#ffa502', '#ff6b81', '#5f27cd'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 3000;
                pointer-events: none;
                animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;

            confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 6000);
        }
    }

    animateGalleryCompletion() {
        const photoCards = this.galleryContainer.querySelectorAll('.memory-card');

        photoCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shuffle-animation');

                // Remove animation class after completion
                setTimeout(() => {
                    card.classList.remove('shuffle-animation');
                }, 800);
            }, index * 100);
        });
    }

    clearGallery() {
        if (confirm('Are you sure you want to clear all collected memories? This action cannot be undone.')) {
            this.photos = [];
            this.isComplete = false;
            this.savePhotosToStorage();
            this.renderGallery();
            this.updateUI();

            // Remove completion celebration if it exists
            const celebration = document.querySelector('.completion-celebration');
            if (celebration) {
                celebration.remove();
            }

            localStorage.removeItem('galleryComplete');
        }
    }

    downloadAllPhotos() {
        if (this.photos.length === 0) {
            alert('No photos to download!');
            return;
        }

        // Create a simple download notification
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-download"></i>
                <span>Preparing ${this.photos.length} photos for download...</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Simulate download process (in a real app, you'd zip the images)
        setTimeout(() => {
            notification.querySelector('span').textContent = 'Download complete!';
            setTimeout(() => notification.remove(), 2000);
        }, 2000);
    }

    shareGallery() {
        if (navigator.share) {
            navigator.share({
                title: 'Karthi\'s Memory Gallery',
                text: `I've collected ${this.photos.length} precious memories of Karthi!`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Gallery URL copied to clipboard!');
            }).catch(() => {
                alert('Unable to share. Please copy the URL manually.');
            });
        }
    }

    savePhotosToStorage() {
        try {
            const galleryData = {
                photos: this.photos,
                isComplete: this.isComplete,
                viewMode: this.viewMode,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('memoryGallery', JSON.stringify(galleryData));
        } catch (error) {
            console.error('Failed to save gallery data:', error);
        }
    }

    loadPhotosFromStorage() {
        try {
            const saved = localStorage.getItem('memoryGallery');
            if (saved) {
                const galleryData = JSON.parse(saved);
                this.photos = galleryData.photos || [];
                this.isComplete = galleryData.isComplete || false;
                this.viewMode = galleryData.viewMode || 'grid';

                // Check if gallery was previously completed
                if (this.isComplete) {
                    setTimeout(() => this.createCompletionCelebration(), 1000);
                }
            }

            // Also load from game storage for backward compatibility
            const gameData = localStorage.getItem('shootBoxesGame');
            if (gameData) {
                const parsed = JSON.parse(gameData);
                if (parsed.memoryPhotos && parsed.memoryPhotos.length > 0) {
                    // Merge photos from game storage
                    parsed.memoryPhotos.forEach((url, index) => {
                        if (!this.photos.some(photo => photo.url === url)) {
                            this.photos.push({
                                id: Date.now() + index,
                                url: url,
                                title: `Memory ${this.photos.length + 1}`,
                                description: 'Collected during the shooting game',
                                collectedAt: new Date().toISOString()
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load gallery data:', error);
            this.photos = [];
        }
    }

    shufflePhotos() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.photos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.photos[i], this.photos[j]] = [this.photos[j], this.photos[i]];
        }

        this.renderGallery();
        this.savePhotosToStorage();

        // Show shuffle animation
        const photoCards = this.galleryContainer.querySelectorAll('.memory-card');
        photoCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shuffle-animation');
                setTimeout(() => card.classList.remove('shuffle-animation'), 800);
            }, index * 50);
        });
    }

    sortPhotos(sortBy) {
        switch (sortBy) {
            case 'date':
                this.photos.sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt));
                this.updateSortButtons('date');
                break;
            case 'game':
                this.photos.sort((a, b) => (b.gameScore || 0) - (a.gameScore || 0));
                this.updateSortButtons('game');
                break;
            default:
                return;
        }

        this.renderGallery();
        this.savePhotosToStorage();
    }

    updateSortButtons(activeSort) {
        if (this.sortByDateBtn && this.sortByGameBtn) {
            this.sortByDateBtn.classList.toggle('active', activeSort === 'date');
            this.sortByGameBtn.classList.toggle('active', activeSort === 'game');
        }
    }

    // Enhanced photo collection method for external use
    static addPhotoFromGame(photoData) {
        if (window.memoryGallery) {
            window.memoryGallery.addPhotoToGallery(photoData);
        }
    }

    // Method to get gallery statistics
    getGalleryStats() {
        return {
            totalPhotos: this.photos.length,
            maxPhotos: this.totalPhotos,
            isComplete: this.isComplete,
            completionPercentage: Math.round((this.photos.length / this.totalPhotos) * 100),
            lastPhotoCollected: this.photos.length > 0 ? this.photos[this.photos.length - 1].collectedAt : null
        };
    }

    // Method to export gallery data
    exportGalleryData() {
        const data = {
            photos: this.photos,
            stats: this.getGalleryStats(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `karthi-memory-gallery-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.memoryGallery = new MemoryGallery();
});

// Export for external use
window.MemoryGallery = MemoryGallery;
