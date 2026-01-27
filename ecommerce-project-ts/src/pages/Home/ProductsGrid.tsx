import { Product } from './Product';
import type { ProductsGridProps } from '../../types';

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
    return (
        <div className="products-grid">
            {products.map((product) => {
                return (
                    <Product key={product.id} product={product} loadCart={loadCart} />
                );
            })}
        </div>
    );
}