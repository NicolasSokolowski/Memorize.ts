import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./ui/Home";
import DecksList from "./features/deck/DecksList";
import UserLayout from "./ui/UserLayout";
import CardsList from "./features/card/CardsList";
import DeckModeSelection from "./features/training/DeckModeSelection";

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
          },
          {
            path: "/user/decks/:deckId/cards",
            element: <CardsList />
          },
          {
            path: "/user/training",
            element: <DeckModeSelection />
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
