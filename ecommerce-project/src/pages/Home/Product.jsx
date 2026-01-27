import { useState } from "react";
import axios from "axios";
import { formatMoney } from "../../utils/money";

export function Product({ product, loadCart }) {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const addToCart = async () => {
        await axios.post('/api/cart-items', {
            productId: product.id,
            quantity
        });
        await loadCart();
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    const selectQuantity = (event) => {
        const quantitySelected = Number(event.target.value);
        setQuantity(quantitySelected);
    };

    return (
        <div className="product-container"
            data-testid={"product-container"}
        >
            <div className="product-image-container">
                <img className="product-image"
                    data-testid="product-image" // to be able to find the image element in the test, we could use the class name but it we would break the test
                    src={product.image} />
            </div>
            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img className="product-rating-stars"
                    data-testid="product-rating-stars"
                    src={`images/ratings/rating-${product.rating.stars * 10}.png`} />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                {formatMoney(product.priceCents)}
            </div>

            <div className="product-quantity-container">
                <select
                    value={quantity}
                    onChange={selectQuantity}
                    data-testid="product-quantity-select"
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart" style={{ opacity: addedToCart ? 1 : 0 }}>
                <img src="images/icons/checkmark.png" />
                Added
            </div>

            <button
                className="add-to-cart-button button-primary"
                data-testid="add-to-cart-button"
                onClick={addToCart}>
                Add to Cart
            </button>
        </div>
    );
}