import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./ui/Home";
import DecksList from "./features/deck/DecksList";
import UserLayout from "./ui/UserLayout";
import CardsList from "./features/card/CardsList";
import DeckModeSelection from "./features/training/DeckModeSelection";
import DeckSelection from "./features/training/deck/DeckSelection";
import DeckTraining from "./features/training/DeckTraining";
import UserProfile from "./features/user/UserProfile";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppInit from "./AppInit";
import SearchBarLayout from "./ui/SearchBarLayout";

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
        element: <ProtectedRoute allowedRoles={[1, 2]} />,
        children: [
          {
            element: <UserLayout />,
            children: [
              {
                path: "",
                element: <SearchBarLayout />,
                children: [
                  {
                    path: "decks",
                    element: <DecksList />
                  },
                  {
                    path: "decks/:deckId/cards",
                    element: <CardsList />
                  }
                ]
              },
              {
                path: "training/mode",
                element: <DeckModeSelection />
              },
              {
                path: "training/decks",
                element: <DeckSelection />
              },
              {
                path: "profile",
                element: <UserProfile />
              }
            ]
          }
        ]
      },
      {
        path: "/training",
        element: <ProtectedRoute allowedRoles={[1, 2]} />,
        children: [
          {
            path: "",
            element: <DeckTraining />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <AppInit>
      <RouterProvider router={router} />
    </AppInit>
  );
}

export default App;
