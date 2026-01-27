import { it, expect, describe, vi, beforeEach, type MockedFunction } from 'vitest';
import { render, screen, within } from '@testing-library/react'; // within let's us look for things inside a specific element
import { MemoryRouter, useLocation } from 'react-router'; // Special router for testing purposes
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import axios from 'axios';
import { PaymentSummary } from './PaymentSummary';
import type { PaymentSummaryData } from '../../types';

vi.mock('axios');
// vi.mock('axios', () => ({
//     default: {
//         post: vi.fn()
//     }
// }));

describe('PaymentSummary component', () => {
    let loadCart: MockedFunction<() => Promise<void>>;
    let paymentSummary: PaymentSummaryData;
    let user: UserEvent;

    beforeEach(() => {
        loadCart = vi.fn(); // Create a new mock function before each test

        paymentSummary = {
            "totalItems": 17,
            "productCostCents": 22973,
            "shippingCostCents": 499,
            "totalCostBeforeTaxCents": 23472,
            "taxCents": 2347,
            "totalCostCents": 25819
        };

        user = userEvent.setup();
    });

    it('displays the payment summary details correctly', async () => {
        render(
            <MemoryRouter> {/* MemoryRouter is needed because PaymentSummary uses useNavigate that needs to be inside a Router */}
                <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
            </MemoryRouter>
        );

        expect(
            screen.getByText('Items (17):')
        ).toBeInTheDocument();

        // There are multiple ways to check the text inside an element.
        // 1. within() + getByText() + toBeInTheDocument()
        expect(
            within(screen.getByTestId('payment-summary-product-cost'))
                .getByText('$229.73')
        ).toBeInTheDocument();

        // 2. getByTestId() + toHaveTextContent()
        // (toHaveTextContent() checks the text inside an element)
        // This solution is a little cleaner in this case.
        expect(
            screen.getByTestId('payment-summary-shipping-cost')
        ).toHaveTextContent('$4.99');

        expect(
            screen.getByTestId('payment-summary-total-before-tax')
        ).toHaveTextContent('$234.72');

        expect(
            screen.getByTestId('payment-summary-tax')
        ).toHaveTextContent('$23.47');

        expect(
            screen.getByTestId('payment-summary-total')
        ).toHaveTextContent('$258.19');
    });

    it('place order button works correctly and navigates to orders page', async () => {
        function Location() {
            const location = useLocation();
            return <div data-testid="url-path">{location.pathname}</div>;
        }

        render(
            <MemoryRouter>
                <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
                <Location />
            </MemoryRouter>
        );

        const placeOrderButton = screen.getByTestId('place-order-button');
        await user.click(placeOrderButton);

        expect(axios.post).toHaveBeenCalledWith('/api/orders');
        expect(loadCart).toHaveBeenCalled();
        expect(screen.getByTestId('url-path')).toHaveTextContent('/orders');
    });
});