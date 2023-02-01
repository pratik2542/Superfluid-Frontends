import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import { Tooltip } from "react-lightweight-tooltip";
import { timeperiod } from "../../data/timeperiod";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

// import { Web3 } from "web3";
import { Framework } from "@superfluid-finance/sdk-core";
import moneyRouterABI from "../artifacts/MoneyRouter.json";
import TransactionWaiting from "./TransactionWaiting";
const moenyRouterContractAddress = "0xEc4f34DD62905C4e415899ef659d20C6039D1074";

function CreateStreamIntoContract({ setFlowIC, setCreateStreamIC, theme }) {
  const [tokenValue, setTokenValue] = useState("Enter Token Amount in Wei");
  const { address } = useAccount();
  const [showTime, setTime] = useState([timeperiod[5]]);

  const [balance, setBalane] = useState();
  const [showContractBalance, setContractBalance] = useState();
  const [tokenValueInSec, setTokenValueInSec] = useState();

  const PK = `d0772677b9ae707e219db95a14bc5c7ae063eb7388b52827aef4f9252baaf25f`;
  const Pkey = `0x${PK}`;
  const signer = new ethers.Wallet(Pkey);

  // transaction waiting popup usestates
  const [loading, setLoading] = useState(false);
  const [showTransactionError, setTransactionError] = useState();
  const [showTransactionCompleted, setTransactionCompleted] = useState();
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
  const Web3 = require("web3");
  // integration
  const sendStreamIntoContract = async () => {
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        // provider and signer
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        //
        const sf = await Framework.create({
          chainId: 5,
          provider: provider,
        });
        const daix = await sf.loadSuperToken("fDAIx");
        const moneyRouter = new ethers.Contract(
          moenyRouterContractAddress,
          moneyRouterABI,
          signer
        );

        // check whether the contract has permission to create, update, delete streams
        const checkPermission = await daix.getFlowOperatorData({
          sender: address,
          flowOperator: moenyRouterContractAddress,
          token: daix.address,
          providerOrSigner: signer,
        });
        const permissionNumber = checkPermission.permissions;
        const flowRate = document.getElementById("flowRate").value;

        // if permission is given then directly starts the stream
        if (permissionNumber === String(0)) {
          //  approve contract to spend 1000 daix
          const aclApproval = daix.updateFlowOperatorPermissions({
            flowOperator: moenyRouterContractAddress,
            flowRateAllowance: "3858024691358024", //10k tokens per month in flowRateAllowanace
            permissions: 7, //NOTE: this allows for full create, update, and delete permissions. Change this if you want more granular permissioning
          });
          await aclApproval.exec(signer).then(async function (tx) {
            await tx.wait();
            setTransactionCompleted(tx.hash);
            console.log(`
            Congrats! You've just successfully made the money router contract a flow operator. 
            Tx Hash: ${tx.hash}
        `);
          });
        }
        // call contract fucntion to send the stream
        await moneyRouter
          .connect(signer)
          .createFlowIntoContract(daix.address, flowRate)
          .then(async function (tx) {
            setTransactionCompleted(tx.hash);
            await tx.wait();
            sendNotification(flowRate, tx.hash);
            setLoading(false);
            console.log(`
              Congrats! You just successfully created a flow into the money router contract. 
              Tx Hash: ${tx.hash}
          `);
          });
      }
    } catch (error) {
      setTransactionError(error.message);
      console.log(error);
    }
  };

  const greenRoundedStyle = {
    content: {
      backgroundColor: "white",
      color: "#000000",
      fontSize: ".8em",
      padding: 0,
    },
    tooltip: {
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.35)",
      padding: "10px",
    },
    arrow: {
      borderTop: "solid white 5px",
    },
  };
  useEffect(() => {
    console.log(showTime[0].value);
  }, [showTime]);

  const sendNotification = async (rate, txhash) => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `Stream Updates`,
          body: `Stream has been started from your account into the Superfluid Money Router Contract. Flow rate - ${rate} wei/sec`,
        },
        payload: {
          title: `Stream Updates`,
          body: `Stream has been started from your account into the Superfluid Money Router Contract. Flow rate - ${rate} wei/sec`,
          cta: `${txhash}`,
          img: "",
        },
        recipients: `eip155:5:${address}`, // recipient address
        channel: "eip155:5:0x619058Cc41aB48e0Ac3D86B09C7bFE68B8b0dcbe", // your channel address
        env: "staging",
      });

      // apiResponse?.status === 204, if sent successfully!
      console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  useEffect(() => {
    if (tokenValue > 0)
      if (showTime[0].value === "minute") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 60).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "hour") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 3600).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "day") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 86400).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "week") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 604800).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "month") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 18144000).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "year") {
        const WeiToEther = ethers.utils.formatEther(
          (tokenValue * 18144000 * 365).toString()
        );
        setTokenValueInSec(WeiToEther);
      } else if (showTime[0].value === "second") {
        // setTokenValueInSec(parseInt(tokenValue));
        const WeiToEther = ethers.utils.formatEther(tokenValue.toString());
        setTokenValueInSec(WeiToEther);
      }
  }, [tokenValue, showTime[0].value]);

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

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="set-permission-title flex flex-row justify-between">
          <span className="permission-title">Create Stream Into Contract</span>
          <span
            className="go-back"
            onClick={() => {
              setCreateStreamIC(false);
              setFlowIC(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" opacity=".87" />
              <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z" />
            </svg>
          </span>
        </div>
        <div className="input-parent ">
          <div className="flex justify-between items-center">
            <h4>Contract Address</h4>
            <Tooltip
              content="Contract address where your token will be sent."
              styles={greenRoundedStyle}
            >
              <svg
                className="w-[20px] h-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill={theme === "dark" ? "#8292ad8a" : "#8292ad8a"}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
              </svg>
            </Tooltip>
          </div>
          <input
            disabled
            type="text"
            placeholder="0xEc4f34DD62905C4e415899ef659d20C6039D1074"
            className="w-full input placeholder-gray-700 cursor-not-allowed opacity-75"
            id="receiverWalletAddress"
          />
        </div>
        <div className="input-parent flex justify-between">
          <div className="super-token-input">
            <h4>Super Token</h4>
            {/* <input
  type="text"
  placeholder="Public Address"
  className="w-full input placeholder-gray-700"
/> */}
            <StyledSelect
              options={timeperiod}
              disabled
              placeholder="fDAIx"
              values={[]}
              labelField="username"
              valueField="username"
              searchBy="username"
              onChange={(value) => console.log(value)}
              color={"#10bb34"}
              minHeight={"54px"}
            />
          </div>
          <div className="flow-rate-input grow ml-4 ">
            <div className="flex justify-between items-center">
              <h4>Flow Rate</h4>
              <Tooltip
                content="Flow rate is the velocity of the tokens being streamed."
                styles={greenRoundedStyle}
              >
                <svg
                  className="w-[20px] h-[20px]"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill={theme === "dark" ? "#8292ad8a" : "#8292ad8a"}
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
                </svg>
              </Tooltip>
            </div>
            <div className="flex flex-row">
              <input
                type="number"
                value={tokenValue}
                placeholder="Enter Token Amount in Wei"
                className="w-full input placeholder-gray-700 rounded-r-none mr-[1px] border-r-0"
                id="flowRate"
                onChange={(e) => setTokenValue(Math.floor(e.target.value))}
              />
              <div className="min-w-[150px]" id="timePeriod">
                <StyledSelect
                  id="timePeriod"
                  options={timeperiod}
                  // placeholder="fDAIx"
                  values={showTime}
                  labelField="label"
                  valueField="value"
                  searchBy="label"
                  onChange={(value) => setTime(value)}
                  color={"#10bb34"}
                  minHeight={"54px"}
                />
              </div>
            </div>
          </div>
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
        <hr className={theme === "dark" ? "border-[#ffffff1f] my-4" : "my-4"} />
        {/* ************** details about the stream ************** */}
        {tokenValue && tokenValue > 0 ? (
          <div className="border border-[#10bb35] px-[20px] py-[10px] bg-[#10bb350A] rounded-lg text-sm tracking-[0.17px] leading-[1.429]">
            <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                Receiver
              </span>
              <span className="font-medium text-[#10bb35]">
                0xEc4f34DD62905C4e415899ef659d20C6039D1074
              </span>
            </div>
            <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                Flow rate
              </span>
              <span className="font-medium text-[#10bb35]">
                {tokenValue + " Wei / " + showTime[0].value}
              </span>
            </div>
            <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                Amount per second
              </span>
              <span className="font-medium text-[#10bb35]">
                {tokenValueInSec} fDAIx
              </span>
            </div>
            <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                End date
              </span>
              <span className="font-medium text-[#10bb35] flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#10bb35"
                  className="mx-1"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M20.22 6.86c-2-.6-4.06-.04-5.39 1.29L12 10.66 10.48 12h.01L7.8 14.39c-.81.81-1.95 1.15-3.12.92-1.25-.25-2.28-1.25-2.57-2.49-.52-2.23 1.16-4.2 3.29-4.2.91 0 1.76.35 2.44 1.03l.47.41c.38.34.95.34 1.33 0 .45-.4.45-1.1 0-1.5l-.42-.36C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.81-.81 1.95-1.15 3.12-.92 1.25.25 2.28 1.25 2.57 2.49.52 2.23-1.16 4.2-3.29 4.2-.9 0-1.76-.35-2.44-1.03l-.48-.42c-.38-.34-.95-.34-1.33 0-.45.4-.45 1.1 0 1.5l.42.37c1.02 1.01 2.37 1.57 3.82 1.57 3.27 0 5.86-2.9 5.33-6.25-.3-1.99-1.77-3.69-3.7-4.26z" />
                </svg>
                Never
              </span>
            </div>
            {/* <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                Upfront buffer
              </span>
              <span className="font-medium text-[#10bb35]">0.00356 fDAIx</span>
            </div>
            <div className="flex flex-row justify-between py-1">
              <span
                className={
                  theme === "dark" ? "text-[#BFF8C1]" : "text-[#265f28]"
                }
              >
                Balance after buffer
              </span>
              <span className="font-medium text-[#10bb35]">
                1200.0012 fDAIx
              </span>
            </div> */}
          </div>
        ) : null}
        <div className="set-permission-button">
          <button onClick={() => sendStreamIntoContract()}>Send Stream</button>
        </div>
      </div>
      {loading ? (
        <TransactionWaiting
          setLoading={setLoading}
          theme={theme}
          showTransactionError={showTransactionError}
          setTransactionError={setTransactionError}
          showTransactionCompleted={showTransactionCompleted}
          setTransactionCompleted={setTransactionCompleted}
          streamContent={"You are creating a stream into contract."}
        />
      ) : null}
    </div>
  );
}

export default CreateStreamIntoContract;
