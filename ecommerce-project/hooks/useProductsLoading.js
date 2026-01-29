import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useProductsLoading({ search, pageNumber }) {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setProducts([]);
    }, [search]);

    useEffect(() => {
        console.log('Is loading?', isLoading);
        setIsLoading(true);

        let cancel;
        axios({
            method: 'GET',
            url: '/api/products/paginated',
            params: { limit: 9, page: pageNumber, search },
            cancelToken: new axios.CancelToken(c => {
                console.log('Setting cancel token');
                cancel = c
            })
        }).then(res => {
            setProducts(prevProducts => {
                return [...new Set([...prevProducts, ...res.data.products])];
            });
            setHasMore(res.data.pagination.hasNextPage);

            console.log('Fetched products for page', pageNumber, ':', res.data.products);
        })
        .catch(e => {
            if (axios.isCancel(e)) {
                console.log('Request canceled');
                return;
            }
        })
        .finally(() => {setIsLoading(false)});

        return () => cancel();
    }, [search, pageNumber]);

    return { isLoading, products, hasMore };
};