import axios from 'axios';
import { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import type { CheckoutPageProps, DeliveryOption, PaymentSummaryData } from '../../types';
import './CheckoutPage.css';

function CheckoutPage({ cart, loadCart }: CheckoutPageProps) {
    const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
    const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryData | null>(null);

    useEffect(() => {
        const getDeliveryOptions = async () => {
            const response = await axios.get<DeliveryOption[]>('/api/delivery-options?expand=estimatedDeliveryTime');
            setDeliveryOptions(response.data);
        };

        getDeliveryOptions();
    }, []);

    useEffect(() => {
        const getPaymmentSummary = async () => {
            const response = await axios.get<PaymentSummaryData>('/api/payment-summary');
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

                    {paymentSummary && <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />}
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;