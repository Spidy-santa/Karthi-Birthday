// Image Manager - Centralized image handling for Karthi's Birthday Website
class ImageManager {
    constructor() {
        this.images = {
            profile: [],
            mainGallery: [],
            memoryPhotos: [],
            gamePhotos: []
        };
        
        this.imageCategories = {
            'memories': '💭 Memories',
            'celebrations': '🎉 Celebrations', 
            'friends': '👥 Friends',
            'family': '👨‍👩‍👧‍👦 Family',
            'sports': '🏓 Sports',
            'achievements': '🏆 Achievements'
        };
        
        this.init();
    }

    init() {
        this.loadDefaultImages();
        this.loadUserImages();
        this.setupImageUpload();
    }

    // Load default placeholder images
    loadDefaultImages() {
        // Profile images
        this.images.profile = [
            {
                id: 'profile-1',
                url: 'images/profile/IMG-20250613-WA0027.jpg',
                title: 'Karthi K - Profile Photo',
                description: 'Beautiful profile photo of Karthi',
                category: 'profile'
            }
        ];

        // Main gallery images using actual photos from main-gallery folder
        this.images.mainGallery = [
            {
                id: 'main-1',
                url: 'images/main-gallery/image.jpg',
                title: 'Beautiful Memory',
                description: 'A precious moment captured with friends and family',
                category: 'memories',
                date: '2024-01-15'
            },
            {
                id: 'main-2',
                url: 'images/main-gallery/image-2.jpg',
                title: 'Celebration Time',
                description: 'Celebrating special moments with loved ones',
                category: 'celebrations',
                date: '2024-02-20'
            },
            {
                id: 'main-3',
                url: 'images/main-gallery/image-3.jpg',
                title: 'Friends Forever',
                description: 'Amazing times with the best friends ever',
                category: 'friends',
                date: '2024-03-10'
            },
            {
                id: 'main-4',
                url: 'images/main-gallery/image-4.jpg',
                title: 'Family Gathering',
                description: 'Wonderful family moments that warm the heart',
                category: 'family',
                date: '2024-04-05'
            },
            {
                id: 'main-5',
                url: 'images/main-gallery/IMG-20241225-WA0031.jpg',
                title: 'Special Moments',
                description: 'Capturing life\'s beautiful moments',
                category: 'memories',
                date: '2024-05-12'
            },
            {
                id: 'main-6',
                url: 'images/main-gallery/IMG-20241225-WA0032.jpg',
                title: 'Joyful Times',
                description: 'Happiness and laughter shared with loved ones',
                category: 'celebrations',
                date: '2024-06-08'
            },
            {
                id: 'main-7',
                url: 'images/main-gallery/IMG-20250613-WA0016.jpg',
                title: 'Adventure Time',
                description: 'Exploring new places and making memories',
                category: 'memories',
                date: '2024-06-13'
            }
        ];

        // Memory photos for the shooting game using actual photos
        this.images.memoryPhotos = [
            'images/memory-photos/IMG-20250613-WA0024.jpg',
            'images/memory-photos/IMG-20250613-WA0025.jpg',
            'images/memory-photos/IMG-20250613-WA0032.jpg',
            'images/memory-photos/image-2.jpg',
            'images/memory-photos/image-3.jpg',
            'images/memory-photos/image-4.jpg',
            'images/memory-photos/image.jpg'
        ];
    }

    // Load user-uploaded images from localStorage
    loadUserImages() {
        try {
            const savedImages = localStorage.getItem('userImages');
            if (savedImages) {
                const parsed = JSON.parse(savedImages);
                
                // Merge with existing images
                Object.keys(parsed).forEach(category => {
                    if (this.images[category] && Array.isArray(parsed[category])) {
                        this.images[category] = [...this.images[category], ...parsed[category]];
                    }
                });
            }
        } catch (error) {
            console.error('Error loading user images:', error);
        }
    }

    // Save user images to localStorage
    saveUserImages() {
        try {
            const userImages = {
                profile: this.images.profile.filter(img => img.id.startsWith('user-')),
                mainGallery: this.images.mainGallery.filter(img => img.id.startsWith('user-')),
                memoryPhotos: this.images.memoryPhotos.filter(url => typeof url === 'string' && url.startsWith('data:')),
                gamePhotos: this.images.gamePhotos
            };
            
            localStorage.setItem('userImages', JSON.stringify(userImages));
        } catch (error) {
            console.error('Error saving user images:', error);
        }
    }

    // Setup image upload functionality
    setupImageUpload() {
        // This will be called when the image upload interface is available
        document.addEventListener('DOMContentLoaded', () => {
            const uploadInput = document.getElementById('imageUpload');
            if (uploadInput) {
                uploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
            }
        });
    }

    // Handle image upload
    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: `user-${Date.now()}-${index}`,
                        url: e.target.result,
                        title: this.generateImageTitle(file.name),
                        description: 'Uploaded image from Documents folder',
                        category: this.guessImageCategory(file.name),
                        date: new Date().toISOString().split('T')[0],
                        filename: file.name,
                        size: file.size
                    };
                    
                    this.addImageToGallery(imageData);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Generate a nice title from filename
    generateImageTitle(filename) {
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        const words = nameWithoutExt.split(/[-_\s]+/);
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    // Guess image category based on filename
    guessImageCategory(filename) {
        const lower = filename.toLowerCase();
        
        if (lower.includes('birthday') || lower.includes('party') || lower.includes('celebration')) {
            return 'celebrations';
        } else if (lower.includes('friend') || lower.includes('group')) {
            return 'friends';
        } else if (lower.includes('family') || lower.includes('mom') || lower.includes('dad')) {
            return 'family';
        } else if (lower.includes('sport') || lower.includes('tennis') || lower.includes('game')) {
            return 'sports';
        } else if (lower.includes('award') || lower.includes('achievement') || lower.includes('trophy')) {
            return 'achievements';
        }
        
        return 'memories'; // default category
    }

    // Add image to appropriate gallery
    addImageToGallery(imageData) {
        if (imageData.category === 'profile') {
            this.images.profile.push(imageData);
        } else {
            this.images.mainGallery.push(imageData);
        }
        
        this.saveUserImages();
        this.notifyImageAdded(imageData);
    }

    // Notify other components that an image was added
    notifyImageAdded(imageData) {
        const event = new CustomEvent('imageAdded', {
            detail: imageData
        });
        window.dispatchEvent(event);
    }

    // Get images by category
    getImagesByCategory(category) {
        if (category === 'all') {
            return this.images.mainGallery;
        }
        return this.images.mainGallery.filter(img => img.category === category);
    }

    // Get profile image
    getProfileImage() {
        return this.images.profile[0] || this.images.profile[0];
    }

    // Get memory photos for the game
    getMemoryPhotos() {
        return this.images.memoryPhotos;
    }

    // Add memory photo (for game integration)
    addMemoryPhoto(photoUrl) {
        if (!this.images.memoryPhotos.includes(photoUrl)) {
            this.images.memoryPhotos.push(photoUrl);
            this.saveUserImages();
        }
    }

    // Generate image list code for easy integration
    generateImageListCode() {
        const mainGalleryCode = this.images.mainGallery.map((img, index) => {
            return `    {
        id: ${img.id || index + 1},
        url: '${img.url}',
        title: '${img.title}',
        description: '${img.description}',
        category: '${img.category}',
        date: '${img.date}'
    }`;
        }).join(',\n');

        const memoryPhotosCode = this.images.memoryPhotos.map(url => `    '${url}'`).join(',\n');

        return `// Generated Image List for Karthi's Birthday Website
// Main Gallery Images (${this.images.mainGallery.length} photos)
const mainGalleryImages = [
${mainGalleryCode}
];

// Memory Photos for Shooting Game (${this.images.memoryPhotos.length} photos)
const memoryPhotos = [
${memoryPhotosCode}
];

// Profile Image
const profileImage = '${this.getProfileImage().url}';

// Usage Instructions:
// 1. Copy this code to your gallery-script.js file
// 2. Replace the existing image arrays with these generated ones
// 3. Update the image paths to point to your actual image files
// 4. Test the website to ensure all images load correctly`;
    }

    // Export gallery data
    exportGalleryData() {
        const data = {
            images: this.images,
            categories: this.imageCategories,
            exportedAt: new Date().toISOString(),
            totalImages: this.images.mainGallery.length,
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `karthi-gallery-images-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get gallery statistics
    getGalleryStats() {
        const stats = {
            total: this.images.mainGallery.length,
            byCategory: {},
            memoryPhotos: this.images.memoryPhotos.length,
            profilePhotos: this.images.profile.length
        };

        this.images.mainGallery.forEach(img => {
            stats.byCategory[img.category] = (stats.byCategory[img.category] || 0) + 1;
        });

        return stats;
    }
}

// Initialize Image Manager
window.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
    
    // Make it globally available
    window.ImageManager = ImageManager;
    
    // Log stats for debugging
    setTimeout(() => {
        console.log('Image Manager initialized');
        console.log('Gallery Stats:', window.imageManager.getGalleryStats());
    }, 1000);
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageManager;
}
