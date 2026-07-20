import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMenuItems } from '../services/api';
import MenuCard from '../components/MenuCard';
import './Home.css';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await getAllMenuItems();
      const available = response.data.filter(item => item.available);
      setFeaturedItems(available.slice(0, 6));
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge animate-fadeInUp">🔥 #1 Food Delivery Platform</span>
            <h1 className="hero-title animate-fadeInUp">
              Delicious Food,<br />
              <span className="hero-title-accent">Delivered Fast</span>
            </h1>
            <p className="hero-subtitle animate-fadeInUp">
              Browse our curated menu of mouthwatering dishes from top restaurants.
              Order in seconds, delivered to your doorstep in minutes.
            </p>
            <div className="hero-actions animate-fadeInUp">
              <Link to="/menu" className="btn btn-primary btn-lg" id="hero-order-btn">
                🍕 Order Now
              </Link>
              <Link to="/menu" className="btn btn-secondary btn-lg" id="hero-menu-btn">
                View Menu →
              </Link>
            </div>
          </div>
          <div className="hero-visual animate-fadeIn">
            <div className="hero-food-circle">
              <span className="hero-food-emoji">🍔</span>
            </div>
            <div className="hero-float-item hero-float-1">🍕</div>
            <div className="hero-float-item hero-float-2">🌮</div>
            <div className="hero-float-item hero-float-3">🍰</div>
            <div className="hero-float-item hero-float-4">🥤</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card glass-card">
              <span className="stat-icon">🍽️</span>
              <span className="stat-number">50+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-icon">⚡</span>
              <span className="stat-number">30min</span>
              <span className="stat-label">Fast Delivery</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-number">4.8</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-icon">😊</span>
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="featured-section" id="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🌟 Featured Dishes</h2>
            <p className="section-subtitle">Our most popular items handpicked for you</p>
          </div>

          {loading ? (
            <div className="grid-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid-3">
              {featuredItems.map((item, index) => (
                <div key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MenuCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <h3 className="empty-state-title">No items yet</h3>
              <p className="empty-state-text">Add menu items from the Admin panel to see them here.</p>
              <Link to="/admin" className="btn btn-primary">Go to Admin Panel</Link>
            </div>
          )}

          {featuredItems.length > 0 && (
            <div className="section-cta">
              <Link to="/menu" className="btn btn-secondary btn-lg" id="view-all-menu-btn">
                View Full Menu →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🚀 How It Works</h2>
            <p className="section-subtitle">Get your food in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card glass-card">
              <div className="step-number">01</div>
              <span className="step-icon">📋</span>
              <h3 className="step-title">Browse Menu</h3>
              <p className="step-desc">Explore our wide variety of dishes and pick your favorites.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-number">02</div>
              <span className="step-icon">🛒</span>
              <h3 className="step-title">Add to Cart</h3>
              <p className="step-desc">Select items, customize quantities, and review your order.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-number">03</div>
              <span className="step-icon">🎉</span>
              <h3 className="step-title">Place Order</h3>
              <p className="step-desc">Confirm your order and we'll deliver it right to your door.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
