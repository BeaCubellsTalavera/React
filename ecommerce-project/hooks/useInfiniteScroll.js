import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

export default function useInfiniteScroll({ 
    url, 
    search, 
    limit, 
    dataKey, 
    hasMoreKey,
    resetDependency = search 
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    
    const observerRef = useRef();

    // Resetear datos cuando cambia la dependencia de reset
    useEffect(() => {
        setData([]);
        setPageNumber(1);
    }, [resetDependency]);

    // Fetch data
    useEffect(() => {
        setIsLoading(true);

        let cancel;
        const params = { limit, page: pageNumber };
        if (search) params.search = search;

        axios({
            method: 'GET',
            url,
            params,
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setData(prevData => {
                const newItems = res.data[dataKey] || [];
                return [...new Set([...prevData, ...newItems])];
            });
            // Manejo flexible de hasMore - soporta paths anidados como 'pagination.hasNextPage'
            const hasMoreValue = hasMoreKey.includes('.') 
                ? hasMoreKey.split('.').reduce((obj, key) => obj?.[key], res.data)
                : res.data[hasMoreKey];
            
            setHasMore(hasMoreValue);
        })
        .catch(e => {
            if (axios.isCancel(e)) return;
        })
        .finally(() => {
            setIsLoading(false);
        });

        return () => cancel();
    }, [url, search, pageNumber, limit, dataKey, hasMoreKey]);

    // Callback para el último elemento
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        }, {
            rootMargin: '100px'
        });
        
        if (node) {
            observerRef.current.observe(node);
        }
    }, [isLoading, hasMore]);

    return { isLoading, data, hasMore, lastElementRef };
};