import { useEffect, useRef, useState } from "react";

type ErrorProps = {
  error: {
    fields: string[];
    messages: string[];
  };
};

function Error({ error }: ErrorProps) {
  const [errorMsgIndex, setErrorMsgIndex] = useState(0);
  const [msgHeight, setMsgHeight] = useState(0);
  const msgRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error.messages.length > 0) {
      const timeout = setTimeout(() => {
        setErrorMsgIndex((prev) =>
          prev < error.messages.length - 1 ? prev + 1 : 0
        );
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [errorMsgIndex, error.messages]);

  useEffect(() => {
    if (msgRef.current) {
      setMsgHeight(msgRef.current.offsetHeight);
    }
  }, [errorMsgIndex, error.messages]);
  return (
    <div
      className="absolute bottom-0 flex w-full items-center justify-center overflow-hidden rounded-b-md bg-error transition-all duration-500 ease-in-out"
      style={{ height: msgHeight }}
    >
      <p
        ref={msgRef}
        className="px-3 py-2 text-center font-patua text-base text-white text-opacity-85 sm:text-sm"
      >
        {error.messages[errorMsgIndex]}
      </p>
    </div>
  );
}

export default Error;
