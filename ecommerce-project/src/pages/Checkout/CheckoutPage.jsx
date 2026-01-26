import axios from 'axios';
import { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import './CheckoutPage.css';

// window.axios = axios; // Make axios globally accessible for testing purposes from console in inspector

function CheckoutPage({ cart, loadCart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);

    useEffect(() => {
        const getDeliveryOptions = async () => {
            const response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
            setDeliveryOptions(response.data);
        };

        getDeliveryOptions();
    }, []);

    useEffect(() => {
        const getPaymmentSummary = async () => {
            const response = await axios.get('/api/payment-summary');
            setPaymentSummary(response.data);
        };

        getPaymmentSummary();
    }, [cart]);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/cart-favicon.png" />

            <CheckoutHeader cart={cart} />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />

                    <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;