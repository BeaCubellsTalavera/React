import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ProductsGrid } from './ProductsGrid';
import type { HomePageProps, Product } from '../../types';
import './HomePage.css';

function HomePage({ loadCart }: HomePageProps) {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const getHomeData = async () => {
            const url = search ? `/api/products?search=${search}` : '/api/products';
            const response = await axios.get<Product[]>(url);
            setProducts(response.data);
        };

        getHomeData(); // We cannot do async directly in useEffect
    }, [search]);

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/home-favicon.png" />

            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart} />
            </div>
        </>
    );
}

export default HomePage;