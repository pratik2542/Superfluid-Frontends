import React, { useState } from "react";
import Select from "react-dropdown-select";
import options from "../../data/options";
import styled from "@emotion/styled";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";

function RevokeFullControl({ operatorAdd }) {
  // flow operator address

  const [flowOperatorAddress, setFlowOperatorAddress] = useState(
    operatorAdd ? operatorAdd : ""
  );
  //integration
  const revokeFullControl = async () => {
    const operatorAddress = document.getElementById(
      "flowOperatorAddress"
    ).value;

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
          const updateFlowOperatorOperation =
            sf.cfaV1.revokeFlowOperatorWithFullControl({
              superToken: DAIx,
              flowOperator: operatorAddress,
            });

          console.log("Revoking your flow permissions...");

          const result = await updateFlowOperatorOperation.exec(signer);
          console.log(result);

          console.log(
            `Congrats - you've just revoked  flow permissions for 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721`
          );
        } catch (error) {
          console.log(
            "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
          );
          console.error(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StyledSelect = styled(Select)`
    ${({ dropdownRenderer }) =>
      dropdownRenderer &&
      `
  .react-dropdown-select-dropdown {
    overflow: initial;
  }
  `}
  `;
  return (
    <div className="main-container">
      <div className="box-container">
        <div className="set-permission-title">
          <span className="permission-title">Revoke Full Control</span>
        </div>
        <div className="input-parent">
          <h4>Flow Operator Address</h4>
          <input
            type="text"
            placeholder="Public Address"
            className="w-full input placeholder-gray-700"
            id="flowOperatorAddress"
            value={flowOperatorAddress}
            onChange={(e) => setFlowOperatorAddress(e.target.value)}
          />
        </div>
        {/* <div className="input-parent">
      <h4>Permissions</h4>
      <StyledSelect
        className="placeholder-gray-700"
        options={options}
        placeholder="Select A Permission"
        values={[]}
        labelField="username"
        valueField="username"
        searchBy="username"
        onChange={(value) => console.log(value)}
        color={"#10bb34"}
        minHeight={"54px"}
      />
    </div> */}
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
          {/* <div className="flow-rate-input grow ml-4">
            <h4>Flow Rate ( / second )</h4>
            <input
              type="number"
              placeholder="Flow Rate"
              className="w-full input placeholder-gray-700"
            />
          </div> */}
        </div>
        <div className="set-permission-button">
          <button onClick={() => revokeFullControl()}>Revoke</button>
        </div>
      </div>
    </div>
  );
}

export default RevokeFullControl;
