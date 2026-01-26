import { DeliveryOptions } from './DeliveryOptions';
import { CartItemDetails } from './CartItemDetails';
import { DeliveryDate } from './DeliveryDate';

export function OrderSummary({ cart, deliveryOptions }) {
    return (
        <div className="order-summary">
            {
                deliveryOptions.length > 0 && cart.map((cartItem) => {
                    <DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />

                    return (
                        <div key={cartItem.productId} className="cart-item-container">
                            

                            <div className="cart-item-details-grid">
                                <CartItemDetails cartItem={cartItem} />

                                <DeliveryOptions cartItem={cartItem} deliveryOptions={deliveryOptions} />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};