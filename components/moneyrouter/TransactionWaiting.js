import React from "react";

function TransactionWaiting({
  setLoading,
  theme,
  showTransactionError,
  setTransactionError,
  showTransactionCompleted,
  setTransactionCompleted,
  streamContent,
}) {
  //   console.log(showTransactionError);
  return (
    <div className="flex flex-col justify-between w-[100%]">
      <div
        className="modal-transaction-waiting relative rounded-xl overflow-hidden flex flex-col justify-between"
        id="notification-box"
      >
        <div className="absolute top-[32px] right-[32px] w-max-w">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 0 24 24"
            width="36px"
            className="cursor-pointer hover:bg-[#10bb3514] p-[2px] rounded-lg"
            fill="#10bb35"
            onClick={() => {
              setTransactionError();
              setTransactionCompleted();
              setLoading(false);
            }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        {showTransactionError ? (
          <div className="max-w-[100%]">
            <div className="absolute top-[32px] left-[32px] py-2 font-[600]">
              <p
                className={`${
                  theme === "dark" ? "text-[#ffffff]" : "text-[#000000]"
                }`}
              >
                Error
              </p>
            </div>
            <div className="warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="36px"
                viewBox="0 0 24 24"
                width="36px"
                fill="rgb(242, 104, 91)"
                className="mx-2 min-w-[20px]"
              >
                <path d="M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm-.01-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-3h-2v-2h2v2z" />
              </svg>
              <p className="break-all text-[0.865rem]">
                {showTransactionError}
              </p>
            </div>
            <div className="set-permission-button">
              <button
                onClick={() => {
                  setTransactionError();
                  setTransactionCompleted();
                  setLoading(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : showTransactionCompleted ? (
          <div className="flex flex-col justify-center items-center w-full">
            <div class="mt-[40px] border-[4px] p-4 rounded-full border-[#10bb35]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 0 24 24"
                width="48px"
                fill="#10bb35"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M13 19V7.83l4.88 4.88c.39.39 1.03.39 1.42 0 .39-.39.39-1.02 0-1.41l-6.59-6.59c-.39-.39-1.02-.39-1.41 0l-6.6 6.58c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L11 7.83V19c0 .55.45 1 1 1s1-.45 1-1z" />
              </svg>
            </div>
            <h1
              className={`text-[1.5rem] font-[600] mt-6 ${
                theme === "dark" ? "text-[#ffffff]" : "text-[#000000]"
              }`}
            >
              Transaction broadcasted
            </h1>
            <div className="set-permission-button w-full">
              <button
                onClick={() => {
                  setTransactionError();
                  setTransactionCompleted();
                  setLoading(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div class="lds-ring my-[40px]">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h1
              className={`text-[1.5rem] font-[600] mt-6 ${
                theme === "dark" ? "text-[#ffffff]" : "text-[#000000]"
              }`}
            >
              Waiting for the transaction approval... (Goerli)
            </h1>
            <p
              className={`m-0 p-0 text-[1.1rem] font-[600] mt-2 ${
                theme === "dark" ? "text-[#ffffffc7]" : "text-[#000000]"
              }`}
            >
              {streamContent}
            </p>
          </div>
        )}
      </div>
      <div
        className="overlay-transaction-waiting"
        onClick={() => {
          setTransactionError();
          setTransactionCompleted();
          setLoading(false);
        }}
      ></div>
    </div>
  );
}

export default TransactionWaiting;
