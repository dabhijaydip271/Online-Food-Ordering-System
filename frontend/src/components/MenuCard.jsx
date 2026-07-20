import { useCart } from '../context/CartContext';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Pizza': '🍕',
      'Burger': '🍔',
      'Drinks': '🥤',
      'Dessert': '🍰',
      'Biryani': '🍛',
      'Chinese': '🥡',
      'Starter': '🥗',
      'Thali': '🍽️',
    };
    return emojis[category] || '🍴';
  };

  return (
    <div className="menu-card glass-card" id={`menu-card-${item.id}`}>
      <div className={`menu-card-image${item.imageUrl ? ' has-image' : ''}`}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="menu-card-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />
        ) : null}
        <span
          className="menu-card-emoji"
          style={item.imageUrl ? { display: 'none' } : {}}
        >
          {getCategoryEmoji(item.category)}
        </span>
        {!item.available && <span className="unavailable-badge">Unavailable</span>}
      </div>
      <div className="menu-card-body">
        <div className="menu-card-category">{item.category}</div>
        <h3 className="menu-card-name">{item.name}</h3>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-footer">
          <span className="menu-card-price">₹{parseFloat(item.price).toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(item)}
            disabled={!item.available}
            id={`add-to-cart-${item.id}`}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
