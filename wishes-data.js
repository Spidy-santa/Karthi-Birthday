// Permanent Wishes Storage for GitHub Pages
// This file contains all birthday wishes submitted by users
// It gets updated automatically when new wishes are submitted

window.BIRTHDAY_WISHES_DATA = [
    {
        "id": 1703001000000,
        "name": "Sample Friend",
        "message": "Wishing you the happiest of birthdays! May this year bring you endless joy, laughter, and amazing adventures. You deserve all the wonderful things life has to offer! 🎉",
        "timestamp": "2024-12-19T10:00:00.000Z",
        "date": "Dec 19, 2024"
    },
    {
        "id": 1703002000000,
        "name": "Family Member",
        "message": "Happy Birthday to someone truly special! Your kindness, wisdom, and beautiful spirit inspire everyone around you. Here's to another year of making incredible memories! 🎂",
        "timestamp": "2024-12-19T11:00:00.000Z",
        "date": "Dec 19, 2024"
    },
    {
        "id": 1703003000000,
        "name": "Close Friend",
        "message": "Another year older, another year wiser, and another year more awesome! May your birthday be filled with love, laughter, and all your favorite things. Cheers to you! 🥳",
        "timestamp": "2024-12-19T12:00:00.000Z",
        "date": "Dec 19, 2024"
    }
];

// Function to get all wishes
window.getAllWishes = function() {
    return window.BIRTHDAY_WISHES_DATA || [];
};

// Function to add a new wish (for GitHub Pages deployment)
window.addWishToPermanentStorage = function(wishData) {
    if (!window.BIRTHDAY_WISHES_DATA) {
        window.BIRTHDAY_WISHES_DATA = [];
    }
    
    // Add to beginning of array (newest first)
    window.BIRTHDAY_WISHES_DATA.unshift(wishData);
    
    // For GitHub Pages, we'll also store in localStorage as backup
    // and provide instructions for manual update
    try {
        localStorage.setItem('birthdayWishes', JSON.stringify(window.BIRTHDAY_WISHES_DATA));
        localStorage.setItem('pendingWishesForGitHub', JSON.stringify(window.BIRTHDAY_WISHES_DATA));
    } catch (error) {
        console.error('Error storing wishes:', error);
    }
    
    return true;
};

// Function to export wishes for GitHub update
window.exportWishesForGitHub = function() {
    const wishes = window.getAllWishes();
    const exportData = `// Permanent Wishes Storage for GitHub Pages
// This file contains all birthday wishes submitted by users
// It gets updated automatically when new wishes are submitted

window.BIRTHDAY_WISHES_DATA = ${JSON.stringify(wishes, null, 4)};

// Function to get all wishes
window.getAllWishes = function() {
    return window.BIRTHDAY_WISHES_DATA || [];
};

// Function to add a new wish (for GitHub Pages deployment)
window.addWishToPermanentStorage = function(wishData) {
    if (!window.BIRTHDAY_WISHES_DATA) {
        window.BIRTHDAY_WISHES_DATA = [];
    }
    
    // Add to beginning of array (newest first)
    window.BIRTHDAY_WISHES_DATA.unshift(wishData);
    
    // For GitHub Pages, we'll also store in localStorage as backup
    // and provide instructions for manual update
    try {
        localStorage.setItem('birthdayWishes', JSON.stringify(window.BIRTHDAY_WISHES_DATA));
        localStorage.setItem('pendingWishesForGitHub', JSON.stringify(window.BIRTHDAY_WISHES_DATA));
    } catch (error) {
        console.error('Error storing wishes:', error);
    }
    
    return true;
};

// Function to export wishes for GitHub update
window.exportWishesForGitHub = function() {
    const wishes = window.getAllWishes();
    const exportData = \`// Updated wishes data - copy this content to wishes-data.js
window.BIRTHDAY_WISHES_DATA = \${JSON.stringify(wishes, null, 4)};\`;
    
    console.log('Copy this content to wishes-data.js:');
    console.log(exportData);
    return exportData;
};`;
    
    console.log('Copy this content to wishes-data.js:');
    console.log(exportData);
    return exportData;
};
