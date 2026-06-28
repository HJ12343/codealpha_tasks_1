import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, ShoppingBag, User, LogOut, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <ShoppingBag size={26} color="#6366f1" />
          <span>E-Shop</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              <div className="cart-icon-container">
                <ShoppingCart size={20} />
                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
              </div>
              <span>Cart</span>
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/orders" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <ClipboardList size={18} />
                  <span>Orders</span>
                </NavLink>
              </li>
              <li>
                <span className="navbar-link" style={{ cursor: 'default', color: 'var(--text-main)' }}>
                  <User size={16} style={{ marginRight: '2px' }} />
                  {user.name}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
