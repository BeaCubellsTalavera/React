import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ProductsGrid } from './ProductsGrid';
import type { HomePageProps, Product, User } from '../../types';
import './HomePage.css';
import { hasPermission } from '../../auth/auth';

const adminUser: User = {
    id: "some-admin-id",
    role: "admin",
    name: "Admin User",
    age: 35
};

const user: User = {
    id: "some-user-id",
    role: "user",
    name: "John Doe",
    age: 30
};

const authorId = "some-user-id";

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
                {
                    hasPermission(adminUser, "view:products") 
                        && <ProductsGrid products={products} loadCart={loadCart} />
                }
            </div>

            {
                (hasPermission(user, "update:products")
                || (
                    hasPermission(user, "update:ownProducts")
                    && user.id === authorId
                ))
                && (
                    <div>
                        Dummy update own products test
                    </div>
                )
            }
            
        </>
    );
}

export default HomePage;