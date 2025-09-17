# Health Discovery Feed - React Components

## Component Structure

### 1. Main Feed Component (`HealthDiscoveryFeed.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import LoadMoreButton from './LoadMoreButton';
import './HealthDiscoveryFeed.css';

const HealthDiscoveryFeed = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Sample content data - replace with API calls
  const sampleContent = [
    {
      id: 1,
      type: 'video',
      title: 'Full Body Workout',
      duration: '20 min',
      thumbnail: '/assets/workout-thumbnail.jpg',
      curated: false,
      likes: 0,
      comments: 0,
      shares: 0,
      author: 'Fitness Expert',
      category: 'fitness'
    },
    {
      id: 2,
      type: 'article',
      title: '5 Tips for a Balanced Diet',
      thumbnail: '/assets/nutrition-thumbnail.jpg',
      curated: true,
      likes: 98,
      comments: 12,
      shares: 6,
      author: 'Nutritionist',
      category: 'nutrition'
    },
    {
      id: 3,
      type: 'article',
      title: 'A Guide to Managing Hypertension',
      thumbnail: '/assets/hypertension-thumbnail.jpg',
      curated: true,
      likes: 86,
      comments: 14,
      shares: 11,
      author: 'Medical Expert',
      category: 'health'
    },
    {
      id: 4,
      type: 'article',
      title: 'How to Improve Your Sleep',
      thumbnail: '/assets/sleep-thumbnail.jpg',
      curated: false,
      likes: 112,
      comments: 24,
      shares: 19,
      author: 'Sleep Specialist',
      category: 'wellness'
    }
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setContent(sampleContent);
      setLoading(false);
    }, 1000);
  };

  const loadMore = () => {
    setLoading(true);
    // Simulate loading more content
    setTimeout(() => {
      setContent(prev => [...prev, ...sampleContent.map(item => ({
        ...item,
        id: item.id + content.length
      }))]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1500);
  };

  const handleEngagement = (contentId, action) => {
    setContent(prev => prev.map(item => {
      if (item.id === contentId) {
        const updated = { ...item };
        if (action === 'like') {
          updated.likes += 1;
        } else if (action === 'comment') {
          updated.comments += 1;
        } else if (action === 'share') {
          updated.shares += 1;
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="health-discovery-feed">
      <div className="feed-header">
        <h1 className="feed-title">Health Discovery</h1>
      </div>
      
      <div className="feed-content">
        <div className="content-grid">
          {content.map(item => (
            <ContentCard
              key={item.id}
              content={item}
              onEngagement={handleEngagement}
            />
          ))}
        </div>
        
        {!loading && (
          <LoadMoreButton onLoadMore={loadMore} />
        )}
        
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading wellness content...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDiscoveryFeed;
```

### 2. Content Card Component (`ContentCard.jsx`)

```jsx
import React, { useState } from 'react';
import EngagementStats from './EngagementStats';
import CuratedBadge from './CuratedBadge';
import PlayButton from './PlayButton';

const ContentCard = ({ content, onEngagement }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      onEngagement(content.id, 'like');
      setIsLiked(true);
    }
  };

  const handleComment = () => {
    onEngagement(content.id, 'comment');
  };

  const handleShare = () => {
    onEngagement(content.id, 'share');
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: `Check out: ${content.title}`,
        url: window.location.href
      });
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className={`content-card ${content.type}-card`}>
      <div className="card-media">
        <div className="thumbnail-container">
          <img 
            src={content.thumbnail} 
            alt={content.title}
            className="content-thumbnail"
          />
          {content.type === 'video' && (
            <PlayButton duration={content.duration} />
          )}
          {content.curated && (
            <CuratedBadge />
          )}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="content-title">{content.title}</h3>
        {content.duration && (
          <p className="content-duration">{content.duration}</p>
        )}
        
        <EngagementStats
          likes={content.likes}
          comments={content.comments}
          shares={content.shares}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ContentCard;
```

### 3. Engagement Stats Component (`EngagementStats.jsx`)

```jsx
import React from 'react';

const EngagementStats = ({ 
  likes, 
  comments, 
  shares, 
  isLiked, 
  isSaved, 
  onLike, 
  onComment, 
  onShare, 
  onSave 
}) => {
  const formatCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return count.toString();
  };

  return (
    <div className="engagement-stats">
      <div className="stats-left">
        <button 
          className={`stat-button like-button ${isLiked ? 'active' : ''}`}
          onClick={onLike}
          aria-label={`Like (${likes})`}
        >
          <svg 
            className="stat-icon" 
            fill={isLiked ? '#ff6b6b' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span className="stat-count">{formatCount(likes)}</span>
        </button>

        <button 
          className="stat-button comment-button"
          onClick={onComment}
          aria-label={`Comment (${comments})`}
        >
          <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="stat-count">{formatCount(comments)}</span>
        </button>

        <button 
          className="stat-button share-button"
          onClick={onShare}
          aria-label={`Share (${shares})`}
        >
          <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
            />
          </svg>
          <span className="stat-count">{formatCount(shares)}</span>
        </button>
      </div>

      <button 
        className={`save-button ${isSaved ? 'active' : ''}`}
        onClick={onSave}
        aria-label={isSaved ? 'Remove from saved' : 'Save content'}
      >
        <svg 
          className="save-icon" 
          fill={isSaved ? '#4ecdc4' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
          />
        </svg>
      </button>
    </div>
  );
};

export default EngagementStats;
```

### 4. Curated Badge Component (`CuratedBadge.jsx`)

```jsx
import React from 'react';

const CuratedBadge = () => {
  return (
    <div className="curated-badge">
      <span className="curated-text">CURATED</span>
    </div>
  );
};

export default CuratedBadge;
```

### 5. Play Button Component (`PlayButton.jsx`)

```jsx
import React from 'react';

const PlayButton = ({ duration }) => {
  return (
    <div className="play-button-overlay">
      <div className="play-button">
        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      {duration && (
        <div className="video-duration">
          {duration}
        </div>
      )}
    </div>
  );
};

export default PlayButton;
```

### 6. Load More Button Component (`LoadMoreButton.jsx`)

```jsx
import React from 'react';

const LoadMoreButton = ({ onLoadMore }) => {
  return (
    <div className="load-more-section">
      <button 
        className="load-more-button"
        onClick={onLoadMore}
      >
        <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        Load More Content
      </button>
    </div>
  );
};

export default LoadMoreButton;
```

## CSS Styling (`HealthDiscoveryFeed.css`)

```css
/* Health Discovery Feed Styles */
.health-discovery-feed {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.feed-header {
  padding: 32px 0 24px 0;
  text-align: left;
}

.feed-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.feed-content {
  padding-bottom: 32px;
}

.content-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Content Card Styles */
.content-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-media {
  position: relative;
}

.thumbnail-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.content-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-card:hover .content-thumbnail {
  transform: scale(1.05);
}

/* Play Button Overlay */
.play-button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .play-button-overlay {
  opacity: 1;
}

.play-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: white;
  transform: scale(1.1);
}

.play-icon {
  width: 24px;
  height: 24px;
  color: #4a5568;
  margin-left: 2px;
}

.video-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Curated Badge */
.curated-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff8a80;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.curated-text {
  text-transform: uppercase;
}

/* Card Content */
.card-content {
  padding: 20px;
}

.content-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.content-duration {
  font-size: 0.875rem;
  color: #718096;
  margin: 0 0 16px 0;
  font-weight: 500;
}

/* Engagement Stats */
.engagement-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.stats-left {
  display: flex;
  gap: 20px;
}

.stat-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.3s ease;
}

.stat-button:hover {
  color: #4a5568;
}

.stat-button.active {
  color: #ff6b6b;
}

.stat-icon {
  width: 20px;
  height: 20px;
}

.stat-count {
  min-width: 20px;
  text-align: left;
}

.save-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #718096;
  transition: all 0.3s ease;
}

.save-button:hover {
  color: #4ecdc4;
}

.save-button.active {
  color: #4ecdc4;
}

.save-icon {
  width: 24px;
  height: 24px;
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-button:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  color: #718096;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4ecdc4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .health-discovery-feed {
    padding: 0 12px;
  }
  
  .feed-title {
    font-size: 2rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .content-title {
    font-size: 1.125rem;
  }
  
  .stats-left {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .feed-header {
    padding: 24px 0 20px 0;
  }
  
  .feed-title {
    font-size: 1.75rem;
  }
  
  .thumbnail-container {
    height: 180px;
  }
  
  .stats-left {
    gap: 12px;
  }
  
  .stat-button {
    font-size: 0.8rem;
  }
  
  .stat-icon {
    width: 18px;
    height: 18px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .content-card,
  .play-button,
  .stat-button,
  .load-more-button {
    transition: none;
  }
  
  .spinner {
    animation: none;
  }
}

/* Focus states for accessibility */
.content-card:focus-within,
.stat-button:focus,
.save-button:focus,
.load-more-button:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}
```

## Usage Example (`App.jsx`)

```jsx
import React from 'react';
import HealthDiscoveryFeed from './components/HealthDiscoveryFeed';
import './App.css';

function App() {
  return (
    <div className="App">
      <HealthDiscoveryFeed />
    </div>
  );
}

export default App;
```

## Installation Instructions

1. Create a new React app:
```bash
npx create-react-app health-discovery-feed
cd health-discovery-feed
```

2. Replace the default files with the components above

3. Add the CSS file to your project

4. Install any additional dependencies if needed:
```bash
npm install
```

5. Start the development server:
```bash
npm start
```

This React implementation provides:

- **Component-based architecture** for maintainability
- **Responsive grid layout** that adapts to different screen sizes  
- **Interactive engagement stats** with like, comment, share functionality
- **Video and article content cards** with thumbnails and play buttons
- **Curated badges** for verified content
- **Load more functionality** with loading states
- **Hover effects and smooth animations**
- **Accessibility features** including focus states and reduced motion support
- **Mobile-first responsive design**

The components are modular and reusable, making it easy to extend functionality or integrate with different data sources and APIs.