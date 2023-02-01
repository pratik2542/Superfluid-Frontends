import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import options from "../../data/options";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import moneyRouterABI from "../artifacts/MoneyRouter.json";
import { Tooltip } from "react-lightweight-tooltip";
import TransactionWaiting from "./TransactionWaiting";
const moenyRouterContractAddress = "0xEc4f34DD62905C4e415899ef659d20C6039D1074";

function WithdrawFromContract({ setDirectContract, setWithdraw, theme }) {
  const [tokenValue, setTokenValue] = useState("Enter Token Amount in Wei");
  const { address } = useAccount();

  const [balance, setBalane] = useState();
  const [showContractBalance, setContractBalance] = useState();

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

  const withdrawTokensFromContract = async () => {
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

        //
        const tokenAmount = document.getElementById("tokenAmount").value;

        // withdraw method of contract
        await moneyRouter
          .connect(signer)
          .withdrawFunds(daix.address, ethers.utils.parseEther(tokenAmount))
          .then(async function (tx) {
            setTransactionCompleted(true);
            await tx.wait();
            setLoading(false);
            console.log(`
            Congrats! You've just successfully withdrew funds from the money router contract. 
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
          <span className="permission-title">Withdraw From Contract</span>
          <span
            className="go-back"
            onClick={() => {
              setWithdraw(false);
              setDirectContract(true);
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
        {/* <div className="input-parent">
      <h4>Receiver Wallet Address</h4>
      <input
        type="text"
        placeholder="Public Address"
        className="w-full input placeholder-gray-700"
        id="receiverWalletAddress"
      />
    </div> */}
        <div className="input-parent ">
          <div className="flex justify-between items-center">
            <h4>Contract Address</h4>
            <Tooltip
              content="Contract address from where token will be sent."
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
        <div className="input-parent opacity-75">
          <div className="flex justify-between items-center">
            <h4>Receiver Wallet Address</h4>
            <Tooltip
              content="Receivers wallet address where token will be sent."
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
            placeholder={address ? address : "Public Address"}
            className="w-full input placeholder-gray-700 cursor-not-allowed"
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
              options={options}
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
          <div className="flow-rate-input grow ml-4">
            <div className="flex justify-between items-center">
              <h4>Amount</h4>
              <Tooltip
                content="1 fDAIx = 1000000000000000000 Wei."
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
              type="number"
              value={tokenValue}
              placeholder="Enter Token Amount"
              className="w-full input placeholder-gray-700"
              id="tokenAmount"
              onChange={(e) => setTokenValue(e.target.value)}
            />
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
        <div className="set-permission-button">
          <button onClick={() => withdrawTokensFromContract()}>Withdraw</button>
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
          streamContent={"You are withdrawing token/s from contract."}
        />
      ) : null}
    </div>
  );
}

export default WithdrawFromContract;
