import { DeliveryOptions } from './DeliveryOptions';
import { CartItemDetails } from './CartItemDetails';
import { DeliveryDate } from './DeliveryDate';

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
    return (
        <div className="order-summary">
            {
                deliveryOptions.length > 0 && cart.map((cartItem) => {
                    <DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />

                    return (
                        <div key={cartItem.productId} className="cart-item-container">
                            

                            <div className="cart-item-details-grid">
                                <CartItemDetails cartItem={cartItem} loadCart={loadCart} />

                                <DeliveryOptions cartItem={cartItem} deliveryOptions={deliveryOptions} loadCart={loadCart} />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};