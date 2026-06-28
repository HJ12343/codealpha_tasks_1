import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, API_URL } from '../context/AuthContext';
import { Package, Calendar, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-empty" style={{ margin: '40px 0' }}>
        <h2 className="cart-empty-title">Error</h2>
        <p className="cart-empty-desc">{error}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="cart-empty">
        <Package size={50} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
        <h2 className="cart-empty-title">No Orders Yet</h2>
        <p className="cart-empty-desc">You haven't placed any orders with us yet.</p>
        <Link to="/" className="btn-primary">
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px' }}>Your Order History</h1>
      <div className="orders-container">
        {orders.map((order) => (
          <div key={order.id} className="order-box">
            <div className="order-header">
              <div className="order-meta-info">
                <div className="order-meta-item">
                  <span className="meta-label">Order ID</span>
                  <span className="meta-value">#{order.id}</span>
                </div>
                <div className="order-meta-item">
                  <span className="meta-label">Date Placed</span>
                  <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-meta-item">
                  <span className="meta-label">Total Paid</span>
                  <span className="meta-value" style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center' }}>
                    <DollarSign size={14} />
                    {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <span className={`order-status ${order.status === 'PENDING' ? 'status-pending' : 'status-completed'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="order-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
                    }}
                  />
                  <div className="order-item-details">
                    <h4 className="order-item-name">{item.product.name}</h4>
                    <div className="order-item-meta">
                      Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-shipping">
              <span className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <MapPin size={12} />
                <span>Shipping Address</span>
              </span>
              <p style={{ color: 'var(--text-muted)' }}>{order.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
