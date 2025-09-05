import { onCancelProp } from "../types/user";

interface ChoiceButtonProps extends onCancelProp {
  width: string;
  gap: string;
}

function ChoiceButton({ onCancel, width, gap }: ChoiceButtonProps) {
  const widthNumber = parseInt(width, 10);
  const widthStringified = `w-${widthNumber}`;
  const widthStringifiedReduced = `w-${widthNumber - 4}`;

  return (
    <div className={`${gap} flex w-full justify-center`}>
      <button type="button">
        <img
          src="/cancelation.png"
          alt="Cancelation icon"
          onClick={onCancel}
          className={widthStringified}
          draggable={false}
        />
      </button>
      <button type="submit" className="mr-2">
        <img
          src="/validation.png"
          alt="Validation icon"
          className={widthStringifiedReduced}
          draggable={false}
        />
      </button>
    </div>
  );
}

export default ChoiceButton;
