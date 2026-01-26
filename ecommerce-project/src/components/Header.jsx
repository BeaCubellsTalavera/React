import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router'; // It knows which page is loaded and adds an "active" class to the link
import './Header.css';

function Header({ cart }) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(search || '');
    const navigate = useNavigate();
    const debounceTimer = useRef(null);
    const isManualSearch = useRef(false);

    // Debounced search - busca automáticamente después de 500ms de inactividad
    useEffect(() => {
        // Si es búsqueda manual, no ejecutar auto-search
        if (isManualSearch.current) {
            isManualSearch.current = false; // Reset flag
            return;
        }

        // Cancela el timer anterior si existe
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                console.log("Auto-searching for:", searchTerm);
                navigate(`/?search=${searchTerm}`);
            } else if (searchTerm === '') {
                // Si el campo está vacío, ir a la página principal
                console.log("Clearing search, going to home");
                navigate('/');
            }
        }, 500); // Espera 500ms después de que el usuario deje de teclear

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchTerm, navigate]); // Intencionalmente excluimos 'search' para evitar doble ejecución

    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });

    const handleSearch = () => {
        // Marca que es búsqueda manual para evitar auto-search
        isManualSearch.current = true;
        
        // Cancela cualquier timer pendiente
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        
        console.log("Manual search for:", searchTerm);
        navigate(`/?search=${searchTerm}`);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
                    onKeyDown={handleKeyPress}
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