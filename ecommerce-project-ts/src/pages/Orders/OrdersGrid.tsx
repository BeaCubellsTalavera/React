import { OrderDetails } from './OrderDetails';
import { OrdersHeader } from './OrdersHeader';
import type { OrdersGridProps } from '../../types';

export function OrdersGrid({ orders, loadCart }: OrdersGridProps) {
    return (
        orders.map((order) => {
            return (
                <div key={order.id} className="order-container">
                    <div className="order-header">
                        <OrdersHeader order={order} />
                    </div>

                    <div className="order-details-grid">
                        <OrderDetails order={order} loadCart={loadCart} />
                    </div>
                </div>
            );
        })
    );
};