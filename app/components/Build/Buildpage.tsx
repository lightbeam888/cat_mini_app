"use client";
import React, { ReactNode, useEffect, useState } from "react";
import TopImg from "../Reusable/TopImg";
import Summary from "../Reusable/Summary";
import Landscape from "./Landscape";
import { Shopitems } from "./Shopitems";
import instance from "@/app/axios";
import { setItems } from "@/redux/reducers/TaskReducer";
import { useDispatch, useSelector } from "react-redux";

interface data {
  [key: string]: ReactNode;
}
const Buildpage = () => {
  const [active, setActive] = useState("land");

  // get the dispatch function
  const dispatch = useDispatch();

  const tabs = [
    {
      name: "Landscape",
      active: "land",
    },
  ];
  const data: data = {
    land: <Landscape />,
  };

  // do a get request to get all the shop items
  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await instance.get("/items");
      dispatch(setItems(data));
    };

    fetchItems();
  }, []);

  // get all the shop items
  const items = useSelector((x: any) => x.TaskReducer.items);

  return (
    <div className="bg-black h-screen  w-full px-[3%]  select-none">
      <div className=" overflow-scroll h-screen pb-[85px]">
        <TopImg
          style="bg-[url(/images/store.jpg)] h-[125px] w-full rounded-[10px] bg-cover items-center justify-center bg-no-repeat flex"
          img="/images/bg/coin.png"
          amount="324,293"
        />

        <Summary />
        {/* <div className="w-full grid grid-cols-4 border-[2px] border-[#FFFFFF] border-opacity-20 rounded-[52px] p-1 gap-[4%] mt-2">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(t.active)}
              className={`text-[13px] text-white ${
                t.active === active
                  ? "bg-gradient-to-tr from-[#CFFF00] to-[#2441A8] overflow-hidden w-full  rounded-[50px] p-[1px]"
                  : "overflow-hidden w-full"
              } `}
            >
              <div
                className={`flex ${
                  t.active === active
                    ? "backdrop-blur-sm bg-black opacity-80 rounded-[50px] w-full items-center justify-center"
                    : "backdrop-blur-sm bg-black opacity-80 rounded-[50px] w-full items-center justify-center"
                } `}
              >
                {t.name}
              </div>
            </button>
          ))}
        </div> */}
        <div className="mt-2 text-white overflow-scroll  flex flex-wrap flex-row justify-center  gap-2">
          {items?.map((item: any, i: number) => (
            <Shopitems key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buildpage;
