import DeleteAccount from "./DeleteAccount";
import EmailForm from "./EmailForm";
import LogoutForm from "./LogoutForm";
import PasswordForm from "./PasswordForm";
import UsernameForm from "./UsernameForm";
import { UserModification } from "./UserProfile";

interface FormSelectorProp {
  isEditing: boolean;
  setIsEditing: (bool: boolean) => void;
  visibleForm: UserModification;
  setVisibleForm: (form: UserModification) => void;
  className?: string;
}

const formMap: Record<
  UserModification,
  React.ComponentType<{ onCancel: () => void }>
> = {
  "edit-username": UsernameForm,
  "edit-email": EmailForm,
  "edit-password": PasswordForm,
  logout: LogoutForm,
  "delete-user": DeleteAccount,
  none: () => null
};

function FormSelector({
  isEditing,
  setIsEditing,
  visibleForm,
  setVisibleForm,
  className
}: FormSelectorProp) {
  const FormComponent = formMap[visibleForm] || (() => null);

  return (
    <div className={`flip-profile ${isEditing ? "flip" : ""} ${className}`}>
      <div className="flip-box-inner">
        <div className="flip-box-profile-a hidden" />
        <div className="flip-box-profile-edit">
          {visibleForm !== "none" && (
            <FormComponent
              onCancel={() => {
                setIsEditing(false);
                setTimeout(() => setVisibleForm("none"), 800);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FormSelector;
