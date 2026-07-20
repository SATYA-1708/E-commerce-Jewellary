import { useEffect } from 'react';

export const CartFlyEffect = () => {
  useEffect(() => {
    const animate = (event: Event) => {
      const image = (event as CustomEvent<{ image?: string }>).detail?.image;
      const cart = document.querySelector<HTMLElement>('[title="Shopping Cart"]');
      if (!image || !cart) return;

      const destination = cart.getBoundingClientRect();
      const jewel = document.createElement('img');
      jewel.src = image;
      jewel.className = 'cart-fly-jewel';
      jewel.style.left = `${window.innerWidth / 2 - 32}px`;
      jewel.style.top = `${window.innerHeight / 2 - 32}px`;
      jewel.style.setProperty('--fly-x', `${destination.left + destination.width / 2 - window.innerWidth / 2}px`);
      jewel.style.setProperty('--fly-y', `${destination.top + destination.height / 2 - window.innerHeight / 2}px`);
      document.body.appendChild(jewel);
      cart.classList.remove('cart-arrival');
      window.setTimeout(() => cart.classList.add('cart-arrival'), 420);
      window.setTimeout(() => jewel.remove(), 900);
    };
    window.addEventListener('product-added', animate);
    return () => window.removeEventListener('product-added', animate);
  }, []);
  return null;
};
