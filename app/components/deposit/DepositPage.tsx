import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import instance from "@/app/axios";

interface DepositData {
  tg_id: string;
  amount: number;
  date: string;
  transaction: string;
  address: string;
}

const DepositPage = () => {
  const snackbar = useSnackbar();
  const [data, setData] = useState<DepositData[]>([]);
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userData = useSelector((x: any) => x.UsersReducer.currentUser);
  // console.log("userData", userData);

  useEffect(() => {
    instance
      .get(`/deposits/${user}`)
      .then((response: any) => {
        setData(response?.data);
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, []);

  return (
    <div className="bg-black text-white pt-3 h-full flex-col w-screen px-3 select-none overflow-y-scroll">
      <h1 className="text-center font-bold text-3xl mt-4">DEPOSIT</h1>
      <div className="w-full flex flex-col items-center justify-center mt-5">
        <h2>
          Your <span className="font-bold text-[#FED527]">Ocicat</span> deposit
          address
        </h2>
        <div className="w-full flex items-center mt-2">
          <input
            type="text"
            className="flex-1 p-2 border border-[#FED527] rounded-l-lg bg-black text-white overflow-x-scroll cursor-pointer"
            value={userData?.public_key}
            disabled
          />
          <button
            className="p-2 border border-l-0 border-[#FED527] rounded-r-lg bg-black text-white"
            onClick={() => {
              navigator.clipboard.writeText(userData?.public_key);
              snackbar.enqueueSnackbar("Address Copied.", {
                variant: "success",
              });
            }}
          >
            <FaCopy className="h-6" />
          </button>
        </div>
      </div>
      <div className="w-full flex max-h-[60vh]   overflow-y-scroll flex-col items-start mt-5">
        <p className="text-sm font-bold mb-1">Deposits:</p>
        {data.map((item: DepositData, index: number) => (
          <div
            className="w-full mb-2 flex items-center justify-between px-3 "
            key={index}
          >
            <div className="select-none w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-[2px] bg-[#0C0C0D] flex flex-row justify-between gap-x-2 items-center ">
              <div className="py-2 gap-4 flex items-center w-full">
                <div className=" rounded-lg">
                  <Image
                    src="/images/deposit.png"
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col text-white w-full">
                  <p className="text-[14px]"> Your Deposit</p>
                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <span className="flex flex-row items-center">
                      <div className="rounded-full h-5 w-5 overflow-hidden flex items-center justify-center bg-white mr-2">
                        <Image
                          src="/images/amount.png"
                          width={20}
                          height={20}
                          alt="amount"
                          className=""
                        />
                      </div>
                      <b className="text-[17px]">{item.amount}</b>
                    </span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="w-full mb-2 flex items-center justify-between px-3 ">
            <div className="select-none w-full border-[1px] border-white border-opacity-20 rounded-[12px] px-4 py-[2px] bg-[#0C0C0D] flex flex-row justify-between gap-x-2 items-center ">
              <div className="py-2 gap-4 flex items-center w-full">
                <p>No deposits found</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
