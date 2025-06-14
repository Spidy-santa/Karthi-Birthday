// Main Gallery - Complete Photo Management System
class MainGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.isLoading = true;
        
        // DOM elements
        this.photoGrid = document.getElementById('photoGrid');
        this.loadingState = document.getElementById('loadingState');
        this.emptyState = document.getElementById('emptyState');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewToggleButtons = document.querySelectorAll('.view-toggle');
        
        this.init();
    }

    init() {
        this.loadPhotosFromDocuments();
        this.setupEventListeners();
        this.initializeAOS();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.isLoading = false;
            this.renderGallery();
        }, 1500);
    }

    initializeAOS() {
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
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setFilter(filter);
                
                // Update active state
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // View toggle buttons
        this.viewToggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.setView(view);
                
                // Update active state
                this.viewToggleButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case '1':
                    this.setFilter('all');
                    break;
                case '2':
                    this.setFilter('memories');
                    break;
                case '3':
                    this.setFilter('celebrations');
                    break;
                case 'g':
                case 'G':
                    this.setView('grid');
                    break;
                case 'l':
                case 'L':
                    this.setView('list');
                    break;
            }
        });
    }

    loadPhotosFromDocuments() {
        // Sample photos - Replace these with actual images from your Documents folder
        // After using the setup-images.html tool, replace this array with your generated image list
        this.photos = [
            {
                id: 1,
                url: 'https://picsum.photos/400/300?random=1',
                title: 'Beautiful Memory 1',
                description: 'A precious moment captured with friends and family',
                category: 'memories',
                date: '2024-01-15'
            },
            {
                id: 2,
                url: 'https://picsum.photos/400/300?random=2',
                title: 'Celebration Time',
                description: 'Celebrating special moments with loved ones',
                category: 'celebrations',
                date: '2024-02-20'
            },
            {
                id: 3,
                url: 'https://picsum.photos/400/300?random=3',
                title: 'Friends Forever',
                description: 'Amazing times with the best friends ever',
                category: 'friends',
                date: '2024-03-10'
            },
            {
                id: 4,
                url: 'https://picsum.photos/400/300?random=4',
                title: 'Family Gathering',
                description: 'Wonderful family moments that warm the heart',
                category: 'family',
                date: '2024-04-05'
            },
            {
                id: 5,
                url: 'https://picsum.photos/400/300?random=5',
                title: 'Adventure Day',
                description: 'Exploring new places and creating memories',
                category: 'memories',
                date: '2024-05-12'
            },
            {
                id: 6,
                url: 'https://picsum.photos/400/300?random=6',
                title: 'Birthday Bash',
                description: 'Another year of joy and celebration',
                category: 'celebrations',
                date: '2024-06-18'
            },
            {
                id: 7,
                url: 'https://picsum.photos/400/300?random=7',
                title: 'Study Group Fun',
                description: 'Learning together with amazing classmates',
                category: 'friends',
                date: '2024-07-22'
            },
            {
                id: 8,
                url: 'https://picsum.photos/400/300?random=8',
                title: 'Home Sweet Home',
                description: 'Cozy moments at home with family',
                category: 'family',
                date: '2024-08-30'
            },
            {
                id: 9,
                url: 'https://picsum.photos/400/300?random=9',
                title: 'Table Tennis Champion',
                description: 'Showing off those amazing table tennis skills',
                category: 'memories',
                date: '2024-09-14'
            },
            {
                id: 10,
                url: 'https://picsum.photos/400/300?random=10',
                title: 'Graduation Day',
                description: 'A milestone achievement worth celebrating',
                category: 'celebrations',
                date: '2024-10-25'
            }
        ];

        // Try to load additional photos from localStorage if available
        this.loadAdditionalPhotos();
        
        this.filteredPhotos = [...this.photos];
    }

    loadAdditionalPhotos() {
        try {
            // Check if there are photos from the memory gallery
            const memoryGalleryData = localStorage.getItem('memoryGallery');
            if (memoryGalleryData) {
                const parsed = JSON.parse(memoryGalleryData);
                if (parsed.photos && parsed.photos.length > 0) {
                    // Add memory gallery photos to main gallery
                    parsed.photos.forEach(photo => {
                        if (!this.photos.some(p => p.url === photo.url)) {
                            this.photos.push({
                                ...photo,
                                category: 'memories',
                                title: photo.title || 'Memory Photo',
                                description: photo.description || 'A special memory from the game'
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading additional photos:', error);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === filter);
        }
        
        this.renderGallery();
    }

    setView(view) {
        this.currentView = view;
        this.renderGallery();
    }

    renderGallery() {
        if (this.isLoading) {
            this.showLoading();
            return;
        }

        this.hideLoading();

        if (this.filteredPhotos.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.renderPhotos();
    }

    renderPhotos() {
        // Update grid class based on view mode
        this.photoGrid.className = `photo-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        // Clear existing content
        this.photoGrid.innerHTML = '';

        // Render each photo
        this.filteredPhotos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo, index);
            this.photoGrid.appendChild(photoCard);
        });

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Initialize lightbox for new images
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true,
                'albumLabel': 'Image %1 of %2'
            });
        }
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = `photo-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        
        const formattedDate = new Date(photo.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <a href="${photo.url}" data-lightbox="gallery" data-title="${photo.title}">
                <img src="${photo.url}" alt="${photo.title}" class="photo-image" loading="lazy">
            </a>
            <div class="photo-info">
                <h3 class="photo-title">${photo.title}</h3>
                <p class="photo-description">${photo.description}</p>
                <div class="photo-meta">
                    <span class="photo-category">${this.formatCategory(photo.category)}</span>
                    <span class="photo-date">${formattedDate}</span>
                </div>
            </div>
        `;

        return card;
    }

    formatCategory(category) {
        const categoryMap = {
            'memories': '💭 Memories',
            'celebrations': '🎉 Celebrations',
            'friends': '👥 Friends',
            'family': '👨‍👩‍👧‍👦 Family'
        };
        return categoryMap[category] || category;
    }

    showLoading() {
        this.loadingState.style.display = 'flex';
        this.photoGrid.style.display = 'none';
        this.emptyState.style.display = 'none';
    }

    hideLoading() {
        this.loadingState.style.display = 'none';
        this.photoGrid.style.display = 'grid';
    }

    showEmptyState() {
        this.emptyState.style.display = 'block';
        this.photoGrid.style.display = 'none';
    }

    hideEmptyState() {
        this.emptyState.style.display = 'none';
    }

    // Method to add new photos (for external use)
    addPhoto(photoData) {
        const newPhoto = {
            id: Date.now(),
            url: photoData.url,
            title: photoData.title || 'New Memory',
            description: photoData.description || 'A beautiful moment captured',
            category: photoData.category || 'memories',
            date: photoData.date || new Date().toISOString().split('T')[0]
        };

        this.photos.push(newPhoto);
        this.setFilter(this.currentFilter); // Refresh current view
    }

    // Method to get gallery statistics
    getGalleryStats() {
        const stats = {
            total: this.photos.length,
            byCategory: {}
        };

        this.photos.forEach(photo => {
            stats.byCategory[photo.category] = (stats.byCategory[photo.category] || 0) + 1;
        });

        return stats;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainGallery = new MainGallery();
    
    // Display gallery stats in console for debugging
    setTimeout(() => {
        console.log('Gallery Stats:', window.mainGallery.getGalleryStats());
    }, 2000);
});

// Export for external use
window.MainGallery = MainGallery;
