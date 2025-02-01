// src/app/index.jsx
import React from 'react';
import styles from '../styles/StartPageModule.css';

const HomePage = () => {
  return (
    <div>
      {/* Main Content */}
      <main className={styles.main}>
        <h1>¡Bienvenido a Space of Sport!</h1>
        <p>Encuentra los mejores productos deportivos en un solo lugar.</p>
        <div className={styles.buttons}>
          <a href="/products" className={styles.btn}>
            Ver Productos
          </a>
          <a href="/cart" className={styles.btn}>
            Ir al Carrito
          </a>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
