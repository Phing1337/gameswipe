import { Game, mockGames } from './gameData.js';

export class GameService {
    constructor() {
        this.games = [];
        this.currentIndex = 0;
        this.isLoading = false;
        this.queueSize = 5; // Number of games to keep in queue
    }

    async initialize() {
        // For now, load mock data
        // Later this will fetch from Steam API
        this.games = mockGames.map(data => new Game(data));
    }

    getCurrentGame() {
        return this.games[this.currentIndex] || null;
    }

    getNextGame() {
        const nextIndex = (this.currentIndex + 1) % this.games.length;
        return this.games[nextIndex] || null;
    }

    moveToNextGame() {
        this.currentIndex = (this.currentIndex + 1) % this.games.length;
        return true;
    }

    resetGames() {
        this.currentIndex = 0;
    }

    getQueuedGames() {
        const queuedGames = [];
        for (let i = 0; i < this.queueSize; i++) {
            const index = (this.currentIndex + i) % this.games.length;
            queuedGames.push(this.games[index]);
        }
        return queuedGames;
    }

    hasMoreGames() {
        // Always return true since we're infinitely looping
        return true;
    }

    // Future Steam API integration methods
    async fetchGamesFromSteam() {
        // TODO: Implement Steam API integration
        throw new Error('Steam API integration not implemented yet');
    }
}

// Create and export singleton instance
export const gameService = new GameService();
