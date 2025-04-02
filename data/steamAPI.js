// Steam Web API configuration
const STEAM_API_URL = 'https://api.steampowered.com';

export class SteamAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // Fetch featured games from Steam
    async getFeaturedGames() {
        try {
            const response = await fetch(`${STEAM_API_URL}/IStoreService/GetFeaturedCategories/v1/?key=${this.apiKey}`);
            if (!response.ok) throw new Error('Failed to fetch featured games');
            const data = await response.json();
            return this.transformSteamGames(data);
        } catch (error) {
            console.error('Steam API Error:', error);
            return [];
        }
    }

    // Get details for specific game by appId
    async getGameDetails(appId) {
        try {
            const response = await fetch(`${STEAM_API_URL}/ISteamApps/GetAppDetails/v1/?key=${this.apiKey}&appids=${appId}`);
            if (!response.ok) throw new Error('Failed to fetch game details');
            const data = await response.json();
            return this.transformGameDetails(data[appId]);
        } catch (error) {
            console.error('Steam API Error:', error);
            return null;
        }
    }

    // Transform Steam game data to our format
    transformSteamGames(steamData) {
        // TODO: Implement data transformation from Steam format to our Game format
        return [];
    }

    // Transform detailed game data
    transformGameDetails(details) {
        if (!details.success) return null;

        return {
            id: details.data.steam_appid,
            title: details.data.name,
            image: details.data.header_image,
            video: details.data.movies?.[0]?.webm?.max || null,
            releaseDate: details.data.release_date?.date || 'TBA',
            platforms: this.getPlatforms(details.data.platforms),
            genre: details.data.genres?.[0]?.description || 'Unknown',
            description: details.data.short_description || '',
            price: details.data.price_overview?.initial || 0,
            discount: details.data.price_overview?.discount_percent || 0
        };
    }

    // Helper to get platforms array
    getPlatforms(platformData) {
        const platforms = [];
        if (platformData.windows) platforms.push('Windows');
        if (platformData.mac) platforms.push('macOS');
        if (platformData.linux) platforms.push('Linux');
        return platforms;
    }
}

// Export singleton instance with empty API key for public GitHub Pages demo
// NOTE: For production use, implement proper API key management using environment variables
// or a backend proxy to protect your API key
export const steamAPI = new SteamAPI('');  // Empty string for public repository
