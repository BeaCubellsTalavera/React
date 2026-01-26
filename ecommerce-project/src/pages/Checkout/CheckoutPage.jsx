import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import { formatMoney } from '../../utils/money';
import './CheckoutPage.css';

function CheckoutPage({ cart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);

    useEffect(() => {
        axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
            .then((response) => {
                setDeliveryOptions(response.data);
            });
    }, []);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/cart-favicon.png" />

            <CheckoutHeader />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <div className="order-summary">
                        {
                            deliveryOptions.length > 0 && cart.map((item) => {
                                const selectedDeliveryOption = deliveryOptions.find((option) => {
                                    return option.id === item.deliveryOptionId;
                                });

                                return (
                                    <div key={item.productId} className="cart-item-container">
                                        <div className="delivery-date">
                                            Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                                        </div>

                                        <div className="cart-item-details-grid">
                                            <img className="product-image"
                                                src={item.product.image} />

                                            <div className="cart-item-details">
                                                <div className="product-name">
                                                    {item.product.name}
                                                </div>
                                                <div className="product-price">
                                                    {formatMoney(item.product.priceCents)}
                                                </div>
                                                <div className="product-quantity">
                                                    <span>
                                                        Quantity: <span className="quantity-label">{item.quantity}</span>
                                                    </span>
                                                    <span className="update-quantity-link link-primary">
                                                        Update
                                                    </span>
                                                    <span className="delete-quantity-link link-primary">
                                                        Delete
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="delivery-options">
                                                <div className="delivery-options-title">
                                                    Choose a delivery option:
                                                </div>
                                                {
                                                    deliveryOptions.map((option) => {
                                                        let priceString = 'FREE Shipping';

                                                        if (option.priceCents > 0) {
                                                            priceString = `${formatMoney(option.priceCents)} - Shipping`;
                                                        }

                                                        return (
                                                            <div key={option.id} className="delivery-option">
                                                                <input type="radio" 
                                                                    checked={option.id === item.deliveryOptionId}
                                                                    className="delivery-option-input"
                                                                    name={`delivery-option-${item.productId}`} />
                                                                <div>
                                                                    <div className="delivery-option-date">
                                                                        {dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                                                                    </div>
                                                                    <div className="delivery-option-price">
                                                                        {priceString}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="payment-summary">
                        <div className="payment-summary-title">
                            Payment Summary
                        </div>

                        <div className="payment-summary-row">
                            <div>Items (3):</div>
                            <div className="payment-summary-money">$42.75</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Shipping &amp; handling:</div>
                            <div className="payment-summary-money">$4.99</div>
                        </div>

                        <div className="payment-summary-row subtotal-row">
                            <div>Total before tax:</div>
                            <div className="payment-summary-money">$47.74</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Estimated tax (10%):</div>
                            <div className="payment-summary-money">$4.77</div>
                        </div>

                        <div className="payment-summary-row total-row">
                            <div>Order total:</div>
                            <div className="payment-summary-money">$52.51</div>
                        </div>

                        <button className="place-order-button button-primary">
                            Place your order
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;