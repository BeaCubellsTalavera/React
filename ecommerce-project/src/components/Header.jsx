import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useSearchParams, useLocation } from 'react-router'; // It knows which page is loaded and adds an "active" class to the link
import './Header.css';

function Header({ cart }) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(search || '');
    const navigate = useNavigate();
    const location = useLocation();
    const debounceTimer = useRef(null);
    const lastSearchTerm = useRef(search || '');
    const justNavigated = useRef(false);

    // Debounced search - solo se ejecuta cuando el usuario escribe
    useEffect(() => {
        // Si acabamos de navegar, no ejecutar auto-search
        if (justNavigated.current) {
            justNavigated.current = false;
            lastSearchTerm.current = searchTerm;
            return;
        }

        // Si el searchTerm no ha cambiado realmente, no hacer nada
        if (searchTerm === lastSearchTerm.current) {
            return;
        }

        // Cancela el timer anterior si existe
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Solo crear timer si hay texto y estamos escribiendo
        if (searchTerm.trim() !== '') {
            debounceTimer.current = setTimeout(() => {
                console.log("Auto-searching for:", searchTerm);
                justNavigated.current = true; // Marcar que vamos a navegar
                lastSearchTerm.current = searchTerm;
                navigate(`/?search=${searchTerm}`);
            }, 500);
        } else if (searchTerm === '' && location.pathname === '/' && search) {
            // Solo limpiar si estamos en home y había una búsqueda previa
            debounceTimer.current = setTimeout(() => {
                console.log("Clearing search");
                justNavigated.current = true; // Marcar que vamos a navegar
                lastSearchTerm.current = '';
                navigate('/');
            }, 500);
        }

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]); // Solo depende de searchTerm para evitar loops infinitos

    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });

    const handleSearch = () => {
        // Cancela cualquier timer pendiente para evitar búsquedas duplicadas
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        
        console.log("Manual search for:", searchTerm);
        justNavigated.current = true; // Marcar que vamos a navegar
        lastSearchTerm.current = searchTerm;
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