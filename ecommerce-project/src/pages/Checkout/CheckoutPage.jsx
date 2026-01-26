import axios from 'axios';
import { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import './CheckoutPage.css';

function CheckoutPage({ cart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);

    useEffect(() => {
        const getCheckoutData = async () => {
            let response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
            setDeliveryOptions(response.data);

            response = await axios.get('/api/payment-summary');
            setPaymentSummary(response.data);
        };

        getCheckoutData();
    }, []);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/cart-favicon.png" />

            <CheckoutHeader cart={cart} />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <OrderSummary cart={cart} deliveryOptions={deliveryOptions} />

                    <PaymentSummary paymentSummary={paymentSummary} />
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;