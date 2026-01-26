import Header from '../components/Header';

function NotFoundPage({ cart }) {
    return (
        <>
            <title>Page Not Found</title>

            <Header cart={cart}/>

            <div>
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </>
    );
}

export default NotFoundPage;