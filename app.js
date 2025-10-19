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

// NEW: Variable to hold the loaded configuration data for the current pet
let petConfigData = null;

// NEW: Get the currently selected pet type from localStorage
const selectedPet = localStorage.getItem('selectedPet') || 'kitty';

// Helper function to dynamically build the path for the current pet
function getPetImagePath(state) {
    // Returns path with the "pet-" prefix, e.g., 
'images/animals/kitty/pet-neutral.png'
    return `images/animals/${selectedPet}/pet-${state}.png`;
}

// --- NEW FUNCTION: Load Pet Configuration ---
async function loadPetConfig() {
    const configPath = `images/animals/${selectedPet}/config.json`;
    try {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error(`Failed to load config for ${selectedPet}. 
Status: ${response.status}`);
        }
        petConfigData = await response.json();
        console.log("Pet configuration loaded successfully:", 
petConfigData);
        // Once config is loaded, update image and outfits to apply initial offsets
        updateStats();
    } catch (error) {
        console.error("Error loading pet config:", error);
        // Fallback: If config fails to load, accessories won't shift, but game will continue.
    }
}
loadPetConfig(); // Execute on script load
// ------------------------------------------


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
    
    // --- DETERMINE CURRENT PET STATE IMAGE ---
    // Uses the new helper function: getPetImagePath('state')
    if (isDead) {
        currentImageSrc = getPetImagePath('dead');
    } else if (weight > 75) {
        currentImageSrc = getPetImagePath('fat'); 
    } else if (strength > 75) {
        currentImageSrc = getPetImagePath('strong'); 
    } 
    // CHANGE: Threshold updated from 30 to 50
    else if (hunger <= 50) {
        currentImageSrc = getPetImagePath('hungry');
    } 
    // CHANGE: Threshold updated from 30 to 50
    else if (happiness <= 50) {
        currentImageSrc = getPetImagePath('sad');
    } else {
        currentImageSrc = getPetImagePath('neutral');
    }

    petImageEl.src = currentImageSrc;

    // 2. APPLY SHIFTS TO ALL ACCESSORIES
    if (petConfigData) {
        // Extract the filename (e.g., 'pet-neutral.png')
        const filename = currentImageSrc.split('/').pop(); 
        
        const accessories = [
            { id: 'hat-overlay', category: 'hat' },
            { id: 'cape-overlay', category: 'cape' },
            { id: 'glasses-overlay', category: 'glasses' }
        ];

        accessories.forEach(acc => {
            const element = document.getElementById(acc.id);
            if (element) {
                // Get the offset from the loaded JSON data
                const shiftY = petConfigData[acc.category]?.[filename] || 
0;
                
                // Apply the vertical shift using CSS transform: 
translateY
                element.style.transform = `translateY(${shiftY}%)`;
            }
        });
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
        updateStats(); // <--- This runs updatePetImage() immediately
    }
    // Set the eating image for the animation
    petImageEl.src = getPetImagePath('eating'); 
    setTimeout(() => {
        updateStats(); // <--- This runs updatePetImage() to set the final 
state
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
        updateStats(); // <--- This runs updatePetImage() immediately
    }
    // Set the play image for the animation
    petImageEl.src = getPetImagePath('play'); 
    setTimeout(() => {
        updateStats(); // <--- This runs updatePetImage() to set the final 
state
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
