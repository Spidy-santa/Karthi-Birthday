// Wishing Wall - Interactive Birthday Wishes System
class WishingWall {
    constructor() {
        this.wishes = [];
        this.maxVisibleWishes = 10;
        this.showingAllWishes = false;
        this.userHasSubmitted = false;
        this.currentUserName = '';
        
        // DOM elements
        this.form = document.getElementById('wishingForm');
        this.nameInput = document.getElementById('userName');
        this.submitBtn = document.getElementById('submitWish');
        this.alreadySubmitted = document.getElementById('alreadySubmitted');
        this.wishesGrid = document.getElementById('wishesGrid');
        this.emptyWishes = document.getElementById('emptyWishes');
        this.toggleBtn = document.getElementById('toggleWishesBtn');
        this.clearBtn = document.getElementById('clearWishesBtn');
        this.successToast = document.getElementById('successToast');
        
        // Stats elements
        this.totalWishesDisplay = document.getElementById('totalWishes');
        this.visibleWishesCount = document.getElementById('visibleWishesCount');
        this.totalWishesCount = document.getElementById('totalWishesCount');
        
        this.init();
    }

    init() {
        this.loadWishesFromStorage();
        this.checkUserSubmissionStatus();
        this.setupEventListeners();
        this.renderWishes();
        this.updateStats();
        this.initializeAOS();
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
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Name input validation
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => this.validateName());
            this.nameInput.addEventListener('blur', () => this.validateName());
        }

        // Wish selection validation
        const wishRadios = document.querySelectorAll('input[name="wishMessage"]');
        wishRadios.forEach(radio => {
            radio.addEventListener('change', () => this.validateWishSelection());
        });

        // Toggle wishes button
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleWishesDisplay());
        }

        // Clear wishes button (admin/debug)
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAllWishes());
        }

        // Real-time form validation
        this.form?.addEventListener('input', () => this.updateSubmitButton());
    }

    validateName() {
        const name = this.nameInput.value.trim();
        const feedback = document.getElementById('nameValidation');
        
        if (name.length === 0) {
            this.showValidationMessage(feedback, '', '');
            return false;
        }
        
        if (name.length < 2) {
            this.showValidationMessage(feedback, 'Name must be at least 2 characters long', 'error');
            return false;
        }
        
        if (name.length > 30) {
            this.showValidationMessage(feedback, 'Name must be less than 30 characters', 'error');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            this.showValidationMessage(feedback, 'Name can only contain letters and spaces', 'error');
            return false;
        }
        
        this.showValidationMessage(feedback, 'Looks good!', 'success');
        return true;
    }

    validateWishSelection() {
        const selectedWish = document.querySelector('input[name="wishMessage"]:checked');
        const feedback = document.getElementById('wishValidation');
        
        if (!selectedWish) {
            this.showValidationMessage(feedback, 'Please select a birthday wish', 'error');
            return false;
        }
        
        this.showValidationMessage(feedback, 'Perfect choice!', 'success');
        return true;
    }

    showValidationMessage(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `form-feedback ${type}`;
    }

    updateSubmitButton() {
        const isNameValid = this.validateName();
        const isWishValid = this.validateWishSelection();
        const isFormValid = isNameValid && isWishValid;
        
        if (this.submitBtn) {
            this.submitBtn.disabled = !isFormValid || this.userHasSubmitted;
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.userHasSubmitted) {
            this.showToast('You have already submitted a wish!');
            return;
        }

        const formData = new FormData(this.form);
        const userName = formData.get('userName')?.trim();
        const wishMessage = formData.get('wishMessage');

        if (!userName || !wishMessage) {
            this.showToast('Please fill in all fields!');
            return;
        }

        // Check if user already submitted (by name)
        if (this.wishes.some(wish => wish.userName.toLowerCase() === userName.toLowerCase())) {
            this.showToast('Someone with this name has already sent a wish!');
            return;
        }

        this.submitWish(userName, wishMessage);
    }

    submitWish(userName, wishMessage) {
        const newWish = {
            id: Date.now(),
            userName: userName,
            message: wishMessage,
            timestamp: new Date().toISOString(),
            submittedAt: new Date().toLocaleString()
        };

        // Add to wishes array
        this.wishes.unshift(newWish); // Add to beginning for latest first
        
        // Save to localStorage
        this.saveWishesToStorage();
        
        // Mark user as submitted
        this.userHasSubmitted = true;
        this.currentUserName = userName;
        localStorage.setItem('userSubmittedWish', 'true');
        localStorage.setItem('submittedUserName', userName);
        
        // Update UI
        this.showFormSubmittedState();
        this.renderWishes();
        this.updateStats();
        this.showToast('Your wish has been sent successfully!');
        
        // Scroll to wishes section
        setTimeout(() => {
            this.scrollToWishes();
        }, 1000);
    }

    showFormSubmittedState() {
        if (this.form && this.alreadySubmitted) {
            this.form.style.display = 'none';
            this.alreadySubmitted.style.display = 'block';
        }
    }

    checkUserSubmissionStatus() {
        const hasSubmitted = localStorage.getItem('userSubmittedWish') === 'true';
        const submittedName = localStorage.getItem('submittedUserName');
        
        if (hasSubmitted && submittedName) {
            this.userHasSubmitted = true;
            this.currentUserName = submittedName;
            this.showFormSubmittedState();
        }
    }

    renderWishes() {
        if (!this.wishesGrid) return;

        // Clear existing wishes
        this.wishesGrid.innerHTML = '';

        // Show/hide empty state
        if (this.emptyWishes) {
            this.emptyWishes.style.display = this.wishes.length === 0 ? 'block' : 'none';
        }

        if (this.wishes.length === 0) {
            this.updateToggleButton();
            return;
        }

        // Determine how many wishes to show
        const wishesToShow = this.showingAllWishes ? 
            this.wishes : 
            this.wishes.slice(0, this.maxVisibleWishes);

        // Render wishes
        wishesToShow.forEach((wish, index) => {
            const wishCard = this.createWishCard(wish, index);
            this.wishesGrid.appendChild(wishCard);
        });

        this.updateToggleButton();
        this.updateVisibleWishesCount();
    }

    createWishCard(wish, index) {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());

        // Get user initials for avatar
        const initials = this.getUserInitials(wish.userName);
        
        // Check if this is the current user's wish
        const isCurrentUser = wish.userName.toLowerCase() === this.currentUserName.toLowerCase();
        
        card.innerHTML = `
            <div class="wish-header">
                <div class="wish-avatar">${initials}</div>
                <div class="wish-user-info">
                    <div class="wish-user-name">
                        ${this.escapeHtml(wish.userName)}
                        ${isCurrentUser ? '<span style="color: #667eea; font-size: 0.8rem;">(You)</span>' : ''}
                    </div>
                    <div class="wish-timestamp">${wish.submittedAt}</div>
                </div>
            </div>
            <div class="wish-message">${this.escapeHtml(wish.message)}</div>
        `;

        return card;
    }

    getUserInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleWishesDisplay() {
        this.showingAllWishes = !this.showingAllWishes;
        this.renderWishes();
        
        // Scroll to wishes if showing all
        if (this.showingAllWishes) {
            this.scrollToWishes();
        }
    }

    updateToggleButton() {
        if (!this.toggleBtn) return;

        const hasMoreWishes = this.wishes.length > this.maxVisibleWishes;
        
        if (hasMoreWishes) {
            this.toggleBtn.style.display = 'flex';
            const icon = this.toggleBtn.querySelector('i');
            const text = this.toggleBtn.querySelector('span');
            
            if (this.showingAllWishes) {
                icon.className = 'fas fa-eye-slash';
                text.textContent = 'Show Less';
            } else {
                icon.className = 'fas fa-eye';
                text.textContent = 'Show All Wishes';
            }
        } else {
            this.toggleBtn.style.display = 'none';
        }
    }

    updateVisibleWishesCount() {
        if (this.visibleWishesCount) {
            const visibleCount = this.showingAllWishes ? 
                this.wishes.length : 
                Math.min(this.wishes.length, this.maxVisibleWishes);
            this.visibleWishesCount.textContent = visibleCount;
        }
    }

    updateStats() {
        if (this.totalWishesDisplay) {
            this.totalWishesDisplay.textContent = this.wishes.length;
        }
        
        if (this.totalWishesCount) {
            this.totalWishesCount.textContent = this.wishes.length;
        }

        // Show clear button if there are wishes (for admin/debug)
        if (this.clearBtn) {
            this.clearBtn.style.display = this.wishes.length > 0 ? 'flex' : 'none';
        }
    }

    scrollToWishes() {
        const wishesSection = document.querySelector('.wishes-display-section');
        if (wishesSection) {
            wishesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showToast(message) {
        if (!this.successToast) return;

        const toastText = this.successToast.querySelector('span');
        if (toastText) {
            toastText.textContent = message;
        }

        this.successToast.classList.add('show');
        
        setTimeout(() => {
            this.successToast.classList.remove('show');
        }, 3000);
    }

    clearAllWishes() {
        if (confirm('Are you sure you want to clear all wishes? This action cannot be undone.')) {
            this.wishes = [];
            this.userHasSubmitted = false;
            this.currentUserName = '';
            
            // Clear localStorage
            localStorage.removeItem('birthdayWishes');
            localStorage.removeItem('userSubmittedWish');
            localStorage.removeItem('submittedUserName');
            
            // Reset form
            if (this.form && this.alreadySubmitted) {
                this.form.style.display = 'block';
                this.alreadySubmitted.style.display = 'none';
                this.form.reset();
            }
            
            this.renderWishes();
            this.updateStats();
            this.showToast('All wishes have been cleared!');
        }
    }

    saveWishesToStorage() {
        try {
            localStorage.setItem('birthdayWishes', JSON.stringify(this.wishes));
        } catch (error) {
            console.error('Failed to save wishes to localStorage:', error);
        }
    }

    loadWishesFromStorage() {
        try {
            const saved = localStorage.getItem('birthdayWishes');
            if (saved) {
                this.wishes = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load wishes from localStorage:', error);
            this.wishes = [];
        }
    }
}

// Global function for scroll to wishes (called from HTML)
function scrollToWishes() {
    if (window.wishingWall) {
        window.wishingWall.scrollToWishes();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishingWall = new WishingWall();
});

// Export for external use
window.WishingWall = WishingWall;
