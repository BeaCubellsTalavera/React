import { useSearchParams } from 'react-router';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import { useCallback, useRef } from 'react';
import axios from 'axios';

function HomePage({ loadCart }) {
    const pageSize = 9;
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const cancelTokenRef = useRef(null);

    const fetchProducts = useCallback(async (pageNumber) => {
        console.log('Fetching products for page', pageNumber);
        
        // Cancelar request anterior si existe
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('New request initiated');
        }
        
        // Crear nuevo cancel token
        const cancelTokenSource = axios.CancelToken.source();
        cancelTokenRef.current = cancelTokenSource;
        
        const params = { limit: pageSize, page: pageNumber };
        if (search) params.search = search;

        try {
            const response = await axios({
                method: 'GET',
                url: '/api/products/paginated',
                params,
                cancelToken: cancelTokenSource.token
            });
            
            console.log('Fetched products for page', pageNumber, ':', response.data.products);
            return {
                items: response.data.products || [],
                hasMore: response.data.pagination.hasNextPage || false
            };
        } catch (e) {
            if (axios.isCancel(e)) {
                console.log('Request cancelled:', e.message);
                throw e; // Re-lanzar si es cancelación
            }
            console.error('Error fetching products:', e);
            return {
                items: [],
                hasMore: false
            };
        }
    }, [pageSize, search]);

    const { data: products, lastElementRef } = useInfiniteScroll(fetchProducts, {
        initialPage: 1,
        threshold: '100px'
    });

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/home-favicon.png" />

            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart} lastElementRef={lastElementRef} />
            </div>
        </>
    );
}

export default HomePage;