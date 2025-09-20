import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setLastPath } from "../store/user/userSlice";

const EXCLUDED = ["/", "/login", "/signup", "/user/decks"];

export default function LastPathSaver() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { pathname, search, hash } = location;
    if (!EXCLUDED.includes(pathname)) {
      dispatch(setLastPath(pathname + search + hash));
    }
  }, [location, dispatch]);

  return null;
}
