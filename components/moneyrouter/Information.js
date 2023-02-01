import React from "react";
import Image from "next/image";
import img1 from "../../public/0.png";
import img2 from "../../public/1.png";
import img3 from "../../public/2.png";
import img4 from "../../public/3.png";
import img5 from "../../public/4.png";
import img6 from "../../public/5.png";
import img7 from "../../public/6.png";
import img8 from "../../public/7.png";

function Information({ theme }) {
  return (
    <div className="main-container">
      <div className="box-container " id="max-w">
        <div className="set-permission-title flex flex-row justify-between">
          <span className="permission-title">The Money Router</span>
        </div>
        <div className="p-[30px] information">
          <h1 className="font-[600] text-center text-[1.25rem] my-[10px]">
            Money Router helps you to create money streams in solidity.
          </h1>
          <h1 className="font-[600] text-[1.05rem] mt-[40px] ">
            There are basically three functions in the contract.
          </h1>
          <ul
            role="list"
            class="marker:text-[#10bb35] list-disc pl-5 space-y-3 my-4 mx-auto"
          >
            <li>Send Streams Into The Contract</li>
            <li>Send Streams From The Contract</li>
            <li>Send and Withdraw Token Into and From Contract</li>
          </ul>
          <hr className="my-8" />
          <p>
            Superfluid's Money Router github link
            <span
              className="cursor-pointer text-[#10bb35] font-[600] mx-4"
              onClick={() =>
                window.open(
                  "https://github.com/superfluid-finance/super-examples/tree/main/projects/money-streaming-intro/money-streaming-intro-hardhat"
                )
              }
            >
              Click Here
            </span>
          </p>
          <p>
            Superfluid's Money Router explanation video link
            <span
              className="cursor-pointer text-[#10bb35] font-[600] mx-4"
              onClick={() =>
                window.open("https://www.youtube.com/watch?v=1mwbYQ429IU")
              }
            >
              Click Here (YouTube)
            </span>
          </p>
          <hr className="my-8" />
          <div>
            <h1 className="font-[600] text-[1.25rem] my-[40px] ">
              Connect Your Wallet
            </h1>
            <Image
              src={img1}
              alt="connect wallet image"
              className="border-[#10bb35] border-[2px]"
            ></Image>
          </div>
          <hr className="my-8" />
          <div>
            <h1 className="font-[600] text-[1.25rem] my-[40px] ">
              <span className="mr-4">1.</span> Send Streams Into The Contract
            </h1>
            <Image
              src={img2}
              alt="connect wallet image"
              className="border-[#10bb35] border-[3px]"
            ></Image>
            <p className="my-8">
              The MoneyRouter contract will help you to create, update and
              delete streams into a contract using the ACL feature, which allows
              you to provide a kind of access control to other addresses over
              your ability to create, update and delete streams. This requires
              the contract to be a flowoperator for the message sender.
            </p>
            <Image
              src={img3}
              alt="connect wallet image"
              className="border-[#10bb35] border-[3px]"
            ></Image>
            <ul
              role="list"
              class="marker:text-[#10bb35] list-disc pl-5 space-y-3 my-4 mx-auto"
            >
              <li>Create a stream into the contract.</li>

              <li>
                Update an existing stream being sent into the contract by the
                message sender.
              </li>

              <li>
                Delete a stream that the messagesender has opened into the
                contract.
              </li>
            </ul>
          </div>
          <hr className="my-8" />
          <div>
            <h1 className="font-[600] text-[1.25rem] my-[40px] ">
              <span className="mr-4">2.</span> Send Streams From The Contract
            </h1>
            <Image
              src={img4}
              alt="connect wallet image"
              className="border-[#10bb35] border-[3px]"
            ></Image>
            <p className="my-8">
              The MoneyRouter contract will help you to create, update and
              delete streams from a contract to any specific address using the
              ACL feature, which allows you to provide a kind of access control
              to other addresses over your ability to create, update and delete
              streams. This requires the contract to be a flowoperator for the
              message sender.
            </p>
            <Image
              src={img5}
              alt="connect wallet image"
              className="border-[#10bb35] border-[3px]"
            ></Image>
            <ul
              role="list"
              class="marker:text-[#10bb35] list-disc pl-5 space-y-3 my-4 mx-auto"
            >
              <li>create flow from contract to specified address.</li>
              <li>Update existing flow from contract to specified address.</li>
              <li>Delete flow from contract to specified address.</li>
            </ul>
          </div>
          <hr className="my-8" />
          <div>
            <h1 className="font-[600] text-[1.25rem] my-[40px] ">
              <span className="mr-4">3.</span> Send and Withdraw Token Into and
              From Contract
            </h1>
            <Image
              src={img6}
              alt="connect wallet image"
              className="border-[#10bb35] border-[3px]"
            ></Image>
            <p className="my-8">
              The MoneyRouter contract will allows you to send a lump sum of
              super tokens into the contract. This requires a super token ERC20
              approval. Withdraw funds from the contract.
            </p>

            <ul
              role="list"
              class="marker:text-[#10bb35] list-disc pl-5 space-y-3 my-4 mx-auto"
            >
              <li className="my-8">Send tokens into the contract in one go.</li>
              <Image
                src={img8}
                alt="connect wallet image"
                className="border-[#10bb35] border-[3px]"
              ></Image>
              <li className="my-8">
                Withdraw tokens from the contract into your address in one go.
              </li>
              <Image
                src={img7}
                alt="connect wallet image"
                className="border-[#10bb35] border-[3px]"
              ></Image>
            </ul>
          </div>
          {/* <hr className="my-8" /> */}
        </div>
      </div>
    </div>
  );
}

export default Information;
