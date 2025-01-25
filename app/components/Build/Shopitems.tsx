import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import instance from "@/app/axios";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {
  setTotalReward,
  setCurrentBalance,
  setCurrentUser,
} from "@/redux/reducers/UsersReducer";
import { useSnackbar } from "notistack";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Shopitems = ({ item }: { item: any }) => {
  const userData = useSelector((x: any) => x.UsersReducer.currentUser);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const snackbar = useSnackbar();

  // const [level, setLevel] = useState(0);

  // useEffect(() => {
  //   if (userData) {
  //     const boughtItem = userData?.bought_items?.find(
  //       (x: any) => x.item_id === item._id
  //     );
  //     if (boughtItem) {
  //       setLevel(boughtItem.level);
  //     }
  //   }
  // }, [userData]);

  const buyItem = async (upreward: string) => {
    if (parseInt(item.price) <= parseInt(userData.balance)) {
      setOpen(false);
      try {
        const user = await instance.post("/buyItem", {
          user: userData.tg_id,
          upreward: upreward,
          item: item._id,
        });
        dispatch(setCurrentUser(user.data));
        dispatch(setTotalReward(userData.total_reward + parseInt(upreward)));
        dispatch(setCurrentBalance(userData.balance - parseInt(item.price)));
      } catch (error) {
        // console.log(error);
        snackbar.enqueueSnackbar((error as any)?.response?.data, {
          variant: "error",
        });
      }
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className=" text-white bg-[#1a1a1a]   w-[45%] min-h-[155px] h-full  px-4 py-2 rounded-lg flex flex-col gap-2"
      >
        <div className="flex flex-row justify-between items-center gap-2">
          <img src={item?.image} alt="" className="w-14 h-14 xs:h-10 xs:w-10" />
          <div className="flex flex-col justify-end items-end">
            <h1 className="text-md xs:text-xs">{item?.name}</h1>
            <p className="text-[9px] text-end mb-2">profit per hour</p>
            <div className=" flex justify-between items-end gap-1">
              <img src={"/images/bg/coin.png"} alt="" className="w-6 h-6" />
              <p>{item?.increase}</p>
            </div>
          </div>
        </div>

        {/* stragth line */}
        <div className="border-b-2  border-[#ece7e7] mt-5"></div>
        <div className="flex justify-end xs:flex-col gap-2  w-full">
          <div className="flex gap-2 justify-end">
            {/* Lvl <h1>{level}</h1> */}
            {/* verical line */}
            {/* <div className="border-l-2 border-[#ece7e7] xs:hidden"></div> */}
          </div>
          <div className="flex justify-end gap-2">
            <img src="/images/bg/coin.png" alt="" className="w-6 h-6" />
            <p>{parseInt(item.price)}</p>
          </div>
        </div>
      </button>

      {/* dialogue */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ backdropFilter: "blur(19px)" }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <img
              className="absolute top-[21px] right-[27px] cursor-pointer"
              onClick={handleClose}
              src="/images/close.svg"
            />
            <span className="flex flex-col text-center">
              <img
                src={item?.image}
                alt="mexc"
                className="w-[200px] h-[200px] self-center"
              />
              <span className="mt-[20px] font-semibold text-[32px] leading-[32px] text-[#CFFF00]">
                {item?.name}
              </span>
              {/* <span className="mt-[10px] text-[14px] leading-[14px] text-[#6E6E6E]">
                For Level {level + 1}, you should pay
              </span> */}

              <span className="mt-[30px] font-semibold text-[16px] leading-[16px] text-[#6E6E6E]"></span>
              <span className="flex justify-center space-x-[10.61px] items-center mt-[18.5px] font-bold text-[29px] leading-[29px] text-[#CFFF00]">
                <img
                  src="/images/bg/coin.png"
                  alt="dollar"
                  className="w-[31.84px] h-[31.84px]"
                />
                <div>
                  {Intl.NumberFormat("en-US").format(parseInt(item.price))}
                </div>
              </span>
              <span className="flex justify-center mt-[29.08px]">
                <button
                  className="px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-black rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full"
                  onClick={() => {
                    buyItem(item.increase);
                  }}
                  disabled={parseInt(item.price) > parseInt(userData.balance)}
                >
                  Go ahead
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
