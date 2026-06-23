import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import AppRouter from './router/index';
import './styles/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </StrictMode>
);
