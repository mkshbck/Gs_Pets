// dress-up.js

// Use DOMContentLoaded to ensure the script only runs after all HTML elements exist
document.addEventListener('DOMContentLoaded', () => {
    
    const outfitItems = document.querySelectorAll('.outfit-item');
    const hatOverlayEl = document.getElementById('hat-overlay');
    const capeOverlayEl = document.getElementById('cape-overlay');
    const glassesOverlayEl = document.getElementById('glasses-overlay');
    const removeAllBtn = document.getElementById('remove-all-btn'); 

    const basePetImageEl = document.getElementById('base-pet-image');
    const selectedPet = localStorage.getItem('selectedPet') || 'kitty';

    // Set the base pet image source
    basePetImageEl.src = `images/animals/${selectedPet}/pet-neutral.png`;
    
    // --- NEW: Function to load config and apply shifts ---
    async function loadAndApplyShifts() {
        const configPath = `images/animals/${selectedPet}/config.json`;
        try {
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`Failed to load config for ${selectedPet}. Status: ${response.status}`);
            }
            const configData = await response.json();

            // We apply the shifts for the static 'pet-neutral.png' state
            const filename = 'pet-neutral.png'; 

            const accessories = [
                { element: hatOverlayEl, category: 'hat' },
                { element: capeOverlayEl, category: 'cape' },
                { element: glassesOverlayEl, category: 'glasses' }
            ];

            accessories.forEach(acc => {
                const element = acc.element;
                
                // Get the shift object. Default to {x:0, y:0, r:0} if state is missing.
                const shiftData = configData[acc.category]?.[filename] || { x: 0, y: 0, r: 0 };
                
                const shiftX = shiftData.x || 0;
                const shiftY = shiftData.y || 0;
                const rotate = shiftData.r || 0;
                
                // Apply the combined transformation
                element.style.transform = 
                    `translateX(${shiftX}%) translateY(${shiftY}%) rotate(${rotate}deg)`;
            });

        } catch (error) {
            console.error("Error loading pet config for dress-up page:", error);
            // If fetching fails, accessories will remain unshifted (at their default position).
        }
    }
    
    // Execute the shift loading function immediately
    loadAndApplyShifts();
    // -----------------------------------------------------


    // Helper function to get the category from the data-outfit attribute
    function getCategory(outfitId) {
        if (outfitId.startsWith('hat')) return 'hat';
        if (outfitId.startsWith('cape')) return 'cape';
        if (outfitId.startsWith('glasses')) return 'glasses';
        return null;
    }

    // Function to load the saved outfits and control visibility (Remains the same)
    function loadSavedOutfits() {
        const hatSrc = localStorage.getItem('petHat');
        const capeSrc = localStorage.getItem('petCape');
        const glassesSrc = localStorage.getItem('petGlasses');

        if (hatSrc) { hatOverlayEl.src = hatSrc; hatOverlayEl.style.display = 'block'; } else { hatOverlayEl.style.display = 'none'; }
        if (capeSrc) { capeOverlayEl.src = capeSrc; capeOverlayEl.style.display = 'block'; } else { capeOverlayEl.style.display = 'none'; }
        if (glassesSrc) { glassesOverlayEl.src = glassesSrc; glassesOverlayEl.style.display = 'block'; } else { glassesOverlayEl.style.display = 'none'; }
    }

    loadSavedOutfits(); // Load all three items on page load

    // Add click listeners to outfit items (Remains the same)
    outfitItems.forEach(item => {
        item.addEventListener('click', () => {
            const outfitId = item.getAttribute('data-outfit');
            const category = getCategory(outfitId);
            const outfitSrc = `images/outfit-${outfitId}.png`;
            
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

            if (overlayEl) {
                overlayEl.src = outfitSrc;
                overlayEl.style.display = 'block';
                localStorage.setItem(storageKey, outfitSrc);
            }
        });
    });

    // Add click listener to the remove all button (Remains the same)
    removeAllBtn.addEventListener('click', () => {
        hatOverlayEl.style.display = 'none';
        capeOverlayEl.style.display = 'none';
        glassesOverlayEl.style.display = 'none';
        
        localStorage.removeItem('petHat');
        localStorage.removeItem('petCape');
        localStorage.removeItem('petGlasses');
    });

});
