import React, { useState } from "react";
import Select from "react-dropdown-select";
import options from "../../data/options";
import styled from "@emotion/styled";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { permissions } from "../../data/permissions";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { set } from "immutable";

function SetPermission() {
  // usestate for input permission value

  const [permissionValue, setPermissionValue] = useState();
  const [tokenValue, setTokenValue] = useState("Enter Token Amount in Wei");
  //integration
  const updateFlowPermission = async () => {
    const operatorAddress = document.getElementById(
      "flowOperatorAddress"
    ).value;
    const flowRate = document.getElementById("flowRate").value;
    const permission = permissionValue[0].value;

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
            sf.cfaV1.updateFlowOperatorPermissions({
              flowOperator: operatorAddress,
              permissions: permission,
              flowRateAllowance: flowRate,
              superToken: DAIx,
            });

          console.log("Updating your flow permissions...");

          const result = await updateFlowOperatorOperation.exec(signer);
          console.log(result);

          console.log(
            `Congrats - you've just updated flow permissions for 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721`
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

  const onChangePermissionsInput = (e) => {
    setPermissionValue(e);
  };
  return (
    <div className="main-container">
      <div className="box-container">
        <div className="set-permission-title">
          <span className="permission-title">Set Permission</span>
        </div>
        <div className="input-parent">
          <h4>Flow Operator Address</h4>
          <input
            type="text"
            placeholder="Public Address"
            className="w-full input placeholder-gray-700"
            id="flowOperatorAddress"
          />
        </div>
        <div className="input-parent">
          <h4>Permissions</h4>
          <StyledSelect
            id="permission"
            options={permissions}
            placeholder="Select Permission"
            values={permissionValue}
            labelField="label"
            valueField="value"
            searchBy="label"
            onChange={(value) => setPermissionValue(value)}
            color={"#10bb34"}
            minHeight={"54px"}
          />
          {/* <StyledSelect
            className="placeholder-gray-700"
            options={permissions}
            placeholder="Select A Permission"
            values={[]}
            labelField="name"
            valueField="value"
            searchBy="name"
            onChange={(value) => onChangePermissionsInput(value)}
            color={"#10bb34"}
            minHeight={"54px"}
          /> */}
          {/* <Dropdown
            options={permissions}
            onChange={(value) => console.log(value)}
            value={permissions[0].label}
            placeholder="Select an option"
          /> */}
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
              options={permissions}
              disabled
              values={[]}
              labelField="label"
              valueField="value"
              placeholder="fDAIx"
              searchBy="value"
              onChange={(value) => console.log(value)}
              color={"#10bb34"}
              minHeight={"54px"}
            />
          </div>
          <div className="flow-rate-input grow ml-4">
            <h4>Flow Rate ( / second )</h4>
            <input
              type="number"
              value={tokenValue}
              placeholder="Enter Token Amount in Wei"
              className="w-full input placeholder-gray-700"
              id="flowRate"
              onChange={(e) => setTokenValue(Math.floor(e.target.value))}
            />
          </div>
        </div>
        <div className="set-permission-button">
          <button onClick={() => updateFlowPermission()}>Set Permission</button>
        </div>
      </div>
    </div>
  );
}

export default SetPermission;
