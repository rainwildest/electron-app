import React, { useEffect, useState } from 'react'
import { Button, Box, Flex, Tooltip } from '@chakra-ui/core'
const { ipcRenderer } = window.require('electron')

const Main = () => {
  const [filesData, setFilesData] = useState({ total: 0, state: 'ready' })
  const [calc, setCalc] = useState(0)
  const [ready, setReady] = useState(false)
  const [isStartRename, setIsStartRename] = useState(false)

  useEffect(() => {
    console.log('kkk')
    ipcRenderer.on('rename-end', (e, data) => {
      // setIsReanmed(true)
      setIsStartRename(false)
      setReady(false)
      setCalc(calc + 1)
      setFilesData(data)
    })

    ipcRenderer.on('rename-start', (e, data) => {
      setIsStartRename(true)
    })

    ipcRenderer.on('rename-data', (e, data) => {
      setFilesData(data)
      if (data.total) {
        setReady(true)
      }
    })
  }, [])

  return (
    <Flex
      position='absolute'
      top='0px'
      bottom='0px'
      left='0'
      right='0'
      flexDirection='column'
    >
      {
        filesData.path && (
          <Tooltip label={filesData.path}>
            <Flex px={4} py={2} fontSize='14px' cursor='default'>
              <Box flexShrink='0'>路徑：</Box>

              <Box
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                overflow='hidden'
                wordBreak='break-all'
              >

                {filesData.path}
              </Box>
            </Flex>
          </Tooltip>
        )
      }

      <Flex flex='1' justifyContent='center' alignItems='center'>
        <Flex alignItems='center' flexDirection='column'>
          {!!ready && (
            <Button
              variantColor='blue'
              _focus={{ boxShadow: 'none' }}
              onClick={() => {
                setReady(false)
                ipcRenderer.send('clear-rename-data')
              }}
              size='sm'
              width='80px'
            >
              清空
            </Button>
          )}
          <Box my={4}>
            {
              !ready && (
                <Button
                  variantColor='blue'
                  _focus={{ boxShadow: 'none' }}
                  onClick={() => {
                    // 發送這個指令給 electron 打開一個文件夾選擇框
                    ipcRenderer.send('open-select-dir')
                  }}
                  h='120px'
                  w='120px'
                  rounded='50%'
                >
                  {!calc ? '打開' : '繼續轉換'}
                </Button>
              )
            }

            {
              !!ready && (
                <Button
                  variantColor='blue'
                  _focus={{ boxShadow: 'none' }}
                  onClick={() => {
                    ipcRenderer.send('start', 'ee')
                  }}
                  h='120px'
                  w='120px'
                  rounded='50%'
                >
                  {
                    !isStartRename && (
                      <Box>開始改名</Box>
                    )
                  }
                  {
                    !!isStartRename && (
                      <Box>修改中</Box>
                    )
                  }
                </Button>
              )
            }
          </Box>
          {
            filesData.state === 'ready' && (
              <Box>總數：{filesData.total}</Box>
            )
          }

          {
            filesData.state === 'end' && (
              <Box>
                <Flex>
                  <Box w='90px' flexShrink='0' textAlign='right'>完成改名：</Box>
                  {filesData.total}
                </Flex>
                <Flex>
                  <Box w='90px' flexShrink='0' textAlign='right'>忽略改名：</Box>
                  {filesData.ignore}
                </Flex>
                <Flex>
                  <Box w='90px' flexShrink='0' textAlign='right'>改名失敗：</Box>
                  {filesData.error}
                </Flex>
              </Box>
            )
          }
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Main
