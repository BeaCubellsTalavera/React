import axios from "axios";
import { useState } from "react";
import { formatMoney } from "../../utils/money";

export function CartItemDetails({ cartItem, loadCart }) {
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);
    const [quantity, setQuantity] = useState(cartItem.quantity);

    const deleteCartItem = async () => {
        await axios.delete(`/api/cart-items/${cartItem.productId}`);
        loadCart();
    };

    const enterEditingMode = async () => {
        if (isEditingQuantity) {
            await axios.put(`/api/cart-items/${cartItem.productId}`, {
                quantity
            });
            loadCart();
        }
        setIsEditingQuantity(!isEditingQuantity);
    };

    const updateQuantity = (event) => {
        const quantitySelected = Number(event.target.value);
        setQuantity(quantitySelected);
    };

    const handleKeyDown = (event) => {
        const pressedKey = event.key;
        if (pressedKey === 'Enter') {
            enterEditingMode();
        }
        if (pressedKey === 'Escape') {
            setQuantity(cartItem.quantity);
            setIsEditingQuantity(false);
        }
    }

    return (
        <>
            <img className="product-image"
                src={cartItem.product.image} />

            <div className="cart-item-details">
                <div className="product-name">
                    {cartItem.product.name}
                </div>
                <div className="product-price">
                    {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                    <span>
                        Quantity: <div>
                            {
                                isEditingQuantity 
                                    ? <input 
                                        type="text" 
                                        className="update-quantity-input"
                                        onChange={updateQuantity}
                                        onKeyDown={handleKeyDown}
                                    />
                                    : <span className="quantity-label">{cartItem.quantity}</span>
                            }
                        </div>
                    </span>
                    <span 
                        className="update-quantity-link link-primary"
                        onClick={enterEditingMode}
                    >
                        Update
                    </span>
                    <span 
                        className="delete-quantity-link link-primary"
                        onClick={deleteCartItem}
                    >
                        Delete
                    </span>
                </div>
            </div>
        </>
    );
};