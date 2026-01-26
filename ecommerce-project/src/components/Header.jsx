import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router'; // It knows which page is loaded and adds an "active" class to the link
import './Header.css';

function Header({ cart }) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(search || '');
    const navigate = useNavigate();

    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });

    const handleSearch = () => {
        console.log("Searching for:", searchTerm);
        navigate(`/?search=${searchTerm}`);
    }

    return (
        <div className="header">
            <div className="left-section">
                <NavLink to="/" className="header-link"> {/* Instead of <a href="/"> we use <Link to="/"> */ }
                    <img className="logo"
                        src="images/logo-white.png" />
                    <img className="mobile-logo"
                        src="images/mobile-logo-white.png" />
                </NavLink>
            </div>

            <div className="middle-section">
                <input 
                    className="search-bar" 
                    type="text" 
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button 
                    className="search-button"
                    onClick={handleSearch}
                >
                    <img className="search-icon" src="images/icons/search-icon.png" />
                </button>
            </div>

            <div className="right-section">
                <NavLink className="orders-link header-link" to="/orders">

                    <span className="orders-text">Orders</span>
                </NavLink>

                <NavLink className="cart-link header-link" to="/checkout">
                    <img className="cart-icon" src="images/icons/cart-icon.png" />
                    <div className="cart-quantity">{totalQuantity}</div>
                    <div className="cart-text">Cart</div>
                </NavLink>
            </div>
        </div>
    );
}

export default Header;