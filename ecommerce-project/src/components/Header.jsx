import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router'; // It knows which page is loaded and adds an "active" class to the link
import './Header.css';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';

function Header({ cart }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const urlSearchTerm = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

    useEffect(() => {
        setSearchTerm(urlSearchTerm);
    }, [urlSearchTerm]);

    const navigateWithSearch = useCallback((term) => {
        const trimmedTerm = term.trim();
        const currentTrimmedTerm = (searchParams.get('search') || '').trim();
        
        if (trimmedTerm === currentTrimmedTerm){
            return;
        }

        if (!trimmedTerm) {
            if (location.pathname === '/') {
                setSearchParams({});
            }
            return;
        }

        navigate(`/?search=${encodeURIComponent(term)}`);
    }, [navigate, location.pathname, setSearchParams, searchParams]);

   const { debounced: debouncedNavigate, cancel } = useDebounceCallback(navigateWithSearch, 500); 

    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        cancel();
        navigateWithSearch(searchTerm);
    }

    const handleChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        debouncedNavigate(newSearchTerm);
    }

    return (
        <div className="header">
            <div className="left-section">
                <NavLink to="/" className="header-link"> {/* Instead of <a href="/"> we use <Link to="/"> */}
                    <img className="logo"
                        src="images/logo-white.png"
                        data-testid="header-logo" />
                    <img className="mobile-logo"
                        src="images/mobile-logo-white.png"
                        data-testid="header-mobile-logo" />
                </NavLink>
            </div>

            <form 
                className="middle-section" 
                onSubmit={handleSubmit}
            >
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    data-testid="header-search-bar"
                />

                <button
                    className="search-button"
                    type="submit"
                    data-testid="header-search-button"
                >
                    <img className="search-icon" src="images/icons/search-icon.png" />
                </button>
            </form>

            <div className="right-section">
                <NavLink className="orders-link header-link" to="/orders"
                    data-testid="header-orders-link"
                >

                    <span className="orders-text">Orders</span>
                </NavLink>

                <NavLink className="cart-link header-link" to="/checkout"
                    data-testid="header-cart-link"
                >
                    <img className="cart-icon" src="images/icons/cart-icon.png" />
                    <div className="cart-quantity">{totalQuantity}</div>
                    <div className="cart-text">Cart</div>
                </NavLink>
            </div>
        </div>
    );
}

export default Header;