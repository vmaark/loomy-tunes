import React, {
  FC,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Address } from "viem";

import { UIDispatchContext } from "@/state/UIContext";

const Editable: FC<{ text: string; address: Address; placeholder: string }> = ({
  text,
  address,
  placeholder,
}) => {
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useContext(UIDispatchContext);

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing === true) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];

    if (
      inputRef.current != null &&
      inputRef.current?.value !== "" &&
      (key === "Enter" || key === "Tab")
    ) {
      dispatch({
        type: "set-address-name",
        address,
        label: inputRef.current.value,
      });
    }
    if (keys.indexOf(key) > -1 || allKeys.indexOf(key) > -1) {
      setEditing(false);
    }
  };

  return (
    <section>
      {isEditing ? (
        <div>
          <input
            ref={inputRef}
            className="w-48 appearance-none rounded border-2 border-none py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            name="task"
            placeholder="e.g. hot wallet"
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => handleKeyDown(e)}
            // value={label}
            // onChange={(e) => {
            //   console.log(e);
            // }}
          />
        </div>
      ) : (
        <div
          className="m-0 h-10 w-48 whitespace-pre-wrap rounded border-none py-2 px-3 leading-tight text-gray-700 hover:border-2"
          onClick={() => setEditing(true)}
        >
          <span className={`${text ? "text-black" : "text-gray-500"}`}>
            {text || placeholder || "Editable content"}
          </span>
        </div>
      )}
    </section>
  );
};

export default Editable;
