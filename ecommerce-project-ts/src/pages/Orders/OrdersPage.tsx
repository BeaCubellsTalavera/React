import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrdersGrid } from './OrdersGrid';
import type { OrdersPageProps, Order } from '../../types';
import './OrdersPage.css';

function OrdersPage({ loadCart }: OrdersPageProps) {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getOrdersData = async () => {
            const response = await axios.get<Order[]>('/api/orders?expand=products');
            setOrders(response.data);
        };

        getOrdersData();
    }, []);

    return (
        <>
            <title>Orders</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/orders-favicon.png" />

            <div className="orders-page">
                <div className="page-title">Your Orders</div>

                <div className="orders-grid">
                    <OrdersGrid orders={orders} loadCart={loadCart} />
                </div>
            </div>
        </>
    );
}

export default OrdersPage;