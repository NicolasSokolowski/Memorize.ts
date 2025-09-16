import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import FormSelector from "./FormSelector";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export type UserModification = "none" | EditActions;
type EditActions =
  | "edit-username"
  | "edit-email"
  | "edit-password"
  | "logout"
  | "delete-user";

function UserProfile() {
  const [visibleForm, setVisibleForm] = useState<UserModification>("none");
  const [isEditing, setIsEditing] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation("auth");
  const [language, setLanguage] = useState(i18next.language);

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

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
  const actions: EditActions[] = [
    "edit-username",
    "edit-email",
    "edit-password",
    "logout",
    "delete-user"
  ];

  return (
    <div className="scrollbar-hide h-full overflow-y-auto">
      <div className="mb-4 mt-20 flex h-100 flex-col items-center gap-8 sm:mt-6 md:justify-start  lg:ml-20 lg:h-80 lg:flex-row lg:gap-12">
        <div className="flex size-64 animate-pop items-center justify-center rounded-full bg-tertiary shadow-custom-light transition-all duration-300">
          <div className="size-52 rounded-full bg-white shadow-inner-strong" />
        </div>
        <div className="h-24 font-patua text-xl sm:text-2xl">
          <div className="flex h-12 items-center justify-center sm:flex-none lg:justify-start">
            <span className="text-textPrimary">
              {t("usernameCol")} <span>{user?.username}</span>
            </span>
          </div>
          <div className="mx-auto flex h-12 w-full items-center sm:flex-none">
            <span className="justify-center break-words text-center text-textPrimary lg:break-normal lg:text-start">
              {t("emailCol")} <span>{user?.email}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mx-16 mb-12 flex justify-center sm:mb-8 lg:justify-start">
        <div className="mb-8 flex w-96 flex-col gap-4 lg:mx-4 lg:w-112">
          {actions.map((key) => (
            <div key={key}>
              {visibleForm === key && (
                <FormSelector
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  visibleForm={visibleForm}
                  setVisibleForm={setVisibleForm}
                  className="mb-4 w-96 sm:block lg:hidden"
                />
              )}
              <button
                className={`h-16 w-96 animate-pop rounded-md shadow-custom-light transition-all duration-500 ${
                  visibleForm === key
                    ? "bg-tertiary text-textPrimary"
                    : "bg-secondary text-white"
                }`}
                value={key}
                onClick={handleEdit}
              >
                <span className="font-patua text-xl">
                  {t(`buttons.${key}`)}
                </span>
              </button>
            </div>
          ))}
        </div>
        <FormSelector
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          visibleForm={visibleForm}
          setVisibleForm={setVisibleForm}
          className="hidden size-96 lg:block"
        />
      </div>
      <div className="mb-24 flex h-16 w-96 font-patua text-xl text-textPrimary lg:ml-20">
        <div className="flex w-1/3 items-center justify-center">
          <label htmlFor="language">Langue :</label>
        </div>
        <div className="flex w-2/3 justify-end">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex w-full appearance-none rounded-md bg-secondary text-center text-white shadow-custom-light"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
