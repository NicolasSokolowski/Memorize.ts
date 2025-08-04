import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";

type UsernameFormProps = {
  onCancel: () => void;
};

function UsernameForm({ onCancel }: UsernameFormProps) {
  const [usernameEdited, setUsernameEdited] = useState("");
  const username = useAppSelector((state) => state.user.user?.username);

  useEffect(() => {
    if (username) {
      setUsernameEdited(username);
    }
  }, [username]);

  return (
    <>
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Modifier mon nom
      </h3>
      <div className="mx-12 flex flex-1 flex-col justify-center">
        <label
          htmlFor="username"
          className="ml-1 font-patua text-xl text-textPrimary"
        >
          Nom d'utilisateur
        </label>
        <input
          type="text"
          className="my-2 h-10 rounded-lg pl-3 font-patua text-lg text-textPrimary shadow-inner-strong"
          value={usernameEdited}
          onChange={(e) => setUsernameEdited(e.target.value)}
        />
        <div className="mt-5 flex w-full justify-center gap-20">
          <button type="button">
            <img
              src="/cancelation.png"
              alt="Cancelation icon"
              onClick={onCancel}
              className="w-24"
              draggable={false}
            />
          </button>
          <button type="submit" className="mr-2">
            <img
              src="/validation.png"
              alt="Validation icon"
              className="w-20"
              draggable={false}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default UsernameForm;
