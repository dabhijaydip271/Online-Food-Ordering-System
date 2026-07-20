import { useState, useEffect } from 'react';
import { getAllMenuItems } from '../services/api';
import MenuCard from '../components/MenuCard';
import './Menu.css';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Drinks', 'Dessert', 'Biryani', 'Chinese', 'Starter', 'Thali'];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, activeCategory, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let items = menuItems;

    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Our Menu</h1>
        <p className="page-subtitle">Discover our wide range of delicious dishes</p>

        {/* Search Bar */}
        <div className="menu-search-bar" id="menu-search-section">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="menu-search-input"
          />
        </div>

        {/* Category Filters */}
        <div className="category-filters" id="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid-3">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-text">
              {searchQuery ? `No results for "${searchQuery}"` : 'No items in this category yet.'}
            </p>
          </div>
        )}

        {/* Item Count */}
        {!loading && filteredItems.length > 0 && (
          <div className="menu-item-count">
            Showing {filteredItems.length} of {menuItems.length} items
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
