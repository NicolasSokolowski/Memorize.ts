import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./ui/Home";
import DecksList from "./features/deck/DecksList";
import UserLayout from "./ui/UserLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "user",
        element: <UserLayout />,
        children: [
          {
            path: "/user/decks",
            element: <DecksList />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
