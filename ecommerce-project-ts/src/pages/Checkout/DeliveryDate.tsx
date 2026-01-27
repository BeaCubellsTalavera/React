import dayjs from 'dayjs';
import type { DeliveryDateProps } from '../../types';

export function DeliveryDate({ cartItem, deliveryOptions }: DeliveryDateProps) {
    const selectedDeliveryOption = deliveryOptions.find((option) => {
        return option.id === cartItem.deliveryOptionId;
    });

    return (
        <div className="delivery-date">
            Delivery date: {selectedDeliveryOption?.estimatedDeliveryTimeMs && dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
        </div>
    );
};