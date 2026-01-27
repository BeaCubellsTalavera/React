import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react'; // within let's us look for things inside a specific element
import { MemoryRouter } from 'react-router'; // Special router for testing purposes
import axios from 'axios'; // This is already a mocked version of axios because of the vi.mock call
import HomePage from './HomePage';

vi.mock('axios'); // Mock an entire npm package

describe('HomePage component', () => {
    let loadCart;

    beforeEach(() => {
        loadCart = vi.fn(); // Mock function that does nothing

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

        }); // Mock axios.get to return products data
    });

    it('displays the products correctly', async () => {
        render(
            <MemoryRouter>
                <HomePage cart={[]} loadCart={loadCart} />
            </MemoryRouter>
        );

        const productContainers = await screen.findAllByTestId('product-container');
        expect(productContainers.length).toBe(2); // We expect 2 products to be rendered
        // We use findAllByTestId because it's async due to the data fetching, it does the same as get but waits until the element appears

        const firstProduct = within(productContainers[0]);
        expect(firstProduct.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();

        const secondProduct = within(productContainers[1]);
        expect(secondProduct.getByText('Intermediate Size Basketball')).toBeInTheDocument();
    });
});