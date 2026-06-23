import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import CartDrawer from '../components/CartDrawer/CartDrawer';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetailPage';

function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <div className="page-wrapper">
        <Outlet />
      </div>
      <CartDrawer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,            element: <HomePage /> },
      { path: 'product/:id',   element: <ProductDetailPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
