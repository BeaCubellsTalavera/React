import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react'; // within let's us look for things inside a specific element
import { MemoryRouter } from 'react-router'; // Special router for testing purposes
import userEvent from '@testing-library/user-event';
import axios from 'axios'; // This is already a mocked version of axios because of the vi.mock call
import HomePage from './HomePage';

vi.mock('axios'); // Mock an entire npm package

describe('HomePage component', () => {
    let loadCart;
    let user;

    beforeEach(() => {
        loadCart = vi.fn(); // Mock function that does nothing
        axios.post.mockClear(); // I can reset only one specific mocked method

        axios.get.mockImplementation(async (urlPath) => {
            if (urlPath === '/api/products') {
                return {
                    data: [
                        {
                            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
                            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
                            rating: {
                                stars: 4.5,
                                count: 87
                            },
                            priceCents: 1090,
                            keywords: ["socks", "sports", "apparel"]
                        },
                        {
                            id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                            image: "images/products/intermediate-composite-basketball.jpg",
                            name: "Intermediate Size Basketball",
                            rating: {
                                stars: 4,
                                count: 127
                            },
                            priceCents: 2095,
                            keywords: ["sports", "basketballs"]
                        }
                    ]
                };
            }
            if (urlPath === '/api/products?search=laptop') {
                return {
                    data: [
                        {
                            id: "d5a764cd-2f11-456f-81cd-714adec6ba34",
                            image: "images/products/laptop-sleeve.jpg",
                            name: "Laptop Sleeve",
                            rating: {
                                stars: 3.5,
                                count: 25
                            },
                            priceCents: 200199,
                            keywords: ["tech", "computer"]
                        }
                    ]
                };
            }

        }); // Mock axios.get to return products data

        user = userEvent.setup();
    });

    // afterEach(() => {
    //     vi.clearAllMocks(); // I can clear all mocks after each test
    // });

    it('displays the products correctly', async () => {
        render(
            <MemoryRouter> {/* MemoryRouter is needed because HomePage uses Link components that need to be inside a Router */}
                <HomePage cart={[]} loadCart={loadCart} />
            </MemoryRouter>
        );

        const productContainers = await screen.findAllByTestId('product-container');
        expect(productContainers.length).toBe(2); // We expect 2 products to be rendered
        // We use findAllByTestId because it's async due to the data fetching, it does the same as get but waits until the element appears

        expect(within(productContainers[0]).getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();

        expect(within(productContainers[1]).getByText('Intermediate Size Basketball')).toBeInTheDocument();
    });

    it('add to cart buttons work correctly', async () => {
        render(
            <MemoryRouter>
                <HomePage cart={[]} loadCart={loadCart} />
            </MemoryRouter>
        );

        const productContainers = await screen.findAllByTestId('product-container');
        const addToCartButton1 = within(productContainers[0])
            .getByTestId('add-to-cart-button');
        await user.click(addToCartButton1);

        const addToCartButton2 = within(productContainers[1])
            .getByTestId('add-to-cart-button');
        await user.click(addToCartButton2);

        expect(axios.post).toHaveBeenNthCalledWith(1, '/api/cart-items', {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1
        });
        expect(axios.post).toHaveBeenNthCalledWith(2, '/api/cart-items', {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1
        });
        expect(loadCart).toHaveBeenCalledTimes(2);
    });

    it('add to cart buttons add products with correct quantities', async () => {
        render(
            <MemoryRouter>
                <HomePage cart={[]} loadCart={loadCart} />
            </MemoryRouter>
        );

        const productContainers = await screen.findAllByTestId('product-container');

        const quantitySelector1 = within(productContainers[0])
            .getByTestId('product-quantity-select');
        await user.selectOptions(quantitySelector1, '2');

        const addToCartButton1 = within(productContainers[0])
            .getByTestId('add-to-cart-button');
        await user.click(addToCartButton1);

        const quantitySelector2 = within(productContainers[1])
            .getByTestId('product-quantity-select');
        await user.selectOptions(quantitySelector2, '3');

        const addToCartButton2 = within(productContainers[1])
            .getByTestId('add-to-cart-button');
        await user.click(addToCartButton2);

        expect(axios.post).toHaveBeenNthCalledWith(1, '/api/cart-items', {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2
        });
        expect(axios.post).toHaveBeenNthCalledWith(2, '/api/cart-items', {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 3
        });
        expect(loadCart).toHaveBeenCalledTimes(2);
    });

    it('filters products by the search term from URL params', async () => {
        render(
            <MemoryRouter initialEntries={['/?search=laptop']}>
                <HomePage cart={[]} loadCart={loadCart} />
            </MemoryRouter>
        );

        const productContainers = await screen.findAllByTestId('product-container');
        expect(productContainers.length).toBe(1);
        expect(axios.get).toHaveBeenCalledWith('/api/products?search=laptop');
    });
});