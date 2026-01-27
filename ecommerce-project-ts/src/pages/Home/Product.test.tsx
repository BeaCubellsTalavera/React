import { it, expect, describe, vi, beforeEach, type MockedFunction } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import axios from 'axios'; // This is already a mocked version of axios because of the vi.mock call
import { Product } from './Product';
import type { Product as ProductType } from '../../types';

vi.mock('axios');
// vi.mock('axios', () => ({
//     default: {
//         post: vi.fn()
//     }
// }));

describe('Product component', () => {
    let product: ProductType;
    let loadCart: MockedFunction<() => Promise<void>>;
    let user: UserEvent;

    beforeEach(() => {
        product = {
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
                stars: 4.5,
                count: 87
            },
            priceCents: 1090,
            keywords: ["socks", "sports", "apparel"]
        };

        loadCart = vi.fn(); // Mock function that does nothing
        user = userEvent.setup();
    });

    it('displays the product details correctly', () => {
        render(<Product product={product} loadCart={loadCart} />);
        expect(screen.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();
        expect(screen.getByText('$10.90')).toBeInTheDocument();
        expect(screen.getByTestId('product-image')).toHaveAttribute('src', 'images/products/athletic-cotton-socks-6-pairs.jpg');
        expect(screen.getByTestId('product-rating-stars')).toHaveAttribute('src', 'images/ratings/rating-45.png');
        expect(screen.getByText('87')).toBeInTheDocument();
    });

    it('adds a product to the cart', async () => {
        render(<Product product={product} loadCart={loadCart} />);
        const addToCartButton = screen.getByTestId('add-to-cart-button');

        await user.click(addToCartButton);

        expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1
        });
        expect(loadCart).toHaveBeenCalled();
    });

    it('changes quantity when a different quantity is selected', async () => {
        render(<Product product={product} loadCart={loadCart} />);

        const quantitySelect = screen.getByTestId('product-quantity-select');
        expect(quantitySelect).toHaveValue('1');

        await user.selectOptions(quantitySelect, '3');
        
        expect(quantitySelect).toHaveValue('3');
    });

    it('adds a product to the cart with the selected quantity', async () => {
        render(<Product product={product} loadCart={loadCart} />);

        const quantitySelect = screen.getByTestId('product-quantity-select');
        await user.selectOptions(quantitySelect, '3');

        const addToCartButton = screen.getByTestId('add-to-cart-button');
        await user.click(addToCartButton);

        expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 3
        });
        expect(loadCart).toHaveBeenCalled();
    });
});