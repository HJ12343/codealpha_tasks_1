import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_URL } from '../context/AuthContext';
import { Search, ShoppingCart, Info } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useContext(CartContext);

  const categories = ['All', 'Electronics', 'Fitness', 'Office', 'Kitchen', 'Travel'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (sortBy) queryParams.append('sortBy', sortBy);

        const response = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, search, sortBy]);

  return (
    <div>
      <div className="catalog-header">
        <div className="catalog-title">
          <h1>Explore Products</h1>
        </div>
        <div className="catalog-controls">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '14px', top: '13px' }}
            />
          </div>
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="cart-empty" style={{ margin: '40px 0' }}>
          <h2 className="cart-empty-title">No products found</h2>
          <p className="cart-empty-desc">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <span className="product-category-tag">{product.category}</span>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/products/${product.id}`} className="btn-secondary" style={{ padding: '10px' }} title="Product Details">
                      <Info size={16} />
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn-primary"
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
