'use Client'

import React, { Ref, forwardRef, useRef, useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import '../../globals.css'
import instance from '@/app/axios'

interface CardProps {
  title: string
  description?: String
  price: string
  link: string
  img: string
  onLoad: () => void
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

function YoutubeCard({
  title,
  description,
  price,
  link,
  img,
  onLoad,
}: CardProps) {
  const user = useSelector((x: any) => x.TaskReducer.user)
  const snackbar = useSnackbar()
  const [open, setOpen] = useState(false)
  const [doing, setDoing] = useState(false)
  const [watched, setWatched] = useState(false)
  const playerRef = useRef()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleBonus = () => {
    if (doing || !watched) return
    setDoing(true)
    instance
      .post('/bonus', {
        user,
        title,
        price,
      })
      .then((response: any) => {
        // console.log(response.data)
        if (response.data.stats == 'success')
          snackbar.enqueueSnackbar(
            `You gain ${price} coins.  Your balance is ${response.data.mount}`,
            { autoHideDuration: 1000 }
          )
        else
          snackbar.enqueueSnackbar('You need to wait 24 hours for next time', {
            autoHideDuration: 1000,
          })
        setDoing(false)
      })
  }
  const getVideoIdFromUrl = (url: string) => {
    const urlParams = new URL(url).searchParams
    return urlParams.get('v')
  }
  const onReady = (event: any) => {
    playerRef.current = event.target
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef?.current) {
        const elapsed_sec = (playerRef?.current as any).getCurrentTime() // this is a promise. dont forget to await
        if (elapsed_sec > 60) {
          clearInterval(interval)
          setWatched(true)
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [playerRef.current])
  return (
    <>
      <div
        className='select-none cursor-pointer mt-3 bg-white border border-[#E3E3E3] px-[22px] h-[94px] flex items-center rounded-[24px]'
        onClick={handleClickOpen}
      >
        <img
          src={img}
          alt='mexc'
          className='w-14 h-14 rounded-full'
          onLoad={onLoad}
        />
        <div className='flex flex-col space-y-1 ml-3'>
          <p className='font-medium text-[14px] text-[#6E6E6E]'>
            Join to our {title}
          </p>
          <div className='flex space-x-2 items-center'>
            <img src='/images/bg/coin.png' alt='dollar' className='w-6 h-6' />
            <div className='font-bold text-[22px] leading-[22px] text-[#CFFF00]'>
              +{price}
            </div>
          </div>
        </div>
        <div className='ml-auto flex items-center'>
          <img src='/images/CaretRight.svg' alt='' />
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        sx={{ backdropFilter: 'blur(19px)' }}
      >
        <DialogContent>
          <DialogContentText
            id='alert-dialog-slide-description'
            sx={{ color: 'white' }}
          >
            <img
              className='absolute top-[21px] right-[27px] cursor-pointer'
              onClick={handleClose}
              src='/images/close.svg'
            />
            <span className='flex flex-col text-center'>
              <YouTube
                videoId={getVideoIdFromUrl(link)}
                opts={{
                  height: '300',
                  width: '100%',
                  playerVars: { autoplay: 1 },
                }}
                onStateChange={onReady}
              />
              <span className='mt-4 font-semibold text-[32px] leading-[32px] text-[#CFFF00]'>
                {title}
              </span>
              <span className='mt-4 font-medium text-[14px] leading-[14px] text-[#6E6E6E]'>
                {description}
              </span>
              <span className='flex justify-center space-x-[10.61px] items-center mt-4 font-bold text-[29px] leading-[29px] text-[#CFFF00]'>
                <img
                  src='/images/bg/coin.png'
                  alt='dollar'
                  className='w-[31.84px] h-[31.84px]'
                />
                <div>+{price}</div>
              </span>
              <span className='flex justify-center mt-[29.08px]'>
                <button
                  className='px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-white rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                  onClick={handleBonus}
                  disabled={doing || !watched}
                >
                  Get Reward
                </button>
              </span>
            </span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default YoutubeCard
