import React, { useEffect, useState } from "react";
import Image from "next/image";
import test from "../public/test.jpg";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { useAccount, useSigner } from "wagmi";

function PushNotification({ setNotificationModal, theme }) {
  const { address } = useAccount();
  const [showOptedIn, setOptedIn] = useState(false);
  const [msgs, setmsgs] = useState([]);
  const { data: signerwagmi } = useSigner();

  const externaImageLoader = ({ src }) =>
    `https://static2.taglivros.com/${src}`;

  const PK = `${process.env.NEXT_PUBLIC_PUSH_CHANNEL_PKEY}`;
  const Pkey = `0x${PK}`;
  const signer = new ethers.Wallet(Pkey);

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signerwagmi,
      channelAddress: "eip155:5:0x619058Cc41aB48e0Ac3D86B09C7bFE68B8b0dcbe", // channel address in CAIP
      userAddress: `eip155:5:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
        setOptedIn(true);
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  };

  const optOut = async () => {
    await PushAPI.channels.unsubscribe({
      signer: signerwagmi,
      channelAddress: "eip155:5:0x619058Cc41aB48e0Ac3D86B09C7bFE68B8b0dcbe", // channel address in CAIP
      userAddress: `eip155:5:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt out success");
      },
      onError: () => {
        console.error("opt out error");
      },
      env: "staging",
    });
  };

  const fetchMessages = async () => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });
    console.log(subscriptions);
    for (let i = 0; i < subscriptions.length; i++) {
      if (
        subscriptions[i].channel ===
        "0x619058Cc41aB48e0Ac3D86B09C7bFE68B8b0dcbe"
      ) {
        console.log("Opted");
        setOptedIn(true);
      }
    }
    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });
    console.log(notifications);
    setmsgs(notifications);
  };

  useEffect(() => {
    fetchMessages();
  }, [address]);
  return (
    <div>
      <div
        className="modal relative rounded-md overflow-hidden"
        id="notification-box"
      >
        <div className="flex justify-between w-full bg-[#10bb35] px-4 py-2 text-[#ffffff] font-semibold items-center sticky top-0 border border-[#10bb35]">
          <h1 className=" ">Notifications</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#ffffff"
            className="cursor-pointer"
            onClick={() => setNotificationModal(false)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        {showOptedIn ? (
          <>
            <div className="flex flex-col">
              {msgs.map((item, key) => {
                return (
                  <div
                    key={key}
                    className="flex flex-row border-b w-full m-0 p-2 hover:bg-[#10bb3514] cursor-pointer items-center notification-inner-box"
                    onClick={() =>
                      window.open(`https://goerli.etherscan.io/tx/${item.cta}`)
                    }
                  >
                    <div className="mr-[10px] max-w-[40px]">
                      <Image
                        unoptimized
                        src={item.icon}
                        alt="profile"
                        width={40}
                        height={40}
                        className=" rounded-xl min-w-[40px]"
                      />
                    </div>
                    <div>
                      <h6
                        className={`m-0 p-0 font-[600] ${
                          theme === "dark" ? "text-[#ffffff]" : null
                        }`}
                      >
                        {item.title}
                      </h6>
                      <span
                        className={`p-0 m-0 text-[0.85rem] ${
                          theme === "dark" ? "text-[#ffffffC7]" : null
                        }`}
                      >
                        {item.message}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center p-2 sticky bottom-0">
              <button
                className="bg-[#10bb3514] text-[#10bb35] p-1 px-4 rounded-lg font-[600] hover:bg-[#10bb3520]"
                onClick={() => optOut()}
              >
                Opt Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row border-b w-full m-0 p-2 hover:bg-[#10bb3514] cursor-pointer items-center notification-inner-box">
              <div className="mr-[10px] max-w-[40px]">
                {/* <Image src={test} alt="profile" className=" rounded-xl" /> */}
              </div>
              <div>
                <h6
                  className={`m-0 p-0 font-[600] ${
                    theme === "dark" ? "text-[#ffffff]" : null
                  }`}
                >
                  Superfluid Frontend channel
                </h6>
                <span
                  className={`p-0 m-0 text-[0.85rem] ${
                    theme === "dark" ? "text-[#ffffffC7]" : null
                  }`}
                >
                  Opt in this channel in order to get notifications. channel
                  Address - 0x619058Cc41aB48e0Ac3D86B09C7bFE68B8b0dcbe
                </span>
              </div>
            </div>
            <div className="text-center p-2 sticky bottom-0">
              <button
                className="bg-[#10bb3514] text-[#10bb35] p-1 px-4 rounded-lg font-[600] hover:bg-[#10bb3520]"
                onClick={() => optIn()}
              >
                Opt In
              </button>
            </div>
          </>
        )}
      </div>
      <div
        className="overlay"
        onClick={() => setNotificationModal(false)}
      ></div>
    </div>
  );
}

export default PushNotification;
