import { OrderDetails } from "./OrderDetails";
import { OrdersHeader } from "./OrdersHeader";

export function OrdersGrid({ orders }) {
    return (
        orders.map((order) => {
            return (
                <div key={order.id} className="order-container">
                    <div className="order-header">
                        <OrdersHeader order={order} />
                    </div>

                    <div className="order-details-grid">
                        <OrderDetails order={order} />
                    </div>
                </div>
            );
        })
    );
};