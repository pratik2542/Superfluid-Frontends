import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { createClient } from "urql";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

function ViewPermissions({ setViewPermissions, setRevokeFC, setOperatorAdd }) {
  const permissionData = {
    1: "Create",
    2: "Update",
    3: "Create or Update",
    4: "Delete",
    5: "Create or Delete",
    6: "Delete or Update",
    7: "Create, Update, or Delete",
  };
  const { address, isConnected } = useAccount();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getFlowOperatorData = async () => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli";

    const query = `
    query {
      flowOperators(
        where: {sender: "0xf96b82579b8f4e0357908ae50a10f2287a19baa9"}
      ) {
        flowOperator
        permissions
      }
    }
  `;
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const query1 = `
        query {
          flowOperators(
            where: {sender: "${address}"}
          ) {
            flowOperator
            permissions
          }
        }
      `;
      const client = createClient({
        url: APIURL,
      });
      const result1 = await client.query(query1).toPromise();

      const result = await client.query(query).toPromise();
      console.log(result1);
      console.log(account);

      const final_data = result.data.flowOperators;
      console.log(final_data);
      data.push(final_data);
      setData(data);
      setLoading(false);
      console.log(data);
    }
  };

  useEffect(() => {
    getFlowOperatorData();
  }, [address]);
  if (!loading) {
    return (
      <div className="main-container">
        <div className="box-container">
          <div className="set-permission-title">
            <span className="permission-title">All Permissions</span>
          </div>
          <table>
            <thead>
              <tr>
                <th className="text-center font-medium">Address</th>
                <th className="text-center font-medium">Permission</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0
                ? data[0].map((item, key) => {
                    return (
                      <tr className="font-medium border-b-[1px]">
                        <td className="flex items-center ">
                          <Blockies
                            seed={item.flowOperator}
                            size={10}
                            scale={3}
                            className="identicon rounded-lg mr-2"
                          />
                          {item.flowOperator.substring(0, 6) +
                            "..." +
                            item.flowOperator.substring(
                              item.flowOperator.length - 5,
                              item.flowOperator.length
                            )}
                        </td>
                        <td className="text-center">
                          <span className="py-[6px] px-[16px] bg-[#10bb3514] rounded-lg text-[#10bb35]">
                            {permissionData[item.permissions]}
                          </span>
                        </td>
                        <td>
                          <button
                            className="py-[6px] px-[16px] bg-[#10bb35] text-white rounded-lg"
                            onClick={() => {
                              setOperatorAdd(item.flowOperator);

                              setViewPermissions(false);
                              setRevokeFC(true);
                            }}
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return "loading...";
  }
}

export default ViewPermissions;
