import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import options from "../../data/options";
import styled from "@emotion/styled";
import CreateStreamIntoContract from "./CreateStreamIntoContract";
import SendLumpsumIntoContract from "./SendLumpsumIntoContract";

import Image from "next/image";
import gif from "../../public/stream-loop.gif";
import Blockies from "react-blockies";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { createClient } from "urql";

function FlowIntoContract({ theme }) {
  const { address } = useAccount();

  const [showFlowIC, setFlowIC] = useState(true);
  const [showCreateStreamIC, setCreateStreamIC] = useState(false);
  const [balance, setBalane] = useState();
  const [showContractBalance, setContractBalance] = useState();
  // const [showSendLumpsum, setSendLumpsum] = useState(false);

  // integration
  const [allData, setAllData] = useState([]);
  const [show, setShow] = useState(false);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const loadData = async () => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli";
    const convert_address = address.toLocaleLowerCase();
    console.log(convert_address);
    const sendDataQuery = `
    query {
      flowUpdatedEvents(
        where: { sender: "${convert_address}", receiver: "0xec4f34dd62905c4e415899ef659d20c6039d1074"}
        orderBy: timestamp
        orderDirection: desc
      ) {
        receiver
        stream {
          createdAtTimestamp
          currentFlowRate
          updatedAtTimestamp
          streamedUntilUpdatedAt
        }
      }
    }
  `;

    const client = createClient({
      url: APIURL,
    });
    const sendData_ = await client.query(sendDataQuery).toPromise();
    const s_data = sendData_.data.flowUpdatedEvents;
    // console.log(sendData_);
    // console.log(s_data);

    for (let i = 0; i < s_data.length; i++) {
      const d = new Date(parseInt(s_data[i].stream.createdAtTimestamp) * 1000);
      console.log(d);
      const start_date =
        String(d.getDate()) +
        " " +
        String(monthNames[d.getMonth()]) +
        ". " +
        String(d.getFullYear());
      const d1 = new Date(parseInt(s_data[i].stream.updatedAtTimestamp) * 1000);
      const end_date =
        String(d1.getDate()) +
        " " +
        String(monthNames[d1.getMonth()]) +
        ". " +
        String(d1.getFullYear());
      if (s_data[i].stream.currentFlowRate === "0") {
        if (allData.length < s_data.length) {
          if (
            !allData.find(
              (item) => s_data[i].stream.createdAtTimestamp === item[6]
            )
          ) {
            allData.push([
              s_data[i].receiver,
              ethers.utils.formatEther(s_data[i].stream.streamedUntilUpdatedAt),
              false,
              ethers.utils.formatEther(s_data[i].stream.currentFlowRate),
              start_date,
              end_date,
              s_data[i].stream.createdAtTimestamp,
            ]);
          }
        }
      } else {
        if (allData.length < s_data.length) {
          if (
            !allData.find(
              (item) => s_data[i].stream.createdAtTimestamp === item[6]
            )
          ) {
            allData.push([
              s_data[i].receiver,
              ethers.utils.formatEther(s_data[i].stream.streamedUntilUpdatedAt),
              true,
              ethers.utils.formatEther(s_data[i].stream.currentFlowRate),
              start_date,
              end_date,
              s_data[i].stream.createdAtTimestamp,
            ]);
          }
        }
      }
    }
    setAllData(allData);
    setShow(true);
    console.log(allData);
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        const sf = await Framework.create({
          chainId: 5,
          provider: provider,
        });

        const DAIxContract = await sf.loadSuperToken("fDAIx");
        const DAIx = DAIxContract.address;

        try {
          const b = await DAIxContract.balanceOf({
            account: account,
            providerOrSigner: signer,
          });
          const bal = ethers.utils.formatEther(b);
          setBalane(bal);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContractBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        const sf = await Framework.create({
          chainId: 5,
          provider: provider,
        });

        const DAIxContract = await sf.loadSuperToken("fDAIx");
        const DAIx = DAIxContract.address;

        try {
          const b = await DAIxContract.balanceOf({
            account: "0xEc4f34DD62905C4e415899ef659d20C6039D1074",
            providerOrSigner: signer,
          });
          const bal = ethers.utils.formatEther(b);
          console.log(bal);
          setContractBalance(bal);
          // setBalane(bal);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) getBalance();
    getContractBalance();
  }, []);
  useEffect(() => {
    getBalance();
    getContractBalance();
  }, [address]);

  useEffect(() => {
    loadData();
  });

  // *********** styled component
  const StyledSelect = styled(Select)`
    ${({ dropdownRenderer }) =>
      dropdownRenderer &&
      `
		.react-dropdown-select-dropdown {
			overflow: initial;
		}
	`}
  `;

  if (show) {
    return showFlowIC ? (
      <div className="main-container">
        <div className="box-container min-w-[900px]  " id="max-w">
          <div className="set-permission-title">
            <span className="permission-title">Streams Into Contract</span>
          </div>
          {/* **************table to display all the transaction */}
          <div className="max-h-[50vh]  overflow-scroll overflow-x-hidden">
            <table className="dropdown-table w-full">
              <thead>
                {/* <tr>
              <td colSpan={6} className="dropdown-table-td">
                <div className="dropdown-row"></div>
              </td>
            </tr> */}
                <tr>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    To / From
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    All Time Flow
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Flow Rate
                  </th>

                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Start / End Date
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  ></th>
                </tr>
              </thead>
              <tbody>
                {/**************Flow from account to contract***********/}
                {/* **********map from here**********  */}
                {allData.length > 0 ? (
                  allData.map((item, key) => {
                    return (
                      <tr>
                        <td className="pt-[10px] px-0">
                          <div className="flex items-center justify-start ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#10bb35"
                              className="rotate-180"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                            </svg>
                            <div
                              className={
                                theme === "light"
                                  ? "shadow-[#cccccc40] shadow-xl flex justify-between w-30 px-1 py-1 rounded-xl mx-1"
                                  : "shadow-inner shadow-[#cccccc40]  flex justify-between w-30 px-1 py-1 rounded-xl mx-1"
                              }
                            >
                              <Blockies
                                className="identicon rounded-lg w-8 p-1 rounded-xl"
                                seed={
                                  "0xec4f34dd62905c4e415899ef659d20c6039d1074"
                                }
                                size={10}
                                scale={3}
                              />
                              <div className="flex flex-col w-20 rounded-xl p-1 ">
                                <span className="text-sm">
                                  {item[0].substring(0, 5) +
                                    "..." +
                                    item[0].substring(
                                      item[0].length - 3,
                                      item[0].length
                                    )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">{item[1]}</td>
                        <td className="text-sm">{item[2] ? item[3] : "-"}</td>
                        <td className="text-sm">
                          {item[4]}
                          <br></br>
                          {item[5]}
                        </td>
                        <td>
                          {/****************** if stream is not active comment below div**************/}
                          {item[2] ? (
                            <div className="flex flex-row align-center justify-end p-0 gap-[10px] h-max">
                              <button className="cursor-pointer bg-[#10bb3514] p-[6px] rounded-xl mr-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#10bb35"
                                >
                                  <path d="M0 0h24v24H0V0z" fill="none" />
                                  <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                              </button>
                              <button className="cursor-pointer bg-[#d2252514] p-[6px] rounded-xl mr-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#d22525"
                                >
                                  <path
                                    d="M0 0h24v24H0V0z"
                                    fill="none"
                                    opacity=".87"
                                  />
                                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z" />
                                </svg>
                              </button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={
                        theme == "dark"
                          ? "text-[#ffffffc7]"
                          : "text-[#12141e99]"
                      }
                    >
                      <div className="mx-auto w-3/5 text-center">
                        <p className="text-lg font-semibold ">
                          Currently, you don't have any previous/active stream
                          from your account into contract.
                        </p>
                        <p className="text-lg font-semibold">
                          Start a stream into contract to display here!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {/* ********** map to here **********  */}

                {/* *****************If no data found on that map function********** */}

                {/* *****************If no data found on that map function********** */}
              </tbody>
            </table>
          </div>
          {/* *************pagination************* */}
          {allData.length > 5 ? (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {allData.length > 5 ? "5" : allData.length}
                    </span>{" "}
                    of <span className="font-medium">{allData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      <span className="sr-only">Previous</span>
                      {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
                    </a>
                    {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                    <a
                      href="#"
                      aria-current="page"
                      className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
                    >
                      3
                    </a>
                    <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a
                      href="#"
                      className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
                    >
                      8
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      9
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      10
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      <span className="sr-only">Next</span>
                      {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          ) : null}

          {/* *************pagination************* */}

          <div className="flex justify-between text-[#12141ede] font-medium pt-4">
            <h4>
              Balance: {balance ? parseFloat(balance).toFixed(5) : "0"} fDAIx
            </h4>
            <h4>
              Contract Balance:{" "}
              {showContractBalance
                ? parseFloat(showContractBalance).toFixed(8)
                : "0"}{" "}
              fDAIx
            </h4>
          </div>
          <div className="set-permission-button flex flex-row w-1/3 mx-auto">
            <button
              className="mr-2"
              onClick={() => {
                setCreateStreamIC(true);
                setFlowIC(false);
              }}
            >
              Create Stream
            </button>
            {/* <button onClick={() => getBalance()}>get balance</button> */}
            {/* <button
            className="ml-2"
            onClick={() => {
              setCreateStreamIC(false);
              setFlowIC(false);
              setSendLumpsum(true);
            }}
          >
            Send Lumpsum
          </button> */}
          </div>
        </div>
      </div>
    ) : showCreateStreamIC ? (
      <CreateStreamIntoContract
        setFlowIC={setFlowIC}
        setCreateStreamIC={setCreateStreamIC}
        theme={theme}
      />
    ) : null;
  } else {
    return (
      <div className="main-container">
        <div className="box-container min-w-[900px]  " id="max-w">
          <div className="set-permission-title">
            <span className="permission-title">Streams Into Contract</span>
          </div>
          {/* **************table to display all the transaction */}
          <div className="max-h-[50vh]  overflow-scroll overflow-x-hidden">
            <table className="dropdown-table w-full">
              <thead>
                <tr>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    To / From
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    All Time Flow
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Flow Rate
                  </th>

                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Start / End Date
                  </th>
                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div
                      className={`animate-pulse w-full h-7 m-1 rounded-md ${
                        theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
                      }`}
                    ></div>
                  </td>
                  <td>
                    <div
                      className={`animate-pulse w-full h-7 m-1 rounded-md ${
                        theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
                      }`}
                    ></div>
                  </td>
                  <td>
                    <div
                      className={`animate-pulse w-full h-7 m-1 rounded-md ${
                        theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
                      }`}
                    ></div>
                  </td>
                  <td>
                    <div
                      className={`animate-pulse w-full h-7 m-1 rounded-md ${
                        theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
                      }`}
                    ></div>
                  </td>
                  <td>
                    <div
                      className={`animate-pulse w-full h-7 m-1 rounded-md ${
                        theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
                      }`}
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between text-[#12141ede] font-medium pt-4">
            <h4>
              Balance: {balance ? parseFloat(balance).toFixed(5) : "0"} fDAIx
            </h4>
            <h4>
              Contract Balance:{" "}
              {showContractBalance
                ? parseFloat(showContractBalance).toFixed(5)
                : "0"}{" "}
              fDAIx
            </h4>
          </div>
          <div className="set-permission-button flex flex-row w-1/3 mx-auto">
            <div
              className={`animate-pulse w-full h-12 m-1 rounded-xl ${
                theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default FlowIntoContract;
