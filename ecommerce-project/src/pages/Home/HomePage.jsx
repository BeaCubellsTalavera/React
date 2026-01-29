import { useSearchParams } from 'react-router';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';

function HomePage({ loadCart }) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    
    const { data: products, lastElementRef } = useInfiniteScroll({ 
        url: '/api/products/paginated',
        search,
        limit: 9,
        dataKey: 'products',
        hasMoreKey: 'pagination.hasNextPage'
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