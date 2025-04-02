export class CardManager {
    constructor(container) {
        this.container = container;
        this.currentCard = null;
        this.nextCard = null;
        this.isAnimating = false;
        this.isDragging = false;
        this.mouseIsDown = false;
        this.dragState = {
            startX: 0,
            startY: 0,
            translateX: 0,
            translateY: 0,
            initialTouchX: 0,
            initialTouchY: 0
        };
        console.log('CardManager initialized with container:', container);
    }

    createCardElement(game, isPreview = false) {
        const card = document.createElement('div');
        card.className = `game-card${isPreview ? ' next-card' : ''}`;
        card.style.zIndex = isPreview ? '1' : '2';
        
        const content = `
            <div class="media-container">
                <img src="${game.image}" alt="${game.title}" class="game-image">
                <div class="video-container">
                    <video 
                        src="${game.video}"
                        class="game-video"
                        loop
                        playsinline
                        muted
                    ></video>
                </div>
                <div class="video-overlay">
                    <button class="mute-btn" data-game-id="${game.id}">
                        <span class="material-icons">volume_off</span>
                    </button>
                </div>
            <div class="game-info">
                <h2 class="game-title">${game.title}</h2>
                <div class="game-meta">
                    <span>${game.releaseDate}</span>
                    <span>•</span>
                    <span>${game.genre}</span>
                </div>
                <div class="game-platforms">
                    ${game.platforms.map(platform => `<span class="platform-tag">${platform}</span>`).join('')}
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-price">
                    ${game.discount > 0 
                        ? `<span class="original-price">$${game.price.toFixed(2)}</span> 
                           <span class="discounted-price">$${(game.price * (1 - game.discount/100)).toFixed(2)}</span>
                           <span class="discount-badge">-${game.discount}%</span>`
                        : `<span>$${game.price.toFixed(2)}</span>`
                    }
                </div>
                <div class="card-actions">
                    <button class="action-btn ignore-btn">
                        <span class="material-icons">close</span>
                        <span>Skip</span>
                    </button>
                    <button class="action-btn wishlist-btn">
                        <span class="material-icons">favorite</span>
                        <span>Wishlist</span>
                    </button>
                </div>
                </div>
            </div>
        `;
        
        card.innerHTML = content;

        // Set up video and mute button
        const video = card.querySelector('.game-video');
        const muteBtn = card.querySelector('.mute-btn');
        
        if (muteBtn && video) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute(video, muteBtn);
            });
        }

        if (video && !isPreview) {
            video.play().catch(error => console.log('Video autoplay prevented:', error));
        }
        
        return card;
    }

    toggleMute(video, muteBtn) {
        if (!video || !muteBtn) return;
        video.muted = !video.muted;
        muteBtn.innerHTML = `<span class="material-icons">${video.muted ? 'volume_off' : 'volume_up'}</span>`;
    }

    updateCardQueue(games) {
        // Clean up existing listeners before clearing container
        this.cleanupListeners();
        
        // Reset state
        this.isDragging = false;
        this.mouseIsDown = false;
        this.isAnimating = false;
        
        // Clear container
        this.container.innerHTML = '';
        
        // Create cards (maximum 2 cards - current and next)
        const cards = games.slice(0, 2).map((game, index) => {
            return this.createCardElement(game, index > 0);
        });

        // Set references and add to container
        cards.forEach((card, index) => {
            if (index === 0) {
                this.currentCard = card;
            } else {
                this.nextCard = card;
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.8';
            }
            this.container.appendChild(card);
        });

        // Set up drag listeners and action buttons for current card
        if (this.currentCard) {
            // Setup drag listeners and action buttons
            this.setupDragListeners(
                () => window.skipGame(),
                () => window.addToWishlist()
            );

            // Setup the action buttons
            const wishlistBtn = this.currentCard.querySelector('.wishlist-btn');
            const ignoreBtn = this.currentCard.querySelector('.ignore-btn');
            
            if (wishlistBtn && ignoreBtn) {
                wishlistBtn.addEventListener('click', () => {
                    if (!this.isAnimating) {
                        this.animateSwipe('right', () => window.addToWishlist());
                    }
                });
                
                ignoreBtn.addEventListener('click', () => {
                    if (!this.isAnimating) {
                        this.animateSwipe('left', () => window.skipGame());
                    }
                });
            }
        }
    }

    displayCards(currentGame, nextGame) {
        // This method is now just a wrapper for backward compatibility
        const games = [currentGame];
        if (nextGame) games.push(nextGame);
        this.updateCardQueue(games);
    }

    setupDragListeners(onSwipeLeft, onSwipeRight) {
        // Store these function references so we can remove them later
        this._boundStartDrag = (e) => {
            console.log('startDrag called', { 
                type: e.type, 
                isDragging: this.isDragging, 
                isAnimating: this.isAnimating 
            });
            
            if (this.isDragging || this.isAnimating) {
                console.log('Drag prevented - already dragging or animating');
                return;
            }
            
            this.isDragging = true;
            this.isAnimating = false;
            
            if (e.type === 'mousedown') {
                this.mouseIsDown = true;
                e.preventDefault();
            }
            
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            
            this.dragState = {
                startX: touch.clientX,
                startY: touch.clientY,
                translateX: 0,
                translateY: 0,
                initialTouchX: touch.clientX,
                initialTouchY: touch.clientY
            };
            
            console.log('Drag started with state:', this.dragState);
            requestAnimationFrame(() => this.animateCard());
        };

        this._boundDrag = (e) => {
            if (!this.isDragging || (e.type === 'mousemove' && !this.mouseIsDown)) {
                console.log('Drag move ignored - not dragging or mouse not down');
                return;
            }
            
            e.preventDefault();
            
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            const oldTranslateX = this.dragState.translateX;
            this.dragState.translateX = touch.clientX - this.dragState.startX;
            this.dragState.translateY = touch.clientY - this.dragState.startY;
            
            console.log('Drag move:', { 
                deltaX: this.dragState.translateX - oldTranslateX,
                currentX: this.dragState.translateX,
                currentY: this.dragState.translateY
            });
            
            // Update next card position
            if (this.nextCard) {
                const progress = Math.abs(this.dragState.translateX) / window.innerWidth;
                const scale = 0.95 + (progress * 0.05);
                this.nextCard.style.transform = `scale(${scale})`;
                this.nextCard.style.opacity = 0.8 + (progress * 0.2);
            }
        };

        this._boundEndDrag = (e) => {
            console.log('endDrag called', {
                isDragging: this.isDragging,
                mouseIsDown: this.mouseIsDown,
                translateX: this.dragState?.translateX
            });
            
            if (!this.isDragging || (e.type === 'mouseup' && !this.mouseIsDown)) {
                console.log('End drag ignored - not dragging or mouse was not down');
                return;
            }
            
            this.isDragging = false;
            this.mouseIsDown = false;
            this.isAnimating = true;
            
            const threshold = window.innerWidth * 0.15;
            
            if (this.dragState.translateX > threshold) {
                console.log('Threshold reached for right swipe');
                this.animateSwipe('right', onSwipeRight);
            } else if (this.dragState.translateX < -threshold) {
                console.log('Threshold reached for left swipe');
                this.animateSwipe('left', onSwipeLeft);
            } else {
                console.log('Threshold not reached, resetting position');
                this.resetPosition();
            }
        };
        
        this._boundCancelDrag = (e) => {
            console.log('cancelDrag called', {
                isDragging: this.isDragging,
                mouseIsDown: this.mouseIsDown
            });
            
            if (this.isDragging && this.mouseIsDown) {
                this.isDragging = false;
                this.mouseIsDown = false;
                this.resetPosition();
            }
        };

        if (this.currentCard) {
            // Touch events
            this.currentCard.addEventListener('touchstart', this._boundStartDrag, { passive: true });
            document.addEventListener('touchmove', this._boundDrag, { passive: false });
            document.addEventListener('touchend', this._boundEndDrag);
            
            // Mouse events
            this.currentCard.addEventListener('mousedown', this._boundStartDrag);
            document.addEventListener('mousemove', this._boundDrag);
            document.addEventListener('mouseup', this._boundEndDrag);
            document.addEventListener('mouseleave', this._boundCancelDrag);
            
            console.log('Drag listeners set up for card:', this.currentCard);
        } else {
            console.warn('No current card available to set up drag listeners');
        }
    }

    animateCard() {
        if (!this.isDragging || !this.currentCard) {
            console.log('Animation frame skipped - not dragging or no current card');
            return;
        }
        
        const rotation = this.dragState.translateX * 0.1;
        const translateY = Math.abs(this.dragState.translateX) * 0.1;
        
        this.currentCard.style.transform = `translateX(${this.dragState.translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`;
        
        // Visual feedback based on swipe direction
        if (this.dragState.translateX > 50) {
            this.currentCard.classList.add('swiping-right');
            this.currentCard.classList.remove('swiping-left');
        } else if (this.dragState.translateX < -50) {
            this.currentCard.classList.add('swiping-left');
            this.currentCard.classList.remove('swiping-right');
        } else {
            this.currentCard.classList.remove('swiping-left', 'swiping-right');
        }
        
        if (this.isDragging) {
            requestAnimationFrame(() => this.animateCard());
        }
    }

    animateSwipe(direction, callback) {
        if (!this.currentCard) return;
        
        const windowWidth = window.innerWidth;
        const rotation = direction === 'right' ? 30 : -30;
        const translateX = direction === 'right' ? windowWidth * 1.5 : -windowWidth * 1.5;
        
        // Apply the final swipe animation
        this.currentCard.style.transition = 'transform 0.5s ease-out';
        this.currentCard.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
        this.currentCard.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
        
        // Prepare next card animation and start playing video
        if (this.nextCard) {
            this.nextCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            this.nextCard.style.transform = '';
            this.nextCard.style.opacity = '1';
            this.nextCard.classList.remove('next-card');
            
            // Start playing the video of the next card
            const nextVideo = this.nextCard.querySelector('.game-video');
            if (nextVideo && nextVideo.readyState >= 2) {
                nextVideo.play().catch(e => console.log('Could not autoplay next video:', e));
            }
        }
        
        // Wait for animation to complete before cleanup
        setTimeout(() => {
            if (this.currentCard && this.currentCard.parentNode) {
                // Cleanup video before removing card
            const video = this.currentCard.querySelector('.game-video');
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            }
            this.currentCard.parentNode.removeChild(this.currentCard);
            }
            this.currentCard = this.nextCard;
            this.nextCard = null;
            this.isDragging = false;
            this.mouseIsDown = false;
            this.isAnimating = false;
            
            if (callback) callback();
        }, 500);
    }

    resetPosition() {
        if (!this.currentCard) return;
        
        this.currentCard.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.currentCard.style.transform = '';
        this.currentCard.classList.remove('swiping-left', 'swiping-right');
        
        // Reset next card position
        if (this.nextCard) {
            this.nextCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            this.nextCard.style.transform = 'scale(0.95)';
            this.nextCard.style.opacity = '0.8';
        }
        
        setTimeout(() => {
            if (this.currentCard) {
                this.currentCard.style.transition = '';
            }
            this.isAnimating = false;
        }, 500);
    }

    // Clean up event listeners when not needed
    cleanupListeners() {
        if (this.currentCard && this._boundStartDrag) {
            this.currentCard.removeEventListener('touchstart', this._boundStartDrag);
            this.currentCard.removeEventListener('mousedown', this._boundStartDrag);
            document.removeEventListener('touchmove', this._boundDrag);
            document.removeEventListener('mousemove', this._boundDrag);
            document.removeEventListener('touchend', this._boundEndDrag);
            document.removeEventListener('mouseup', this._boundEndDrag);
            document.removeEventListener('mouseleave', this._boundCancelDrag);
        }
    }
}
