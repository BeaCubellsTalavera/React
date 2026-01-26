import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrdersGrid } from './OrdersGrid';
import Header from '../../components/Header';
import './OrdersPage.css';

function OrdersPage({ cart }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders?expand=products')
            .then((response) => {
                setOrders(response.data);
            });
    }, []);

    return (
        <>
            <title>Orders</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/orders-favicon.png" />

            <Header cart={cart} />

            <div className="orders-page">
                <div className="page-title">Your Orders</div>

                <div className="orders-grid">
                    <OrdersGrid orders={orders} />
                </div>
            </div>
        </>
    );
}

export default OrdersPage;