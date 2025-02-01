"use client"; // Asegura que este archivo se ejecute solo en el cliente
import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          Space of Sport
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className="nav-link active">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className="nav-link">
                Products
              </Link>
            </li>

            {/* Lista Desplegable */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link href="/products" className="dropdown-item">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=shirts" className="dropdown-item">
                    Sports Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=pants" className="dropdown-item">
                    Sports Pants
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=shorts" className="dropdown-item">
                    Sports Shorts
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=socks" className="dropdown-item">
                    Sports Socks
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=hats" className="dropdown-item">
                    Sports Hats
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=shoes" className="dropdown-item">
                    Sports Shoes
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link href="/Cart" className="nav-link">
                Cart
              </Link>
            </li>

            {/* Opción ProductsAdmin */}
            <li className="nav-item">
              <Link href="/Products" className="nav-link">
                Products Admin
              </Link>
            </li>
          </ul>

          {/* Formulario de búsqueda con el botón verde */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
