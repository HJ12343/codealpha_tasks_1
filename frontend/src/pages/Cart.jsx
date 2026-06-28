import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={50} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <p className="cart-empty-desc">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
                }}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <span className="product-category-tag" style={{ position: 'static', padding: '2px 8px', fontSize: '10px' }}>
                  {item.category}
                </span>
              </div>
              <div className="cart-item-qty">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="cart-item-price" style={{ minWidth: '80px', textAlign: 'right' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button onClick={() => removeFromCart(item.id)} className="btn-remove" title="Remove Item">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary btn-checkout">
            Proceed to Checkout
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
