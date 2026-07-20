import { useState, useEffect } from 'react';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import MenuForm from '../components/MenuForm';
import './AdminMenu.css';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const response = await createMenuItem(formData);
      setMenuItems(prev => [...prev, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await updateMenuItem(editingItem.id, formData);
      setMenuItems(prev =>
        prev.map(item => item.id === editingItem.id ? response.data : item)
      );
      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="page-subtitle">Manage your restaurant menu items</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateForm} id="add-menu-item-btn">
            ➕ Add Menu Item
          </button>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '8px' }}></div>
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <div className="admin-table-wrapper glass-card">
            <table className="admin-table" id="menu-items-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id} id={`admin-row-${item.id}`}>
                    <td className="table-id">#{item.id}</td>
                    <td>
                      <div className="table-item-name">{item.name}</div>
                      <div className="table-item-desc">{item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}</div>
                    </td>
                    <td><span className="badge badge-confirmed">{item.category}</span></td>
                    <td className="table-price">₹{parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${item.available ? 'badge-delivered' : 'badge-cancelled'}`}>
                        {item.available ? '✅ Yes' : '❌ No'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditForm(item)}
                          id={`edit-item-${item.id}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                          id={`delete-item-${item.id}`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3 className="empty-state-title">No menu items yet</h3>
            <p className="empty-state-text">Start by adding your first menu item.</p>
            <button className="btn btn-primary" onClick={openCreateForm}>
              ➕ Add First Item
            </button>
          </div>
        )}

        {/* Stats */}
        {!loading && menuItems.length > 0 && (
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-value">{menuItems.length}</span>
              <span className="admin-stat-label">Total Items</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{menuItems.filter(i => i.available).length}</span>
              <span className="admin-stat-label">Available</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{[...new Set(menuItems.map(i => i.category))].length}</span>
              <span className="admin-stat-label">Categories</span>
            </div>
          </div>
        )}

        {/* Menu Form Modal */}
        {showForm && (
          <MenuForm
            item={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onClose={closeForm}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
