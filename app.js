// MDVita PWA - Main Application JavaScript
class MDVitaApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'landing-page';
        this.moodChart = null;
        this.sentimentChart = null;
        this.userStats = {
            streak: 0,
            journalEntries: 0,
            moodAverage: 0
        };
        
        // App data from provided JSON
        this.moodOptions = [
            {emoji: "😊", label: "Happy", value: 5},
            {emoji: "😐", label: "Neutral", value: 3},
            {emoji: "😢", label: "Sad", value: 1},
            {emoji: "😰", label: "Anxious", value: 2},
            {emoji: "😌", label: "Calm", value: 4}
        ];
        
        this.discoveryContent = [
            {
                id: "1",
                type: "video",
                title: "5-Minute Morning Meditation",
                duration: "5:32",
                thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
                curated: true,
                likes: 2043,
                comments: 128,
                shares: 56
            },
            {
                id: "2",
                type: "article",
                title: "10 Tips for Managing Anxiety",
                thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                curated: true,
                likes: 1456,
                comments: 67,
                shares: 23
            },
            {
                id: "3",
                type: "article",
                title: "Better Sleep Hygiene Habits",
                thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400",
                curated: false,
                likes: 892,
                comments: 34,
                shares: 18
            }
        ];
        
        this.journalPrompts = [
            "What are three things you're grateful for today?",
            "How did you handle stress today?",
            "What made you smile this week?",
            "Describe a moment when you felt completely at peace.",
            "What challenge did you overcome recently?"
        ];

        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.initFirebase();
            this.setupEventListeners();
            this.setupServiceWorker();
            this.checkAuthState();
        } catch (error) {
            console.error('App initialization error:', error);
            this.showError('Failed to initialize app. Please refresh the page.');
        } finally {
            this.showLoading(false);
        }
    }

    async initFirebase() {
        // Firebase configuration - In production, use environment variables
        const firebaseConfig = {
            apiKey: "demo-api-key",
            authDomain: "mdvita-wellness.firebaseapp.com",
            projectId: "mdvita-wellness",
            storageBucket: "mdvita-wellness.appspot.com"
        };

        // Note: For demo purposes, we'll simulate Firebase functionality
        this.firebase = {
            auth: {
                onAuthStateChanged: (callback) => {
                    // Simulate auth state check
                    setTimeout(() => callback(this.currentUser), 100);
                },
                signInWithEmailAndPassword: async (email, password) => {
                    // Simulate sign in
                    await this.delay(1000);
                    return {
                        user: {
                            uid: 'demo-user-' + Date.now(),
                            email: email,
                            displayName: email.split('@')[0]
                        }
                    };
                },
                createUserWithEmailAndPassword: async (email, password) => {
                    // Simulate sign up
                    await this.delay(1000);
                    return {
                        user: {
                            uid: 'demo-user-' + Date.now(),
                            email: email,
                            displayName: email.split('@')[0]
                        }
                    };
                },
                signOut: async () => {
                    // Simulate sign out
                    await this.delay(500);
                    this.currentUser = null;
                }
            },
            firestore: {
                collection: (name) => ({
                    doc: (id) => ({
                        set: async (data) => {
                            // Simulate Firestore write
                            await this.delay(300);
                            localStorage.setItem(`mdvita_${name}_${id}`, JSON.stringify(data));
                        },
                        get: async () => {
                            // Simulate Firestore read
                            await this.delay(200);
                            const data = localStorage.getItem(`mdvita_${name}_${id}`);
                            return {
                                exists: () => !!data,
                                data: () => data ? JSON.parse(data) : null
                            };
                        }
                    }),
                    add: async (data) => {
                        // Simulate Firestore add
                        await this.delay(300);
                        const id = 'doc_' + Date.now();
                        localStorage.setItem(`mdvita_${name}_${id}`, JSON.stringify(data));
                        return { id };
                    }
                })
            }
        };
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register service worker for PWA functionality
            navigator.serviceWorker.register('data:application/javascript,console.log("MDVita PWA Service Worker");')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    setupEventListeners() {
        // Auth form toggles
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        
        if (signinTab) {
            signinTab.addEventListener('click', () => {
                this.switchAuthForm('signin');
            });
        }
        
        if (signupTab) {
            signupTab.addEventListener('click', () => {
                this.switchAuthForm('signup');
            });
        }

        // Auth form submissions
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                this.handleSignIn(e);
            });
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                this.handleSignUp(e);
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page + '-page');
            });
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page + '-page');
            });
        });

        // Mood tracking
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMood(e.currentTarget);
            });
        });

        const logMoodBtn = document.getElementById('log-mood-btn');
        if (logMoodBtn) {
            logMoodBtn.addEventListener('click', () => {
                this.logMood();
            });
        }

        // Journal functionality
        const journalText = document.getElementById('journal-text');
        if (journalText) {
            journalText.addEventListener('input', () => {
                this.updateWordCount();
            });
        }

        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeJournalWithAI();
            });
        }

        const saveEntryBtn = document.getElementById('save-entry-btn');
        if (saveEntryBtn) {
            saveEntryBtn.addEventListener('click', () => {
                this.saveJournalEntry();
            });
        }

        // Editor toolbar
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.executeCommand(e.currentTarget.dataset.command);
            });
        });

        // Games
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const game = e.currentTarget.dataset.game;
                this.startGame(game);
            });
        });

        document.querySelectorAll('.close-game').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.closest('.game-overlay').classList.add('hidden');
            });
        });

        // Breathing game controls
        const startBreathingBtn = document.getElementById('start-breathing');
        const stopBreathingBtn = document.getElementById('stop-breathing');
        
        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', () => {
                this.startBreathingExercise();
            });
        }

        if (stopBreathingBtn) {
            stopBreathingBtn.addEventListener('click', () => {
                this.stopBreathingExercise();
            });
        }

        // Memory game
        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.initMemoryGame();
            });
        }
    }

    checkAuthState() {
        this.firebase.auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.loadUserData();
                this.navigateToPage('dashboard-page');
            } else {
                this.navigateToPage('landing-page');
            }
        });
    }

    switchAuthForm(type) {
        // Remove active class from all tabs and forms
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Add active class to selected tab and form
        const selectedTab = document.getElementById(type + '-tab');
        const selectedForm = document.getElementById(type + '-form');
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedForm) selectedForm.classList.add('active');

        // Update form content based on type
        if (type === 'signup') {
            const formTitle = selectedForm.querySelector('h2');
            const submitBtn = selectedForm.querySelector('button[type="submit"]');
            if (formTitle) formTitle.textContent = 'Join MDVita';
            if (submitBtn) submitBtn.textContent = 'Create Account';
        } else {
            const formTitle = selectedForm.querySelector('h2');
            const submitBtn = selectedForm.querySelector('button[type="submit"]');
            if (formTitle) formTitle.textContent = 'Welcome Back';
            if (submitBtn) submitBtn.textContent = 'Sign In';
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        this.showLoading(true);
        
        try {
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            const result = await this.firebase.auth.signInWithEmailAndPassword(email, password);
            this.currentUser = result.user;
            this.loadUserData();
            this.navigateToPage('dashboard-page');
            this.showSuccess('Welcome back!');
        } catch (error) {
            this.showError('Sign in failed. Please check your credentials.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        this.showLoading(true);
        
        try {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            const result = await this.firebase.auth.createUserWithEmailAndPassword(email, password);
            this.currentUser = result.user;
            this.currentUser.displayName = name;
            
            // Save user profile
            await this.firebase.firestore.collection('users').doc(result.user.uid).set({
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                streak: 0,
                journalEntries: 0
            });
            
            this.loadUserData();
            this.navigateToPage('dashboard-page');
            this.showSuccess('Account created successfully!');
        } catch (error) {
            this.showError('Sign up failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignOut() {
        try {
            this.showLoading(true);
            await this.firebase.auth.signOut();
            this.currentUser = null;
            this.navigateToPage('landing-page');
            this.showSuccess('Signed out successfully!');
        } catch (error) {
            this.showError('Sign out failed.');
        } finally {
            this.showLoading(false);
        }
    }

    navigateToPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;

            // Load page-specific data
            if (pageId === 'mood-page') {
                setTimeout(() => this.initMoodChart(), 100);
            }
        }
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const userDoc = await this.firebase.firestore.collection('users').doc(this.currentUser.uid).get();
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.userStats = {
                    streak: userData.streak || 0,
                    journalEntries: userData.journalEntries || 0,
                    moodAverage: userData.moodAverage || 0
                };
            }

            // Update UI
            const userNameEl = document.getElementById('user-name');
            const streakCountEl = document.getElementById('streak-count');
            const journalCountEl = document.getElementById('journal-count');
            const moodAverageEl = document.getElementById('mood-average');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.displayName || 'User';
            if (streakCountEl) streakCountEl.textContent = this.userStats.streak;
            if (journalCountEl) journalCountEl.textContent = this.userStats.journalEntries;
            if (moodAverageEl) moodAverageEl.textContent = this.userStats.moodAverage.toFixed(1);

        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    selectMood(button) {
        // Remove previous selections from the same mood selector
        const parent = button.closest('.mood-selector');
        if (parent) {
            parent.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.dataset.selected = 'false';
            });
        }
        
        // Select current mood
        button.classList.add('selected');
        button.dataset.selected = 'true';
    }

    async logMood() {
        const selectedMood = document.querySelector('.mood-btn.selected');
        if (!selectedMood) {
            this.showError('Please select a mood first.');
            return;
        }

        const moodValue = parseInt(selectedMood.dataset.mood);
        const moodLabel = selectedMood.dataset.label;

        try {
            await this.firebase.firestore.collection('moods').add({
                userId: this.currentUser.uid,
                mood: moodValue,
                label: moodLabel,
                timestamp: new Date().toISOString()
            });

            // Update user stats
            this.userStats.moodAverage = moodValue; // Simplified calculation
            await this.updateUserStats();
            
            this.showSuccess(`Mood logged: ${moodLabel}`);
            this.loadUserData();
            
            // Clear selection
            selectedMood.classList.remove('selected');
            selectedMood.dataset.selected = 'false';
            
        } catch (error) {
            this.showError('Failed to log mood. Please try again.');
        }
    }

    initMoodChart() {
        const ctx = document.getElementById('mood-chart');
        if (!ctx) return;

        // Sample data for demo
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = [4, 3, 5, 2, 4, 5, 3];

        if (this.moodChart) {
            this.moodChart.destroy();
        }

        this.moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Update insights
        const average = data.reduce((a, b) => a + b, 0) / data.length;
        const mostCommon = this.moodOptions.find(m => m.value === Math.round(average))?.label || 'Neutral';
        
        const weeklyAvgEl = document.getElementById('weekly-average');
        const mostCommonEl = document.getElementById('most-common-mood');
        
        if (weeklyAvgEl) weeklyAvgEl.textContent = `${average.toFixed(1)}/5`;
        if (mostCommonEl) mostCommonEl.textContent = mostCommon;
    }

    updateWordCount() {
        const text = document.getElementById('journal-text').textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const chars = text.length;

        const wordCountEl = document.getElementById('word-count');
        const charCountEl = document.getElementById('char-count');
        
        if (wordCountEl) wordCountEl.textContent = `${words.length} words`;
        if (charCountEl) charCountEl.textContent = `${chars} characters`;
    }

    executeCommand(command) {
        document.execCommand(command, false, null);
        const journalText = document.getElementById('journal-text');
        if (journalText) {
            journalText.focus();
        }
    }

    async analyzeJournalWithAI() {
        const journalText = document.getElementById('journal-text');
        const text = journalText ? journalText.textContent || '' : '';
        
        if (!text.trim()) {
            this.showError('Please write something first.');
            return;
        }

        this.showLoading(true);

        try {
            // Simulate Gemini AI analysis
            await this.delay(2000);
            
            const sentiment = this.analyzeSentiment(text);
            const suggestions = this.generateSuggestions(text, sentiment);

            this.displaySentimentAnalysis(sentiment);
            this.displayAISuggestions(suggestions);

        } catch (error) {
            this.showError('AI analysis failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    analyzeSentiment(text) {
        // Simple sentiment analysis simulation
        const positiveWords = ['happy', 'joy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'blessed'];
        const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'upset'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positive = 0;
        let negative = 0;

        words.forEach(word => {
            if (positiveWords.some(pw => word.includes(pw))) positive++;
            if (negativeWords.some(nw => word.includes(nw))) negative++;
        });

        let score = 0.5; // neutral
        if (positive > negative) {
            score = Math.min(0.9, 0.5 + (positive - negative) * 0.1);
        } else if (negative > positive) {
            score = Math.max(0.1, 0.5 - (negative - positive) * 0.1);
        }

        const confidence = Math.min(100, Math.max(60, (positive + negative) * 20));

        return {
            score,
            confidence,
            label: score > 0.6 ? 'Positive' : score < 0.4 ? 'Negative' : 'Neutral'
        };
    }

    generateSuggestions(text, sentiment) {
        const suggestions = [];

        if (sentiment.score < 0.4) {
            suggestions.push('Consider practicing gratitude - write down 3 things you\'re thankful for');
            suggestions.push('Try some deep breathing exercises to help manage difficult emotions');
            suggestions.push('Remember that challenging times are temporary and you have overcome difficulties before');
        } else if (sentiment.score > 0.6) {
            suggestions.push('Great to see you\'re feeling positive! Consider what specific actions contributed to this mood');
            suggestions.push('This positive energy could be a great time to tackle a goal or help someone else');
        } else {
            suggestions.push('Neutral feelings are completely normal. Consider what small step could improve your day');
            suggestions.push('Try engaging in an activity you enjoy or connecting with someone you care about');
        }

        return suggestions;
    }

    displaySentimentAnalysis(sentiment) {
        // Update sentiment display
        const sentimentValueEl = document.getElementById('sentiment-value');
        const confidenceValueEl = document.getElementById('confidence-value');
        
        if (sentimentValueEl) sentimentValueEl.textContent = sentiment.label;
        if (confidenceValueEl) confidenceValueEl.textContent = `${Math.round(sentiment.confidence)}%`;

        // Create simple circular chart
        this.createSentimentChart(sentiment.score);
    }

    createSentimentChart(score) {
        const canvas = document.getElementById('sentiment-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 35;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Draw progress arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * score));
        ctx.strokeStyle = score > 0.6 ? '#10b981' : score < 0.4 ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Draw score text
        ctx.fillStyle = '#374151';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(score * 100) + '%', centerX, centerY + 5);
    }

    displayAISuggestions(suggestions) {
        const list = document.getElementById('suggestions-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            list.appendChild(li);
        });
    }

    async saveJournalEntry() {
        const journalText = document.getElementById('journal-text');
        const text = journalText ? journalText.textContent || '' : '';
        
        if (!text.trim()) {
            this.showError('Nothing to save.');
            return;
        }

        try {
            await this.firebase.firestore.collection('journal').add({
                userId: this.currentUser.uid,
                content: text,
                timestamp: new Date().toISOString()
            });

            this.userStats.journalEntries++;
            await this.updateUserStats();
            
            this.showSuccess('Journal entry saved!');
            this.loadUserData();
            
            // Clear editor
            if (journalText) {
                journalText.textContent = '';
                this.updateWordCount();
            }

        } catch (error) {
            this.showError('Failed to save entry. Please try again.');
        }
    }

    async updateUserStats() {
        if (!this.currentUser) return;

        try {
            await this.firebase.firestore.collection('users').doc(this.currentUser.uid).set({
                ...this.userStats,
                lastActivity: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }

    startGame(gameType) {
        const gameOverlay = document.getElementById(gameType + '-game');
        if (gameOverlay) {
            gameOverlay.classList.remove('hidden');
            
            if (gameType === 'memory') {
                this.initMemoryGame();
            }
        }
    }

    startBreathingExercise() {
        const circle = document.getElementById('breathing-circle');
        const instruction = document.getElementById('breathing-instruction');
        
        if (!circle || !instruction) return;
        
        let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
        let cycle = 0;
        
        const phases = [
            { name: 'Inhale', duration: 4000, class: 'inhale' },
            { name: 'Hold', duration: 7000, class: 'hold' },
            { name: 'Exhale', duration: 8000, class: 'exhale' },
            { name: 'Hold', duration: 1000, class: 'exhale' }
        ];

        const runPhase = () => {
            const breathingGame = document.getElementById('breathing-game');
            if (breathingGame && !breathingGame.classList.contains('hidden')) {
                const currentPhase = phases[phase];
                instruction.textContent = currentPhase.name;
                circle.className = `breathing-circle ${currentPhase.class}`;
                
                setTimeout(() => {
                    phase = (phase + 1) % phases.length;
                    if (phase === 0) cycle++;
                    
                    if (cycle < 5) { // Run for 5 cycles
                        runPhase();
                    } else {
                        instruction.textContent = 'Exercise Complete!';
                        circle.className = 'breathing-circle';
                    }
                }, currentPhase.duration);
            }
        };

        runPhase();
    }

    stopBreathingExercise() {
        const breathingGame = document.getElementById('breathing-game');
        const circle = document.getElementById('breathing-circle');
        const instruction = document.getElementById('breathing-instruction');
        
        if (breathingGame) breathingGame.classList.add('hidden');
        if (circle) circle.className = 'breathing-circle';
        if (instruction) instruction.textContent = 'Get Ready';
    }

    initMemoryGame() {
        const grid = document.getElementById('memory-grid');
        if (!grid) return;
        
        const symbols = ['🌟', '🌙', '☀️', '🌈', '🌺', '🌸', '🍀', '🦋'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        grid.innerHTML = '';
        
        let flippedCards = [];
        let matches = 0;
        let moves = 0;
        
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
                    return;
                }
                
                card.classList.add('flipped');
                card.textContent = symbol;
                flippedCards.push(card);
                
                if (flippedCards.length === 2) {
                    moves++;
                    const moveCountEl = document.getElementById('move-count');
                    if (moveCountEl) moveCountEl.textContent = moves;
                    
                    setTimeout(() => {
                        if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                            flippedCards.forEach(c => {
                                c.classList.add('matched');
                                c.classList.remove('flipped');
                            });
                            matches++;
                            const matchCountEl = document.getElementById('match-count');
                            if (matchCountEl) matchCountEl.textContent = matches;
                            
                            if (matches === symbols.length) {
                                setTimeout(() => {
                                    this.showSuccess(`Congratulations! You won in ${moves} moves!`);
                                }, 500);
                            }
                        } else {
                            flippedCards.forEach(c => {
                                c.classList.remove('flipped');
                                c.textContent = '';
                            });
                        }
                        flippedCards = [];
                    }, 1000);
                }
            });
            
            grid.appendChild(card);
        });
        
        const moveCountEl = document.getElementById('move-count');
        const matchCountEl = document.getElementById('match-count');
        
        if (moveCountEl) moveCountEl.textContent = '0';
        if (matchCountEl) matchCountEl.textContent = '0';
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (show) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
    }

    showError(message) {
        // Simple error display with better UX
        const alertDiv = this.createAlert(message, 'error');
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 5000);
    }

    showSuccess(message) {
        // Simple success display with better UX
        const alertDiv = this.createAlert(message, 'success');
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 3000);
    }

    createAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.padding = '16px';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.color = 'white';
        alertDiv.style.fontWeight = '500';
        alertDiv.style.zIndex = '10000';
        alertDiv.style.maxWidth = '300px';
        alertDiv.textContent = message;
        
        if (type === 'error') {
            alertDiv.style.backgroundColor = '#ef4444';
        } else {
            alertDiv.style.backgroundColor = '#10b981';
        }
        
        return alertDiv;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MDVitaApp();
});

// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if needed
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
            installButton.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Handle app install
window.addEventListener('appinstalled', (evt) => {
    console.log('MDVita PWA was installed');
});