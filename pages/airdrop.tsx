'use Client'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { forwardRef } from 'react'
import { removeKeyPairs, setKeyPairs } from '@/redux/reducers/TaskReducer'
import { useState } from 'react'
import instance from '@/app/axios'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

function Airdrop() {
  const dispatch = useDispatch()
  const user = useSelector((x: any) => x.TaskReducer.user)
  const pubKey = useSelector((x: any) => x.TaskReducer.pubKey)
  const priKey = useSelector((x: any) => x.TaskReducer.priKey)
  const [open, setOpen] = useState(false)
  const [doing, setDoing] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const connect = async () => {
    if (!user) {
      alert('Unregistered user')
      return
    }
    setDoing(true)
    const {
      data: { publicKey, privateKey },
    } = await instance.post('/connect', {
      user,
    })
    dispatch(setKeyPairs({ publicKey, privateKey }))
    setDoing(false)
  }

  const disconnect = async () => {
    setOpen(false)
    dispatch(removeKeyPairs({}))
  }

  const copy = (txt: any) => {
    alert('Copied')
    if (navigator.clipboard && window.isSecureContext)
      navigator.clipboard.writeText(txt)
    else {
      // text area method
      let textArea = document.createElement('textarea')
      textArea.value = txt
      // make the textarea out of viewport
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      return new Promise((res: any, rej) => {
        // here the magic happens
        document.execCommand('copy') ? res() : rej()
        textArea.remove()
      })
    }
  }

  return (
    <div className='flex-1 h-0'>
      <div className='py-[23px] px-5 text-white rounded-t-3xl border-t border-[#DFDCD5] bg-[#F3EFE6] h-full overflow-auto'>
        <div className='font-bold text-[42px] text-center text-[#CFFF00]'>
          Airdrop
        </div>
        <div className='flex flex-col space-y-1.5 mt-5'>
          <div className='flex items-center space-x-1 px-2 py-1.5 rounded-[4px] justify-center'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                textTransform: 'none',
              }}
            >
              {pubKey ? (
                <>
                  <button
                    className='flex items-center space-x-2 px-4 py-2 text-[12px] font-bold font-Inter text-[12px] leading-[15px] bg-black text-white rounded-[8px] transition disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => setOpen(true)}
                  >
                    <img src='/images/casper.svg' />
                    <span className='leading-[100%]'>
                      {pubKey.slice(0, 4) + '...' + pubKey.slice(-4)}
                    </span>
                  </button>
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
                          className='cursor-pointer absolute top-[21px] right-[27px]'
                          onClick={handleClose}
                          src='/images/close.svg'
                        />
                        <span className='flex flex-col space-y-2.5'>
                          <span className='mb-[35px] font-semibold text-[32px] leading-[32px] text-[#CFFF00] text-center'>
                            Your keypairs
                          </span>
                          <button className='flex items-center space-x-2.5 bg-white border border-[#E3E3E3] p-[22px] font-semibold text-[24px] text-white rounded-[16px] disabled:opacity-40 disabled:cursor-not-allowed w-full'>
                            <span className='text-[#6E6E6E] flex-1 w-0 truncate'>
                              {pubKey}
                            </span>
                            <button
                              className='flex justify-center items-center space-x-2.5 p-3 font-semibold text-[24px] bg-[#CFFF00] text-white rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
                              onClick={() => copy(pubKey)}
                            >
                              <img src='/images/copy.svg' />
                            </button>
                          </button>
                          <button className='flex items-center space-x-2.5 bg-white border border-[#E3E3E3] p-[22px] font-semibold text-[24px] text-white rounded-[16px] disabled:opacity-40 disabled:cursor-not-allowed w-full'>
                            <span className='text-[#6E6E6E] flex-1 w-0 truncate'>
                              {priKey}
                            </span>
                            <button
                              className='flex justify-center items-center space-x-2.5 p-3 font-semibold text-[24px] bg-[#CFFF00] text-white rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
                              onClick={() => copy(priKey)}
                            >
                              <img src='/images/copy.svg' />
                            </button>
                          </button>
                          <span className='flex space-x-5'>
                            <button
                              className='px-4 h-[82px] font-semibold text-[24px] bg-[#CFFF00] text-white rounded-[16px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                              onClick={disconnect}
                            >
                              Disconnect
                            </button>
                          </span>
                        </span>
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <button
                  className='flex items-center space-x-2 px-4 py-2 font-bold font-Inter text-[12px] leading-[15px] bg-black text-white rounded-[8px] transition disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={connect}
                  disabled={doing}
                >
                  <img src='/images/casper.svg' />
                  <span className='hidden sm:block leading-[100%]'>
                    Connect wallet
                  </span>
                  <span className='block sm:hidden leading-[100%]'>
                    Connect
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  // Fetch or define your static props here
  return {
    props: {
      data: {}, // Example data
    },
  }
}

export default Airdrop
