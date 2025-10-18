// dress-up.js

// Use DOMContentLoaded to ensure the script only runs after all HTML elements exist
document.addEventListener('DOMContentLoaded', () => {
    
    const outfitItems = document.querySelectorAll('.outfit-item');
    const hatOverlayEl = document.getElementById('hat-overlay');
    const capeOverlayEl = document.getElementById('cape-overlay');
    const glassesOverlayEl = document.getElementById('glasses-overlay');
    const removeAllBtn = document.getElementById('remove-all-btn'); 

    // --- Dynamic Pet Image Setup ---
    const basePetImageEl = document.getElementById('base-pet-image');
    
    // IMPORTANT: Fetch the selected pet type. Default to 'kitty' if none is set.
    const selectedPet = localStorage.getItem('selectedPet') || 'kitty';

    // Set the base pet image source using the dynamic pet type and the 'pet-neutral.png' file
    basePetImageEl.src = `images/animals/${selectedPet}/pet-neutral.png`;
    // -------------------------------
    

    // Helper function to get the category from the data-outfit attribute
    function getCategory(outfitId) {
        if (outfitId.startsWith('hat')) return 'hat';
        if (outfitId.startsWith('cape')) return 'cape';
        if (outfitId.startsWith('glasses')) return 'glasses';
        return null;
    }

    // Function to load the saved outfits and control visibility
    function loadSavedOutfits() {
        const hatSrc = localStorage.getItem('petHat');
        const capeSrc = localStorage.getItem('petCape');
        const glassesSrc = localStorage.getItem('petGlasses');

        // Display/Hide each item based on local storage
        if (hatSrc) { hatOverlayEl.src = hatSrc; hatOverlayEl.style.display = 'block'; } else { hatOverlayEl.style.display = 'none'; }
        if (capeSrc) { capeOverlayEl.src = capeSrc; capeOverlayEl.style.display = 'block'; } else { capeOverlayEl.style.display = 'none'; }
        if (glassesSrc) { glassesOverlayEl.src = glassesSrc; glassesOverlayEl.style.display = 'block'; } else { glassesOverlayEl.style.display = 'none'; }
    }

    loadSavedOutfits(); // Load all three items on page load

    // Add click listeners to outfit items
    outfitItems.forEach(item => {
        item.addEventListener('click', () => {
            const outfitId = item.getAttribute('data-outfit'); // e.g., 'hat-1'
            const category = getCategory(outfitId); // e.g., 'hat'
            const outfitSrc = `images/outfit-${outfitId}.png`; // e.g., 'images/outfit-hat-1.png'
            
            let overlayEl, storageKey;

            if (category === 'hat') {
                overlayEl = hatOverlayEl;
                storageKey = 'petHat';
            } else if (category === 'cape') {
                overlayEl = capeOverlayEl;
                storageKey = 'petCape';
            } else if (category === 'glasses') {
                overlayEl = glassesOverlayEl;
                storageKey = 'petGlasses';
            }

            // Update the specific overlay image and save
            if (overlayEl) {
                overlayEl.src = outfitSrc;
                overlayEl.style.display = 'block';
                localStorage.setItem(storageKey, outfitSrc); // Save to the specific key
            }
        });
    });

    // Add click listener to the remove all button
    removeAllBtn.addEventListener('click', () => {
        // Clear all overlays visually
        hatOverlayEl.style.display = 'none';
        capeOverlayEl.style.display = 'none';
        glassesOverlayEl.style.display = 'none';
        
        // Clear all storage keys
        localStorage.removeItem('petHat');
        localStorage.removeItem('petCape');
        localStorage.removeItem('petGlasses');
    });

}); // End of DOMContentLoaded