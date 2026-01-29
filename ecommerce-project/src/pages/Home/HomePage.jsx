import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';
import useProductsLoading from '../../../hooks/useProductsLoading';

function HomePage({ loadCart }) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const [pageNumber, setPageNumber] = useState(1);
    const { isLoading, products, hasMore } = useProductsLoading({ search, pageNumber });
    
    useEffect(() => {
        setPageNumber(1);
    }, [search]);
    
    const observerRef = useRef();
    const lastProductElementRef = useCallback(node => {
        console.log('lastProductElementRef called with node:', node);
        if (isLoading) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('Last product is intersecting, loading next page');
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        });
        if (node) observerRef.current.observe(node);
    }, [isLoading, hasMore]);

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/home-favicon.png" />

            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart} lastProductElementRef={lastProductElementRef} />
            </div>
        </>
    );
}

export default HomePage;