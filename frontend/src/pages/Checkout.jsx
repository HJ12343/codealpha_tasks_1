import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, API_URL } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { user, token } = useContext(AuthContext);
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=checkout');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a shipping address.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Something went wrong while processing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={50} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <p className="cart-empty-desc">Add products to your cart before checking out.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px', backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Order Total</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
            <span>Total Amount:</span>
            <span style={{ color: 'var(--color-accent)' }}>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Shipping Address
          </label>
          <textarea
            id="address"
            className="form-input form-textarea"
            placeholder="Enter your full street address, city, state, zip code, and country..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
          {loading ? 'Processing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
