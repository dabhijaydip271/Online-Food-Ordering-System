import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/api';
import './Orders.css';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERED', 'CANCELLED'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'PENDING': 'badge-pending',
      'CONFIRMED': 'badge-confirmed',
      'PREPARING': 'badge-preparing',
      'DELIVERED': 'badge-delivered',
      'CANCELLED': 'badge-cancelled',
    };
    return classes[status] || 'badge-pending';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'PENDING': '⏳',
      'CONFIRMED': '✅',
      'PREPARING': '👨‍🍳',
      'DELIVERED': '🎉',
      'CANCELLED': '❌',
    };
    return emojis[status] || '📋';
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Manage and track all customer orders</p>

        {/* Status Filters */}
        <div className="order-filters" id="order-filters">
          <button
            className={`category-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map(status => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                className={`category-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
                id={`filter-${status.toLowerCase()}`}
              >
                {getStatusEmoji(status)} {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="orders-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px', marginBottom: '12px' }}></div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card glass-card" id={`order-${order.id}`}>
                <div className="order-card-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="order-card-left">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-customer">
                      <span>👤 {order.customerName}</span>
                      <span>📞 {order.customerPhone}</span>
                    </div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="order-card-right">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {getStatusEmoji(order.status)} {order.status}
                    </span>
                    <span className="order-total">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                    <span className="order-expand-icon">{expandedOrder === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="order-details animate-fadeIn">
                    <div className="order-address">
                      <strong>📍 Delivery Address:</strong> {order.customerAddress}
                    </div>

                    {/* Order Items */}
                    <div className="order-items-table">
                      <div className="order-items-header">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Price</span>
                        <span>Total</span>
                      </div>
                      {order.orderItems && order.orderItems.map(item => (
                        <div key={item.id} className="order-items-row">
                          <span>{item.menuItemName}</span>
                          <span>{item.quantity}</span>
                          <span>₹{parseFloat(item.price).toFixed(2)}</span>
                          <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="order-actions">
                      <div className="status-update">
                        <label className="form-label">Update Status:</label>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          id={`status-select-${order.id}`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        id={`delete-order-${order.id}`}
                      >
                        🗑️ Delete Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No orders found</h3>
            <p className="empty-state-text">
              {filterStatus !== 'ALL'
                ? `No orders with status "${filterStatus}"`
                : 'Orders will appear here when customers place them.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
