import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_URL } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, Check, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="cart-empty" style={{ margin: '40px 0' }}>
        <h2 className="cart-empty-title">Error</h2>
        <p className="cart-empty-desc">{error || 'Something went wrong.'}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </Link>

      <div className="detail-container">
        <div className="detail-image-box">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="detail-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
            }}
          />
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">${product.price.toFixed(2)}</div>
          <p className="detail-desc">{product.description}</p>

          <div style={{ marginBottom: '30px' }}>
            {product.stock > 0 ? (
              <span className="stock-indicator stock-in">
                <Check size={16} />
                <span>In Stock ({product.stock} units available)</span>
              </span>
            ) : (
              <span className="stock-indicator stock-out">
                <AlertCircle size={16} />
                <span>Out of Stock</span>
              </span>
            )}
          </div>

          <div className="detail-actions">
            <button
              onClick={() => addToCart(product)}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '16px' }}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={18} />
              <span>Add to Shopping Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
