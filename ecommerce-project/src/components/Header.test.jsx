import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import * as ReactRouter from 'react-router';

vi.mock('axios'); // Mock an entire npm package

describe('Header component', () => {
    let cart;
    let user;

    beforeEach(() => {
        cart = [{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 3,
            deliveryOptionId: '2'
        }];

        user = userEvent.setup();
    });

    it('displays the header correctly', () => {
        render(
            <MemoryRouter>
                <Header cart={cart} />
            </MemoryRouter>
        );
    });

    describe('Search functionality', () => {
        it('displays the search term from URL params in the search input', () => {
            render(
                <MemoryRouter initialEntries={['/?search=laptop']}>
                    <Header cart={[]} />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            expect(searchInput).toHaveValue('laptop');
        });

        it('navigates to the correct URL when a search is performed and the user clicks the search button', async () => {
            function Location() {
                const location = useLocation();
                return <div data-testid="url-path">{location.pathname + location.search}</div>;
            }

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Header cart={[]} />
                    <Location />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');
            expect(screen.getByTestId('url-path').textContent).toBe('/');

            const searchButton = screen.getByTestId("header-search-button");
            await act(async () => {
                await user.click(searchButton);
            });

            expect(screen.getByTestId('url-path').textContent).toBe('/?search=phone');
        });

        it('navigates to the correct URL when a search is performed and the user presses Enter', async () => {
            function Location() {
                const location = useLocation();
                return <div data-testid="url-path">{location.pathname + location.search}</div>;
            }

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Header cart={[]} />
                    <Location />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');
            expect(screen.getByTestId('url-path').textContent).toBe('/');

            await act(async () => {
                await user.keyboard('{Enter}');
            });

            expect(screen.getByTestId('url-path').textContent).toBe('/?search=phone');
        });

        it('navigates to the correct URL when a search is performed and the user stops typing for more than 500ms', async () => {
            function Location() {
                const location = useLocation();
                return <div data-testid="url-path">{location.pathname + location.search}</div>;
            }

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Header cart={[]} />
                    <Location />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');
            expect(screen.getByTestId('url-path').textContent).toBe('/');
            // Wait for more than 500ms to allow the debounced function to execute
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 600));
            });

            expect(screen.getByTestId('url-path').textContent).toBe('/?search=phone');
        });

        it('navigates to the correct URL when a search is performed and it comes from another page', async () => {
            function Location() {
                const location = useLocation();
                return <div data-testid="url-path">{location.pathname + location.search}</div>;
            }

            render(
                <MemoryRouter initialEntries={['/orders']}>
                    <Header cart={[]} />
                    <Location />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');
            expect(screen.getByTestId('url-path').textContent).toBe('/orders');

            const searchButton = screen.getByTestId("header-search-button");
            await act(async () => {
                await user.click(searchButton);
            });

            expect(screen.getByTestId('url-path')).toHaveTextContent('/?search=phone');
        });

        it('cancels auto-search when manual search is performed before debounce', async () => {
            let navigationCount = 0;

            function Location() {
                const location = useLocation();
                // Count each URL change
                if (location.search) {
                    navigationCount++;
                }
                return <div data-testid="url-path">{location.pathname + location.search}</div>;
            }

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Header cart={[]} />
                    <Location />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');

            // Click BEFORE the debounce (500ms) is fulfilled
            await new Promise(resolve => setTimeout(resolve, 200)); // Only 200ms

            const searchButton = screen.getByTestId("header-search-button");

            await act(async () => {
                await user.click(searchButton);
            });

            // Verify immediate navigation
            expect(screen.getByTestId('url-path')).toHaveTextContent('/?search=phone');

            // Wait to see if the auto-search also executes
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 600)); // Total: 600ms
            });

            // There should have been just 1 navigation
            expect(navigationCount).toBe(1);
        });

        it('prevents duplicate navigation when manual search cancels auto-search', async () => {
            const mockNavigate = vi.fn();
            const navigateSpy = vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate);

            render(
                <MemoryRouter initialEntries={['/']}>
                    <Header cart={[]} />
                </MemoryRouter>
            );

            const searchInput = screen.getByTestId("header-search-bar");
            await user.type(searchInput, 'phone');

            // Manual search before debounce
            await new Promise(resolve => setTimeout(resolve, 200));
            const searchButton = screen.getByTestId("header-search-button");

            await act(async () => {
                await user.click(searchButton);
            });

            // Wait for the debounce time to pass
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 600));
            });

            // There should have been just 1 navigation
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/?search=phone');

            // Clean up the spy
            navigateSpy.mockRestore();
        });
    });
});