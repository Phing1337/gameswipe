import { gameService } from './data/gameService.js';
import { CardManager } from './components/CardManager.js';

// App state
const wishlistedGames = [];
const skippedGames = [];
let cardManager;

// DOM Elements
const cardContainer = document.getElementById('card-container');
const showGamesBtn = document.getElementById('show-games');
const showHistoryBtn = document.getElementById('show-history');
const showWishlistBtn = document.getElementById('show-wishlist');
const wishlistGamesContainer = document.getElementById('wishlist-games');
const historyGamesContainer = document.getElementById('history-games');
const navButtons = document.querySelectorAll('.nav-btn');

// Initialize the app
async function initApp() {
    if (!cardContainer) {
        console.error('Card container not found!');
        return;
    }
    
    // Initialize game service
    await gameService.initialize();
    
    // Initialize card manager
    cardManager = new CardManager(cardContainer);
    
    // Set up event listeners
    setupEventListeners();
    
    // Start with first cards after a short delay to ensure DOM is ready
    setTimeout(() => {
        displayCards();
    }, 100);
}

// Load games with a slight delay to show loading state
function renderNextCard(showLoading = true) {
    if (!gameService.hasMoreGames()) {
        cardContainer.innerHTML = `
            <div class="end-message">
                <h3>No more games to show!</h3>
                <button id="reset-btn" class="reset-btn">Start Over</button>
            </div>`;
        document.getElementById('reset-btn').addEventListener('click', resetCards);
        return;
    }

    if (showLoading) {
        const loadingCard = document.createElement('div');
        loadingCard.className = 'loading-card';
        cardContainer.appendChild(loadingCard);

        setTimeout(() => {
            // Check if loading card is still in the DOM before trying to remove it
            if (loadingCard.parentNode === cardContainer) {
                cardContainer.removeChild(loadingCard);
            }
            displayCards();
        }, 500);
    } else {
        displayCards();
    }
}

function displayCards() {
    const queuedGames = gameService.getQueuedGames();
    cardManager.updateCardQueue(queuedGames);
}

// Navigation functions
function showView(viewId) {
    const currentView = document.querySelector('.view.active');
    const nextView = document.getElementById(`${viewId}-view`);
    
    if (!nextView || currentView === nextView) return;

    // Determine direction based on navigation
    const views = ['history', 'discover', 'wishlist'];
    const currentIndex = views.indexOf(currentView.id.replace('-view', ''));
    const nextIndex = views.indexOf(viewId);
    const direction = nextIndex > currentIndex ? 'right' : 'left';

    // Remove all existing slide classes
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('slide-left', 'slide-right');
    });

    // Add appropriate slide class to current view
    if (currentView) {
        currentView.classList.add(direction === 'right' ? 'slide-left' : 'slide-right');
        currentView.classList.remove('active');
    }

    // Position new view and activate it
    nextView.classList.remove('slide-left', 'slide-right');
    nextView.classList.add('active');

    // Update active nav button
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Special case for "discover" view which uses the "games" nav button
    if (viewId === 'discover') {
        document.getElementById('show-games').classList.add('active');
    } else {
        document.getElementById(`show-${viewId}`).classList.add('active');
    }
}

function navigateToDiscover() {
    showView('discover');
}

// Add haptic feedback if available
function triggerHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Skip the current game
// Make functions globally available
window.skipGame = function skipGame() {
    triggerHapticFeedback();
    const currentGame = gameService.getCurrentGame();
    skippedGames.push(currentGame);
    
    gameService.moveToNextGame();
    displayCards(); // This will now update the entire queue
    updateHistoryView();
}

// Add current game to wishlist
window.addToWishlist = function addToWishlist() {
    triggerHapticFeedback();
    const currentGame = gameService.getCurrentGame();
    wishlistedGames.push(currentGame);
    
    gameService.moveToNextGame();
    displayCards(); // This will now update the entire queue
    updateWishlistView();
}

// Reset to first game
function resetCards() {
    gameService.resetGames();
    cardContainer.innerHTML = '';
    renderNextCard();
}

// Update the wishlist view
function updateWishlistView() {
    if (wishlistedGames.length === 0) {
        wishlistGamesContainer.innerHTML = '<p class="empty-state">No games wishlisted yet!</p>';
        return;
    }
    
    wishlistGamesContainer.innerHTML = '';
    
    wishlistedGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'saved-game';
        gameElement.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="saved-game-img">
            <div class="saved-game-info">
                <h3 class="saved-game-title">${game.title}</h3>
                <div class="saved-game-meta">
                    ${game.platforms.join(', ')} • ${game.genre}
                </div>
                <div class="game-price">
                    ${game.discount > 0 
                        ? `<span class="discounted-price">$${(game.price * (1 - game.discount/100)).toFixed(2)}</span>
                           <span class="discount-badge">-${game.discount}%</span>`
                        : `<span>$${game.price.toFixed(2)}</span>`
                    }
                </div>
            </div>
        `;
        wishlistGamesContainer.appendChild(gameElement);
    });
}

// Update the history view
function updateHistoryView() {
    if (skippedGames.length === 0) {
        historyGamesContainer.innerHTML = '<p class="empty-state">No game history yet!</p>';
        return;
    }
    
    historyGamesContainer.innerHTML = '';
    
    skippedGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'saved-game';
        gameElement.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="saved-game-img">
            <div class="saved-game-info">
                <h3 class="saved-game-title">${game.title}</h3>
                <div class="saved-game-meta">
                    ${game.platforms.join(', ')} • ${game.genre}
                </div>
                <button class="reconsider-btn" data-id="${game.id}">Add to Wishlist</button>
            </div>
        `;
        historyGamesContainer.appendChild(gameElement);
    });
    
    // Add event listeners for reconsider buttons
    document.querySelectorAll('.reconsider-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            reconsiderGame(gameId);
        });
    });
}

// Move a game from skipped to wishlist
function reconsiderGame(gameId) {
    const gameIndex = skippedGames.findIndex(game => game.id === gameId);
    if (gameIndex !== -1) {
        const game = skippedGames.splice(gameIndex, 1)[0];
        wishlistedGames.push(game);
        updateHistoryView();
        updateWishlistView();
    }
}

// Set up general event listeners
function setupEventListeners() {
    // Navigation
    showGamesBtn.addEventListener('click', () => showView('discover'));
    showHistoryBtn.addEventListener('click', () => showView('history'));
    showWishlistBtn.addEventListener('click', () => showView('wishlist'));
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        if (cardManager.isAnimating) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                showView('history');
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                // Handle swipe in the games view only
                if (document.getElementById('discover-view').classList.contains('active')) {
                    if (e.key === 'ArrowUp') addToWishlist();
                    if (e.key === 'ArrowDown') skipGame();
                }
                break;
            case 'ArrowRight':
                showView('wishlist');
                break;
            case 'Escape':
                navigateToDiscover();
                break;
        }
    });

    // Remove the incorrect CardManager setup
    const discoverView = document.getElementById('discover-view');
    if (discoverView) {
        // The CardManager already handles its own swipe setup in updateCardQueue
        renderNextCard(true);
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
