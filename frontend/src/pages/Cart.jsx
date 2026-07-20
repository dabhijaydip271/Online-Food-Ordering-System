import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, showToast } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });
  const [placing, setPlacing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    setPlacing(true);

    const orderRequest = {
      customerName: customerInfo.customerName,
      customerPhone: customerInfo.customerPhone,
      customerAddress: customerInfo.customerAddress,
      items: cartItems.map(item => ({
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        price: parseFloat(item.menuItem.price),
      })),
    };

    try {
      await createOrder(orderRequest);
      clearCart();
      showToast('Order placed successfully! 🎉');
      setCustomerInfo({ customerName: '', customerPhone: '', customerAddress: '' });
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Is the backend running?', 'error');
    } finally {
      setPlacing(false);
    }
  };

  const total = getCartTotal();
  const deliveryFee = total > 0 ? 40 : 0;
  const grandTotal = total + deliveryFee;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">Review your items and place your order</p>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-text">Add some delicious items from our menu!</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')} id="browse-menu-btn">
              🍕 Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <h2 className="cart-section-title">Cart Items ({cartItems.length})</h2>
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.menuItem.id} className="cart-item glass-card" id={`cart-item-${item.menuItem.id}`}>
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.menuItem.name}</h3>
                      <p className="cart-item-category">{item.menuItem.category}</p>
                      <p className="cart-item-price">₹{parseFloat(item.menuItem.price).toFixed(2)} each</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          id={`qty-dec-${item.menuItem.id}`}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          id={`qty-inc-${item.menuItem.id}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-subtotal">
                        ₹{(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.menuItem.id)}
                        id={`remove-${item.menuItem.id}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" onClick={clearCart} id="clear-cart-btn">
                🗑️ Clear Cart
              </button>
            </div>

            {/* Order Summary & Form */}
            <div className="cart-summary-section">
              <div className="cart-summary glass-card">
                <h2 className="cart-section-title">Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Info Form */}
              <form className="checkout-form glass-card" onSubmit={handlePlaceOrder} id="checkout-form">
                <h2 className="cart-section-title">Delivery Details</h2>

                <div className="form-group">
                  <label className="form-label" htmlFor="customerName">Full Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className="form-input"
                    value={customerInfo.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="customerPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    className="form-input"
                    value={customerInfo.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="customerAddress">Delivery Address</label>
                  <textarea
                    id="customerAddress"
                    name="customerAddress"
                    className="form-textarea"
                    value={customerInfo.customerAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={placing}
                  id="place-order-btn"
                >
                  {placing ? '⏳ Placing Order...' : '🎉 Place Order — ₹' + grandTotal.toFixed(2)}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
