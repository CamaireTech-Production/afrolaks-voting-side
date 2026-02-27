import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { PrivateRoute } from "../components/PrivateRoute";

// Placeholder components for the admin pages
const AdminHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-white mb-6 uppercase">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome to the Afrolaks Awards administration panel.</p>
    </div>
);

const AdminCategories = () => (
    <div>
        <h1 className="text-3xl font-bold text-white mb-6 uppercase">Manage Categories</h1>
        <p className="text-gray-400">Category management coming soon.</p>
    </div>
);

const AdminNominees = () => (
    <div>
        <h1 className="text-3xl font-bold text-white mb-6 uppercase">Manage Nominees</h1>
        <p className="text-gray-400">Nominee management coming soon.</p>
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <PrivateRoute />,
        children: [
            { index: true, element: <AdminHome /> },
            { path: "categories", element: <AdminCategories /> },
            { path: "nominees", element: <AdminNominees /> },
        ],
    },
]);
