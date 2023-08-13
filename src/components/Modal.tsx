import { FC, ReactNode } from "react";
import { Button } from "@material-tailwind/react";

export const Modal: FC<{
  onSubmit: () => void;
  onClose: () => void;
  title: string;
  bodyText: string;
  children?: ReactNode;
}> = ({ onSubmit, onClose, title, bodyText, children }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-3xl">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
              <h3 className="text-3xl font-semibold">{title}</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6">
              <p className="my-4 text-lg leading-relaxed text-slate-500">
                {bodyText}
              </p>
              {children}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6 gap-2">
              <Button onClick={onClose}>Close</Button>
              <Button onClick={onSubmit}>Save</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
