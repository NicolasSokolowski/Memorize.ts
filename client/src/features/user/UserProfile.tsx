import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProfile } from "../../store/user/userThunk";

type UserModification = "none" | `edit-${EditActions}`;
type EditActions = "username";

function UserProfile() {
  const [isEditing, setIsEditing] = useState<UserModification>("none");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const hasBeenFetchedOnce = useAppSelector(
    (state) => state.user.hasBeenFetchedOnce
  );

  useEffect(() => {
    if (!hasBeenFetchedOnce) {
      dispatch(getProfile());
    }
  }, [dispatch, hasBeenFetchedOnce]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as EditActions;

    if (isEditing === "none") {
      setIsEditing(`edit-${value}`);
    } else {
      setIsEditing("none");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-96 items-center justify-center">
        <div className="flex size-80 items-center justify-center rounded-full bg-tertiary shadow-xl">
          <img className="size-64 rounded-full bg-white shadow-inner-strong" />
        </div>
      </div>
      <div className="mx-20 mt-4 h-32 font-patua text-2xl">
        <div className="h-16">
          <span className="ml-52 text-textPrimary">
            Nom d'utilisateur : <span>{user?.username}</span>
          </span>
        </div>
        <div className="h-16">
          <span className="ml-52 text-textPrimary">
            Adresse e-mail : <span>{user?.email}</span>
          </span>
        </div>
      </div>
      <div className="mx-20 flex h-96 justify-center gap-32">
        <div className="m-5 flex w-112 flex-col gap-4">
          <button
            className={`h-16 w-full rounded-md shadow-md ${isEditing === "edit-username" ? "bg-tertiary text-textPrimary" : "bg-secondary text-white"}`}
            value="username"
            onClick={(e) => handleEdit(e)}
          >
            <span className="font-patua text-xl">
              Modifier mon nom d'utilisateur
            </span>
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 2
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 3
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 4
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 5
          </button>
        </div>
        <div className="m-4 w-1/4 rounded-lg bg-tertiary shadow-lg"></div>
      </div>
    </div>
  );
}

export default UserProfile;
