import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" id="navbar-brand">
          <span className="brand-icon">🍔</span>
          <span className="brand-text">Foodie<span className="brand-highlight">Hub</span></span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-home" end>
            🏠 Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-menu">
            🍕 Menu
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `nav-link cart-link ${isActive ? 'active' : ''}`} id="nav-cart">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-orders">
            📋 Orders
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-admin">
            ⚙️ Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
