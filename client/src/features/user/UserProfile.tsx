import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProfile } from "../../store/user/userThunk";
import UsernameForm from "./UsernameForm";
import PasswordForm from "./PasswordForm";
import LogoutForm from "./LogoutForm";
import DeleteAccount from "./DeleteAccount";

type UserModification = "none" | EditActions;
type EditActions = "edit-username" | "edit-password" | "logout" | "delete-user";

function UserProfile() {
  const [visibleForm, setVisibleForm] = useState<UserModification>("none");
  const [isEditing, setIsEditing] = useState(false);
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
    const nextForm = `${value}` as UserModification;

    if (visibleForm === nextForm) {
      setIsEditing(false);
      setTimeout(() => {
        setVisibleForm("none");
      }, 1000);
    } else {
      setVisibleForm(nextForm);
      setIsEditing(true);
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
        <div className="m-4 flex w-112 flex-col gap-4">
          <button
            className={`h-16 w-full rounded-md shadow-md ${visibleForm === "edit-username" ? "bg-tertiary text-textPrimary" : "bg-secondary text-white"}`}
            value="edit-username"
            onClick={(e) => handleEdit(e)}
          >
            <span className="font-patua text-xl">
              Modifier mon nom d'utilisateur
            </span>
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 2
          </button>
          <button
            className={`h-16 w-full rounded-md shadow-md ${visibleForm === "edit-password" ? "bg-tertiary text-textPrimary" : "bg-secondary text-white"}`}
            value="edit-password"
            onClick={(e) => handleEdit(e)}
          >
            <span className="font-patua text-xl">
              Modifier mon mot de passe
            </span>
          </button>
          <button
            className={`h-16 w-full rounded-md shadow-md ${visibleForm === "logout" ? "bg-tertiary text-textPrimary" : "bg-secondary text-white"}`}
            value="logout"
            onClick={(e) => handleEdit(e)}
          >
            <span className="font-patua text-xl">Me déconnecter</span>
          </button>
          <button
            className={`h-16 w-full rounded-md shadow-md ${visibleForm === "delete-user" ? "bg-tertiary text-textPrimary" : "bg-secondary text-white"}`}
            value="delete-user"
            onClick={(e) => handleEdit(e)}
          >
            <span className="font-patua text-xl">Supprimer mon compte</span>
          </button>
        </div>
        <div className={`flip-profile ${isEditing ? "flip" : ""}`}>
          <div className="flip-box-inner">
            <div className="flip-box-profile-a" />
            <div className="flip-box-profile-edit">
              {visibleForm === "edit-username" && (
                <UsernameForm
                  onCancel={() => {
                    setIsEditing(false);
                    setTimeout(() => setVisibleForm("none"), 800);
                  }}
                />
              )}
              {visibleForm === "edit-password" && (
                <PasswordForm
                  onCancel={() => {
                    setIsEditing(false);
                    setTimeout(() => setVisibleForm("none"), 800);
                  }}
                />
              )}
              {visibleForm === "logout" && (
                <LogoutForm
                  onCancel={() => {
                    setIsEditing(false);
                    setTimeout(() => setVisibleForm("none"), 800);
                  }}
                />
              )}
              {visibleForm === "delete-user" && (
                <DeleteAccount
                  onCancel={() => {
                    setIsEditing(false);
                    setTimeout(() => setVisibleForm("none"), 800);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
