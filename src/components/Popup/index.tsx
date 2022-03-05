import React from "react";

const Popup = ({
  show,
  onClose,
  children,
}: {
  show: Boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      {show && (
        <div className="fixed top-0 left-0 w-screen h-screen animate__animated animate__bounceIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white rounded-xl shadow-xl p-8 max-w-[800px] w-4/5 max-h-screen overflow-auto overflow-x-hidden"
          >
            {children}
            <button
              onClick={() => onClose()}
              className="icon-cross p-2 absolute right-2 top-0 text-lg"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
