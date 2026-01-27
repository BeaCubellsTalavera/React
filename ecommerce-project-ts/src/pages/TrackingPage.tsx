import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import dayjs from 'dayjs';
import type { Order } from '../types';
import './TrackingPage.css';

function TrackingPage() {
    const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const getOrderData = async () => {
            if (!orderId) return;
            const response = await axios.get<Order>(`/api/orders/${orderId}?expand=products`);
            setOrder(response.data);
        };

        getOrderData();
    }, [orderId]);

    if (!order) {
        return null;
    }

    const orderProduct = order.products.find(op => op.productId === productId);
    
    if (!orderProduct) {
        return <div>Product not found in this order</div>;
    }

    const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
    const elapsedTimeMs = dayjs().valueOf() - order.orderTimeMs;
    const progressPercentage = (elapsedTimeMs / totalDeliveryTimeMs) * 100;

    const isPreparing = progressPercentage < 33;
    const isShipped = progressPercentage >= 33 && progressPercentage < 100;
    const isDelivered = progressPercentage >= 100;
    return (
        <>
            <title>Tracking</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/tracking-favicon.png" />

            <div className="tracking-page">
                <div className="order-tracking">
                    <Link className="back-to-orders-link link-primary" to="/orders">
                        View all orders
                    </Link>

                    <div className="delivery-date">
                        {progressPercentage >= 100 ? 'Delivered' : 'Arriving'} on {dayjs(order.deliveryDate).format('dddd, MMMM D')}
                    </div>

                    <div className="product-info">
                        {orderProduct.product?.name}
                    </div>

                    <div className="product-info">
                        Quantity: {orderProduct.quantity}
                    </div>

                    <img className="product-image" src={orderProduct.product?.image} />

                    <div className="progress-labels-container">
                        <div className={`progress-label ${isPreparing && 'current-status'}`}>
                            Preparing
                        </div>
                        <div className={`progress-label ${isShipped && 'current-status'}`}>
                            Shipped
                        </div>
                        <div className={`progress-label ${isDelivered && 'current-status'}`}>
                            Delivered
                        </div>
                    </div>

                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrackingPage;