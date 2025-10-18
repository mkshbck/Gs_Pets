// Pet's properties
let hunger = 100;
let happiness = 100;
let age = 0;
let isDead = false;
let weight = 50; 
let strength = 50; 

// DOM elements
const petDisplayEl = document.querySelector('.pet-display');
const hungerEl = document.getElementById('hunger-level');
const happinessEl = document.getElementById('happiness-level');
const ageEl = document.getElementById('age-level');
const weightEl = document.getElementById('weight-level');
const strengthEl = document.getElementById('strength-level');
const petImageEl = document.getElementById('pet-image');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// NEW: Get the currently selected pet type from localStorage
const selectedPet = localStorage.getItem('selectedPet') || 'kitty';

// Helper function to dynamically build the path for the current pet
function getPetImagePath(state) {
    // Returns path with the "pet-" prefix, e.g., 
'images/animals/kitty/pet-neutral.png'
    return `images/animals/${selectedPet}/pet-${state}.png`;
}

// --- GLASSES SHIFT DATA (Keys use "pet-" prefix) ---
const glassesVerticalOffsets = {
    'pet-strong.png': 0,    // 60% (Baseline)
    'pet-play.png': -1,     // 59% -> 1% shift up
    'pet-sad.png': -6,      // 54% -> 6% shift up
    'pet-fat.png': -6,      // 54% -> 6% shift up
    'pet-eating.png': -6,   // 54% -> 6% shift up
    'pet-hungry.png': -8,   // 52% -> 8% shift up
    'pet-neutral.png': -10, // 50% -> 10% shift up
    'pet-dead.png': -19     // 41% -> 19% shift up
};
// --------------------------


// --- OUTFIT OVERLAY SETUP FOR MAIN PAGE (MULTI-ITEM LOGIC) ---
function loadOutfitsToMainPage() {
    const outfitKeys = [
        { key: 'petHat', id: 'hat-overlay' },
        { key: 'petCape', id: 'cape-overlay' },
        { key: 'petGlasses', id: 'glasses-overlay' }
    ];

    outfitKeys.forEach(item => {
        const savedSrc = localStorage.getItem(item.key);
        const existingEl = document.getElementById(item.id);

        if (savedSrc) {
            // Create element if it doesn't exist
            if (!existingEl) {
                const outfitOverlay = document.createElement('img');
                outfitOverlay.id = item.id;
                outfitOverlay.src = savedSrc;
                petDisplayEl.appendChild(outfitOverlay);
            } else {
                // Update element if it exists
                existingEl.src = savedSrc;
            }
        } else {
            // Remove the element if the item was removed from storage
            if (existingEl) {
                 existingEl.remove();
            }
        }
    });
}
loadOutfitsToMainPage();
// -------------------------------------------------------------

// Update pet's stats on the screen
function updateStats() {
    hungerEl.textContent = `${hunger}%`;
    happinessEl.textContent = `${happiness}%`;
    ageEl.textContent = `${age}`;
    weightEl.textContent = `${weight} lbs`;
    strengthEl.textContent = `${strength} strength`;
    updatePetImage();
    checkPetStatus();
}

// Change pet image based on its state, including weight and strength
function updatePetImage() {
    let currentImageSrc;
    let glassesElement = document.getElementById('glasses-overlay');
    
    // --- DETERMINE CURRENT PET STATE IMAGE ---
    // Uses the new helper function: getPetImagePath('state')
    if (isDead) {
        currentImageSrc = getPetImagePath('dead');
    } else if (weight > 75) {
        currentImageSrc = getPetImagePath('fat'); 
    } else if (strength > 75) {
        currentImageSrc = getPetImagePath('strong'); 
    } else if (hunger <= 30) {
        currentImageSrc = getPetImagePath('hungry');
    } else if (happiness <= 30) {
        currentImageSrc = getPetImagePath('sad');
    } else {
        currentImageSrc = getPetImagePath('neutral');
    }

    petImageEl.src = currentImageSrc;

    // --- GLASSES SHIFT LOGIC ---
    if (glassesElement) {
        // Extract the filename (e.g., 'pet-neutral.png')
        const filename = currentImageSrc.split('/').pop(); 
        
        // Find the offset using the filename with "pet-" prefix
        const offsetPercent = glassesVerticalOffsets[filename] || 0;
        
        // Apply the vertical shift using CSS transform: translateY
        glassesElement.style.transform = `translateY(${offsetPercent}%)`;
    }
    // -------------------------------
}

// Check for death conditions
function checkPetStatus() {
    // Pet dies if hunger/happiness hits 0 OR if weight hits 100
    if (hunger <= 0 || happiness <= 0 || weight >= 100) {
        isDead = true;
        alert('Your pet has passed away!');
        feedBtn.disabled = true;
        playBtn.disabled = true;
        updatePetImage();
        clearInterval(petInterval);
    }
}

// Event listeners for buttons
feedBtn.addEventListener('click', () => {
    if (hunger < 100) {
        hunger += 10;
        if (hunger > 100) {
            hunger = 100;
            weight += 5; // Pet gains weight if hunger is already full
        }
        updateStats();
    }
    // Uses the new helper function
    petImageEl.src = getPetImagePath('eating'); 
    setTimeout(() => {
        updateStats(); 
    }, 1000);
});

playBtn.addEventListener('click', () => {
    if (happiness < 100) {
        happiness += 10;
        if (happiness > 100) {
            happiness = 100;
            strength += 5; // Pet gains strength if happiness is already 
full
        }
        updateStats();
    }
    // Uses the new helper function
    petImageEl.src = getPetImagePath('play'); 
    setTimeout(() => {
        updateStats(); 
    }, 1000);
});

// The pet's "life" loop (runs every second)
const petInterval = setInterval(() => {
    // Decrease stats over time
    hunger -= 1;
    happiness -= 1;
    
    // Gradually decrease excess weight and strength over time
    if (weight > 50) {
        weight -= 1;
    }
    if (strength > 50) {
        strength -= 1;
    }
    
    // Increase age every 60 seconds (for example)
    if (age % 60 === 0) {
        age++;
    }
    updateStats();
}, 1000);
