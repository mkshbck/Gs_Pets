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

let petConfigData = null;
const selectedPet = localStorage.getItem('selectedPet') || 'kitty';

function getPetImagePath(state) {
    return `images/animals/${selectedPet}/pet-${state}.png`;
}

// --- MODIFIED FUNCTION: Accessory Shifting by State ---
// Now takes the pet state (e.g., 'eating', 'play', 'neutral') as an argument
function applyShiftsByState(state) {
    if (!petConfigData) return;

    // Construct the filename that the config.json uses (e.g., 'pet-eating.png')
    const filename = `pet-${state}.png`; 
    
    const accessories = [
        { id: 'hat-overlay', category: 'hat' },
        { id: 'cape-overlay', category: 'cape' },
        { id: 'glasses-overlay', category: 'glasses' }
    ];

    accessories.forEach(acc => {
        const element = document.getElementById(acc.id);
        if (element) {
            const shiftData = petConfigData[acc.category]?.[filename] || { x: 0, y: 0, r: 0 };
            
            const shiftX = shiftData.x || 0;
            const shiftY = shiftData.y || 0;
            const rotate = shiftData.r || 0;
            
            // Apply the combined transformation
            element.style.transform = 
                `translateX(${shiftX}%) translateY(${shiftY}%) rotate(${rotate}deg)`;
        }
    });
}
// ----------------------------------------------------


async function loadPetConfig() {
    const configPath = `images/animals/${selectedPet}/config.json`;
    try {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error(`Failed to load config for ${selectedPet}. Status: ${response.status}`);
        }
        petConfigData = await response.json();
        console.log("Pet configuration loaded successfully:", petConfigData);
        updateStats();
    } catch (error) {
        console.error("Error loading pet config:", error);
    }
}
loadPetConfig();


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
            if (!existingEl) {
                const outfitOverlay = document.createElement('img');
                outfitOverlay.id = item.id;
                outfitOverlay.src = savedSrc;
                petDisplayEl.appendChild(outfitOverlay);
            } else {
                existingEl.src = savedSrc;
            }
        } else {
            if (existingEl) {
                 existingEl.remove();
            }
        }
    });
}
loadOutfitsToMainPage();

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
    let petState;
    
    // 1. DETERMINE CURRENT PET STATE (This logic determines the default state)
    if (isDead) {
        petState = 'dead';
    } else if (weight > 75) {
        petState = 'fat'; 
    } else if (strength > 75) {
        petState = 'strong'; 
    } else if (hunger <= 30) {
        petState = 'hungry';
    } else if (happiness <= 30) {
        petState = 'sad';
    } else {
        petState = 'neutral';
    }

    // 2. APPLY SHIFTS: Shift accessories BEFORE changing the image source
    applyShiftsByState(petState);

    // 3. Set the final image source
    petImageEl.src = getPetImagePath(petState);
}

function checkPetStatus() {
    if (hunger <= 0 || happiness <= 0 || weight >= 100) {
        isDead = true;
        alert('Your pet has passed away!');
        feedBtn.disabled = true;
        playBtn.disabled = true;
        updatePetImage();
        clearInterval(petInterval);
    }
}

// Event listeners for buttons - SHIFTING LOGIC CORRECTED
feedBtn.addEventListener('click', () => {
    // 1. Update stats (in memory)
    if (hunger < 100) {
        hunger += 10;
        if (hunger > 100) {
            hunger = 100;
            weight += 5; 
        }
    }
    
    // 2. SHIFT ACCESSORIES FOR THE ANIMATION STATE
    applyShiftsByState('eating');
    
    // 3. Set the eating image for the animation (This now happens after shifting)
    petImageEl.src = getPetImagePath('eating');
    
    // 4. Update stats display and revert to final state after delay
    setTimeout(() => {
        updateStats(); // This calls updatePetImage() to determine and set the new default state
    }, 1000);
});

playBtn.addEventListener('click', () => {
    // 1. Update stats (in memory)
    if (happiness < 100) {
        happiness += 10;
        if (happiness > 100) {
            happiness = 100;
            strength += 5; 
        }
    }
    
    // 2. SHIFT ACCESSORIES FOR THE ANIMATION STATE
    applyShiftsByState('play');
    
    // 3. Set the play image for the animation (This now happens after shifting)
    petImageEl.src = getPetImagePath('play');
    
    // 4. Update stats display and revert to final state after delay
    setTimeout(() => {
        updateStats(); // This calls updatePetImage() to determine and set the new default state
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
