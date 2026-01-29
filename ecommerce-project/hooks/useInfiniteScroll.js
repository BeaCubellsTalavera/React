import { useEffect, useState, useRef, useCallback } from 'react';

export default function useInfiniteScroll(fetchCallback, options = {}) {
    const { initialPage = 1, threshold = '100px' } = options;
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    const observerRef = useRef();

    // Reset function
    const reset = useCallback(() => {
        setData([]);
        setPageNumber(initialPage);
        setIsLoading(false);
        setHasMore(true);
        setError(null);
    }, [initialPage]);

    const loadMore = useCallback(async () => {
        if (isLoading) return;
        console.log('Loading more items for page', pageNumber);

        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchCallback(pageNumber);
            console.log('Hook result:', result);
            const newItems = Array.isArray(result.items) ? result.items : [];

            setData(prevData => [...new Set([...prevData, ...newItems])]);
            setPageNumber(prev => prev + 1);
            setHasMore(result.hasMore || false);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCallback, pageNumber]); // Removido isLoading de las dependencias

    // Callback para el último elemento
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        }, {
            rootMargin: `0px 0px ${threshold} 0px`
        });

        if (node) {
            observerRef.current.observe(node);
        }
    }, [isLoading, hasMore, loadMore, threshold]);

    useEffect(() => {
        // Solo cargar en el primer mount
        if (pageNumber === initialPage && data.length === 0) {
            loadMore();
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []); // Dependencias vacías - solo se ejecuta una vez al montar

    return { data, isLoading, hasMore, error, loadMore, reset, lastElementRef };
};