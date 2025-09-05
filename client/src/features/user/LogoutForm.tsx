import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/user/userThunk";
import { onCancelProp } from "../../types/user";
import ChoiceButton from "../../ui/ChoiceButton";

function LogoutForm({ onCancel }: onCancelProp) {
  const dispatch = useAppDispatch();

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dispatch(logout());
    onCancel();
  };

  return (
    <div className="mb-6 flex size-full flex-col justify-start rounded-lg bg-tertiary shadow-custom-light lg:mx-4">
      <h3 className="m-4 text-center font-patua text-2xl text-textPrimary">
        Me déconnecter
      </h3>
      <form
        onSubmit={handleSubmit()}
        className="mx-12 flex flex-1 flex-col justify-center gap-5"
      >
        <p className="text-center font-patua text-xl text-textPrimary">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </p>
        <ChoiceButton width="24" gap="gap-20" onCancel={onCancel} />
      </form>
    </div>
  );
}

export default LogoutForm;
