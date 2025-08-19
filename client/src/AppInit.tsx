import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { getProfile } from "./store/user/userThunk";

function AppInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return <>{children}</>;
}

export default AppInit;
