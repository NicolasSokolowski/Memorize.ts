import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/user/userThunk";
import { onCancelProp } from "../../types/user";

function LogoutForm({ onCancel }: onCancelProp) {
  const dispatch = useAppDispatch();

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dispatch(logout());
    onCancel();
  };

  return (
    <div className="mx-4 mb-6 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light">
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Me déconnecter
      </h3>
      <form
        onSubmit={handleSubmit()}
        className="mx-12 flex flex-1 flex-col justify-center"
      >
        <p className="text-center font-patua text-xl text-textPrimary">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </p>
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
      </form>
    </div>
  );
}

export default LogoutForm;
