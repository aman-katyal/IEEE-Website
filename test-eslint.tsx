import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";
const HomePage = React.lazy(() => Promise.resolve({ default: () => <div>Home</div> }));
export const router = createBrowserRouter([{ path: "/", element: <HomePage /> }]);
