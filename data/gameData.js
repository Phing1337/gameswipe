// Game data interface and types
export class Game {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.video = data.video;
        this.releaseDate = data.releaseDate;
        this.platforms = data.platforms;
        this.genre = data.genre;
        this.description = data.description;
        this.price = data.price;
        this.discount = data.discount;
    }
}

// Updated mock data with YouTube videos
export const mockGames = [
    {
        id: 1,
        title: "Halo Infinite",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/ss_c31322c3073145ec3b87c7bf6171d9075a504923.600x338.jpg",
        video: "https://www.youtube.com/embed/PyMlV5_HRWk",
        releaseDate: "December 8, 2021",
        platforms: ["Xbox Series X|S", "Xbox One", "PC"],
        genre: "First-Person Shooter",
        description: "Master Chief returns in Halo Infinite – the most ambitious Halo game ever made.",
        price: 59.99,
        discount: 20
    },
    {
        id: 2,
        title: "Forza Horizon 5",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_26f6b9f55d2620cd67316413736997e084785b1f.600x338.jpg",
        video: "https://www.youtube.com/embed/FYH9n37B7Yw",
        releaseDate: "November 9, 2021",
        platforms: ["Xbox Series X|S", "Xbox One", "PC"],
        genre: "Racing",
        description: "Lead breathtaking expeditions across the vibrant and ever-evolving open world landscapes of Mexico.",
        price: 59.99,
        discount: 15
    },
    {
        id: 3,
        title: "Starfield",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_c26d646d79337a7761b04a1e86d5511c7f230519.600x338.jpg",
        video: "https://www.youtube.com/embed/Hs-1_H-XVcE",
        releaseDate: "September 6, 2023",
        platforms: ["Xbox Series X|S", "PC"],
        genre: "Action RPG",
        description: "Create any character you want and explore with unparalleled freedom as you embark on an epic journey.",
        price: 69.99,
        discount: 0
    },
    {
        id: 4,
        title: "Microsoft Flight Simulator",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/ss_c23048b46c1c33714bd01ecc68595cd91d9124a7.600x338.jpg",
        video: "https://www.youtube.com/embed/TYqJALPVn0Y",
        releaseDate: "July 27, 2021",
        platforms: ["Xbox Series X|S", "PC"],
        genre: "Simulation",
        description: "Experience the world at your fingertips in the most realistic flight simulator ever created.",
        price: 69.99,
        discount: 10
    },
    {
        id: 5,
        title: "Sea of Thieves",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/ss_29c4440e27ed41991fc0a43504c22de825aa8c6c.600x338.jpg",
        video: "https://www.youtube.com/embed/r5JIBaasuE8",
        releaseDate: "March 20, 2018",
        platforms: ["Xbox Series X|S", "Xbox One", "PC"],
        genre: "Action-Adventure",
        description: "Be the pirate you want to be in a shared-world adventure game where every sail on the horizon means a crew of real players.",
        price: 39.99,
        discount: 25
    }
];
