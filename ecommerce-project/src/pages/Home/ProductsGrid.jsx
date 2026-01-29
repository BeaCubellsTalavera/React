import { Product } from './Product';

export function ProductsGrid({ products, loadCart, lastElementRef }) {
    return (
        <div className="products-grid">
            {products.map((product, index) => {
                return (
                    <Product 
                        key={product.id} 
                        product={product} 
                        loadCart={loadCart} 
                        ref={index === products.length - 1 ? lastElementRef : null}
                    />
                );
            })}
        </div>
    );
}