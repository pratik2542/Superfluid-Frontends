import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import options from "../../data/options";
import styled from "@emotion/styled";
import CreateStreamIntoContract from "./CreateStreamIntoContract";
import SendLumpsumIntoContract from "./SendLumpsumIntoContract";

import Image from "next/image";
import gif from "../../public/stream-loop.gif";
import Blockies from "react-blockies";
import { useAccount } from "wagmi";
import WithdrawFromContract from "./WithdrawFromContract";
import { createClient } from "urql";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

function DirectContract({ theme }) {
  const { address } = useAccount();

  const [showDirectContract, setDirectContract] = useState(true);
  const [showWithdraw, setWithdraw] = useState(false);
  const [showSendLumpsum, setSendLumpsum] = useState(false);
  const [show, setShow] = useState(false);
  const [balance, setBalane] = useState();
  const [showContractBalance, setContractBalance] = useState();
  // Integration
  const [allData, setAllData] = useState([]);
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
      transferEvents(
        where: {from: "${convert_address}", token: "0xf2d68898557ccb2cf4c10c3ef2b034b2a69dad00"}
      ) {
        token
        value
        to {
          id
        }
        name
        timestamp
      }
    }
  `;

    const receiveDataQuery = `
    query {
      transferEvents(
        where: {from: "0xec4f34dd62905c4e415899ef659d20c6039d1074", token: "0xf2d68898557ccb2cf4c10c3ef2b034b2a69dad00"}
      ) {
        token
        value
        to {
          id
        }
        name
        timestamp
      }
    }
  `;
    const client = createClient({
      url: APIURL,
    });
    const sendData_ = await client.query(sendDataQuery).toPromise();
    const receiveData_ = await client.query(receiveDataQuery).toPromise();
    const s_data = sendData_.data.transferEvents;
    const r_data = receiveData_.data.transferEvents;
    // console.log(sendData);
    // console.log(receiveData);
    console.log(s_data);
    console.log(r_data);
    // merge the data
    for (let i = 0; i < r_data.length; i++) {
      if (r_data[i].to.id === convert_address) {
        console.log("yes");
      }
    }
    Array.prototype.push.apply(s_data, r_data);
    // // console.log(s_data);

    // sort the data
    s_data.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
    // console.log(s_data);

    // loop over data and set the data in use state
    for (let i = 0; i < s_data.length; i++) {
      // if (!allData.find((item) => s_data[i].timestamp === item[2])) {
      if (s_data[i].to.id === "0xec4f34dd62905c4e415899ef659d20c6039d1074") {
        const d = new Date(parseInt(s_data[i].timestamp) * 1000);
        const date =
          String(d.getDate()) +
          " " +
          String(monthNames[d.getMonth()]) +
          ". " +
          String(d.getFullYear());
        if (allData.length < s_data.length)
          allData.push([
            "0xec4f34dd62905c4e415899ef659d20c6039d1074",
            s_data[i].value,
            s_data[i].timestamp,
            date,
            true,
          ]);
      } else {
        if (s_data[i].to.id === convert_address) {
          console.log("hi");
          const d = new Date(parseInt(s_data[i].timestamp) * 1000);
          const date =
            String(d.getDate()) +
            " " +
            String(monthNames[d.getMonth()]) +
            ". " +
            String(d.getFullYear());
          if (allData.length < s_data.length)
            allData.push([
              "0xec4f34dd62905c4e415899ef659d20c6039d1074",
              s_data[i].value,
              s_data[i].timestamp,
              date,
              false,
            ]);
        } else {
          console.log("no");
        }
      }
      setAllData(allData);
      setShow(true);
      console.log(allData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    return showDirectContract ? (
      <div className="main-container">
        <div className="box-container min-w-[700px]" id="max-w">
          <div className="set-permission-title">
            <span className="permission-title">Contract Details</span>
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
                    Value
                  </th>

                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Date
                  </th>
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
                            {item[4] ? (
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
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#10bb35"
                              >
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                              </svg>
                            )}
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
                                  {/* {address
                                ? address.substring(0, 5) +
                                  "..." +
                                  address.substring(
                                    address.length - 3,
                                    address.length
                                  )
                                : "-"} */}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">{item[1] / 10 ** 18}</td>
                        <td className="text-sm">{item[3]}</td>
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
                          You don't have any transactions to contract and from
                          contract.
                        </p>
                        <p className="text-lg font-semibold">
                          Send a Lumpsum-Token in a Contract to display here!
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
          <div className="flex justify-between text-center text-[#12141ede] font-medium pt-4">
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
          <div className="set-permission-button flex flex-row w-3/5 mx-auto max-w-[500px]">
            <button
              className="mr-2"
              onClick={() => {
                setWithdraw(true);
                setDirectContract(false);
                setSendLumpsum(false);
              }}
            >
              Withdraw
            </button>
            <button
              className="ml-2"
              onClick={() => {
                setWithdraw(false);
                setDirectContract(false);
                setSendLumpsum(true);
              }}
            >
              Send Lumpsum
            </button>
          </div>
        </div>
      </div>
    ) : showWithdraw ? (
      <WithdrawFromContract
        setDirectContract={setDirectContract}
        setWithdraw={setWithdraw}
        theme={theme}
      />
    ) : showSendLumpsum ? (
      <SendLumpsumIntoContract
        setDirectContract={setDirectContract}
        setSendLumpsum={setSendLumpsum}
        theme={theme}
      />
    ) : null;
  } else {
    return (
      <div className="main-container">
        <div className="box-container min-w-[700px]" id="max-w">
          <div className="set-permission-title">
            <span className="permission-title">Contract Details</span>
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
                    Value
                  </th>

                  <th
                    className={
                      "sticky top-0 " +
                      `${theme === "dark" ? "dark-bg" : "bg-white"}`
                    }
                  >
                    Date
                  </th>
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
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center text-[#12141ede] font-medium pt-4"></div>
          <div className="set-permission-button flex flex-row w-1/2 mx-auto">
            <div
              className={`animate-pulse w-full h-12 m-1 rounded-xl ${
                theme === "dark" ? "bg-[#ffffff1f]" : "bg-slate-100"
              }`}
            ></div>
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
export default DirectContract;
