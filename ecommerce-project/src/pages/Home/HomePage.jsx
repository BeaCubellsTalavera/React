import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductsGrid } from './ProductsGrid';
import Header from '../../components/Header';
import './HomePage.css';

function HomePage({ cart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products') // Axios is a cleaner way to do requests to the backend
            .then((response) => {
                setProducts(response.data);
            });
    }, []); // Run it just once when the component is mounted

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="https://supersimple.dev/images/home-favicon.png" />

            <Header cart={cart} />

            <div className="home-page">
                <ProductsGrid products={products} />
            </div>
        </>
    );
}

export default HomePage;