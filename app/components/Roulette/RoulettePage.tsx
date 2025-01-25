import React, { useEffect } from "react";
import Image from "next/image";
import Wheel from "./Wheel";
import instance from "@/app/axios";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { setOcultBalance } from "@/redux/reducers/UsersReducer";

const RoulettePage = () => {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const userData = useSelector((x: any) => x.UsersReducer.currentUser);
  // console.log(userData);
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const [spinning, setSpinning] = React.useState(false);
  const [winNumber, setWinNumber] = React.useState(0);
  const handleSpin = (number: number) => {
    setWinNumber(number);
  };

  const [bet, setBet] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");

  const handleReset = () => {
    setBet("");
    setAmount("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if bet or amount is empty then show a toast
    if (bet === "" || amount === "") {
      snackbar.enqueueSnackbar("Bet or amount can't be empty", {
        variant: "warning",
      });
      return;
    }
    instance
      .post("/roulette", {
        bet: amount,
        number: bet,
        user: user,
      })
      .then((res) => {
        handleSpin(res?.data?.reward);
        setSpinning(true);
        setTimeout(() => {
          setSpinning(false);
          if (res?.data?.status) {
            dispatch(
              setOcultBalance(userData.ocult_balance + Number(amount) * 10)
            );
            snackbar.enqueueSnackbar("You win", {
              variant: "success",
            });
          } else {
            dispatch(setOcultBalance(userData.ocult_balance - Number(amount)));
            snackbar.enqueueSnackbar("You lose", {
              variant: "error",
            });
          }
        }, 5000);
      })
      .catch((err) => {
        snackbar.enqueueSnackbar(err?.response?.data, {
          variant: "error",
        });
      });
  };

  return (
    <div className="bg-black  text-white pt-3 h-full flex-col w-screen px-3 select-none overflow-y-scroll">
      <div className="min-h-[770px]">
        {/* buttons */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <button className="text-white border text-xs border-[#FED527] rounded-lg px-2 py-1 mr-2 flex space-x-2">
              <Image
                src="/images/globe_icon.png"
                width={20}
                height={20}
                alt=""
              />
              <span>English</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className="text-white border text-xs border-[#FED527] rounded-lg px-3 py-1 mr-2 flex space-x-3">
              <span>Info</span>
              <Image
                src="/images/info_button_img.png"
                width={20}
                height={20}
                alt=""
              />
            </button>
          </div>
        </div>
        {/* title */}
        <div className="mt-3  bg-[url('/images/title_bg.png')] h-20   bg-contain bg-center bg-no-repeat flex items-center justify-center">
          <div className="space-x-4 flex items-center justify-center">
            <Image
              src="/images/duck_icon.png"
              height={50}
              width={50}
              alt="duck"
            />
            <h2 className="text-base font-bold">
              {userData?.username ? userData.username : userData?.tg_id}
            </h2>
          </div>
        </div>

        {/* heading */}
        <h1 className="text-[#FED527] text-2xl text-center">Roullete</h1>
        <p className="text-[#FED527] text-md text-center">
          Balance:{" "}
          <span className="font-bold">
            {userData ? userData.ocult_balance : 0}
          </span>
        </p>
        {/* wheel */}
        <div className="w-full flex items-center justify-center mt-4">
          {/* <Image src="/images/wheel.png" height={280} width={280} alt="wheel" /> */}
          <Wheel number={winNumber} />
        </div>

        {/* control buttons */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center justify-center  mt-0"
        >
          <div className="w-full flex items-center justify-center mt-10 space-x-4">
            <input
              type="number"
              className="w-[100px] h-[40px] no-arrow border bg-black border-[#FED527] focus:outline-none rounded-lg text-center"
              placeholder="Amount"
              value={amount}
              min={1}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="number"
              className="w-[100px] h-[40px] no-arrow border bg-black border-[#FED527] focus:outline-none rounded-lg text-center"
              placeholder="Number"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              min={0}
              max={37}
            />
          </div>
          <div className="w-full flex  items-center justify-center space-x-8 mt-11">
            <button
              type="submit"
              disabled={spinning}
              className="flex items-center  justify-center bg-[#00DE461A]  border border-[#FED527] h-[45px] w-[45px] rounded-full hover:bg-[#00de46] "
            >
              <Image
                src="/images/play.png"
                className="pl-1"
                height={22}
                width={22}
                alt="play"
              />
            </button>
            <button
              type="reset"
              className="flex items-center  justify-center bg-[#00DE461A] bg-opacity-10 border border-[#FED527] h-[45px] w-[45px] rounded-full"
            >
              <Image
                src="/images/settings.png"
                height={24}
                width={24}
                alt="play"
              />
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="flex items-center  justify-center bg-[#00DE461A] bg-opacity-10 border border-[#FED527] h-[45px] w-[45px] rounded-full"
            >
              <Image
                src="/images/refresh.png"
                height={22}
                width={22}
                alt="play"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoulettePage;
