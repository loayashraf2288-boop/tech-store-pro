import React from "react";
import { Outlet, Link } from "react-router-dom";

function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#111",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h2>Admin Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/dashboard" style={{ color: "#fff" }}>Home</Link>
          <Link to="/dashboard/products" style={{ color: "#fff" }}>Products</Link>
          <Link to="/dashboard/orders" style={{ color: "#fff" }}>Orders</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        {/* 🔥 أهم سطر بيحل المشكلة */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
