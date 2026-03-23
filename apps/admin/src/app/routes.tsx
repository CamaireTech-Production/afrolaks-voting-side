import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminCategories from "../pages/AdminCategories";
import AdminNominees from "../pages/AdminNominees";
import AdminVotes from "../pages/AdminVotes";
import AdminPodcasts from "../pages/AdminPodcasts";
import AdminContacts from "../pages/AdminContacts";
import AdminGallery from "../pages/AdminGallery";
import { PrivateRoute } from "../components/PrivateRoute";

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
            { index: true, element: <Dashboard /> },
            { path: "categories", element: <AdminCategories /> },
            { path: "nominees", element: <AdminNominees /> },
            { path: "votes", element: <AdminVotes /> },
            { path: "podcasts", element: <AdminPodcasts /> },
            { path: "contacts", element: <AdminContacts /> },
            { path: "gallery", element: <AdminGallery /> },
        ],
    },
]);
