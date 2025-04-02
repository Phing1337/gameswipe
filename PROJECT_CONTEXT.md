# Gaming Tinder - Project Context

## Project Overview
This project appears to be a Tinder-like application for video games, allowing users to swipe through and discover games they might be interested in playing.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Architecture: Modular JavaScript with component-based structure
- API Integration: Planned Steam API integration (not yet implemented)

## Key Components
1. **GameService (data/gameService.js)**
   - Manages game data and queue system
   - Currently using mock data with plans for Steam API integration
   - Implements queue system with 5 games at a time
   - Handles game navigation (current, next, reset)

2. **Components Structure**
   - CardManager.js - Likely handles the swipe card interface
   - Other components to be documented as discovered

3. **Data Management**
   - gameData.js - Contains game model and mock data
   - steamAPI.js - Placeholder for future Steam integration
   - gameService.js - Service layer for game data management

## Current State
- Basic structure implemented
- Using mock data for games
- Queue system implemented with circular navigation
- Steam API integration planned but not implemented

## UI Features & Interactions
- Interactive card-based UI with swipe gestures
- Support for both touch and mouse interactions
- Smooth animations and transitions between cards
- Video preview functionality with mute/unmute controls
- Card preview system showing upcoming game
- Responsive design with mobile-first approach

## Game Card Features
- High-quality game images and video previews
- Game metadata display:
  - Title
  - Release date
  - Genre
  - Platform tags
  - Description
  - Price with discount support
- Interactive video controls
- Dynamic price display with discount calculations

## Technical Implementation Details
1. **Card Management**
   - Double buffer system (current and next card)
   - Smooth transition animations
   - Physics-based swipe animations
   - Gesture threshold detection
   - Video autoplay management
   - Scale and opacity transitions for depth effect

2. **Performance Optimizations**
   - RequestAnimationFrame for smooth animations
   - Efficient event listener management
   - Touch event optimizations
   - Video playback optimization

## Current Focus Areas
- [ ] Polish swipe interactions and animations
- [ ] Optimize video loading and playback
- [ ] Implement Steam API integration
- [ ] Add user preferences and game recommendations
- [ ] Implement game filtering and sorting options

## Application Features
1. **Multi-View Navigation**
   - Discover view (main swiping interface)
   - History view (previously skipped games)
   - Wishlist view (saved games)
   - Smooth view transitions with slide animations
   - Keyboard navigation support

2. **Game Management**
   - Wishlist functionality
   - Skip history tracking
   - Game reconsideration (moving from skipped to wishlist)
   - Persistent game queuing system

3. **User Experience**
   - Loading states with animations
   - Haptic feedback on actions
   - Keyboard shortcuts:
     - Arrow Up/Down: Wishlist/Skip game
     - Arrow Left/Right: Navigate views
     - Escape: Return to discover view

## Application Architecture
1. **Core Components**
   - App.js: Main application controller
   - CardManager.js: UI interaction manager
   - GameService.js: Game data and state management
   - GameData.js: Data models and mock data

2. **State Management**
   - Maintains separate lists for:
     - Wishlisted games
     - Skipped games
     - Current game queue
   - View state management
   - Animation state tracking

3. **Event System**
   - Touch/mouse interaction handlers
   - Keyboard controls
   - View navigation events
   - Game state change handlers

## Development Roadmap
1. **Immediate Tasks**
   - [ ] Complete Steam API integration
   - [ ] Add user preferences system
   - [ ] Implement game filtering
   - [ ] Add game search functionality

2. **Enhancement Opportunities**
   - [ ] Add game categories/tags
   - [ ] Implement user accounts
   - [ ] Add social sharing features
   - [ ] Integrate with Steam wishlist
   - [ ] Add game recommendations based on choices

3. **Technical Improvements**
   - [ ] Implement data persistence
   - [ ] Add offline support
   - [ ] Optimize image/video loading
   - [ ] Add error handling and recovery

## Steam API Integration Status
1. **Current Implementation**
   - Basic API client structure in place
   - Environment-based API key configuration
   - Endpoints configured:
     - Featured games retrieval
     - Game details fetching
   - Data transformation utilities for Steam format

2. **Missing Components**
   - API key configuration/management
   - Data transformation implementation
   - Error handling and rate limiting
   - Caching mechanism for API responses
   - Pagination/infinite scrolling support

3. **Integration Tasks**
   - [ ] Set up Steam API key management
   - [ ] Complete data transformation layer
   - [ ] Implement request caching
   - [ ] Add error recovery and fallback to mock data
   - [ ] Add request rate limiting
   - [ ] Implement pagination for game fetching