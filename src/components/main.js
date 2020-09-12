import React, { useEffect, useState } from 'react'
import { Button, ThemeProvider, CSSReset } from '@chakra-ui/core'

const { ipcRenderer } = window.require('electron')

const Main = () => {
  const [isRenamed, setIsReanmed] = useState(false)
  const [filesData, setFilesData] = useState([])
  const [isStartRename, setIsStartRename] = useState(false)
  const [] = useState({
    start: false
  })
  useEffect(() => {
    // const k = require('electron').remote.app
    ipcRenderer.on('rename-end', (e, data) => {
      setIsReanmed(true)
      setIsStartRename(false)
    })

    ipcRenderer.on('rename-start', (e, data) => {
      setIsStartRename(true)
    })

    ipcRenderer.on('rename-data', (e, data) => {
      setFilesData(data)
    })
  })

  return (
    <div>
      <Button
        variantColor='green'
        _focus={{ boxShadow: 'none' }}
        onClick={() => {
          // 發送這個指令給electron
          ipcRenderer.send('open-select-dir')
        }}
      >
        打開
      </Button>
      {
        !!filesData.length && (
          <Button
            variantColor='green'
            _focus={{ boxShadow: 'none' }}
            onClick={() => {
              ipcRenderer.send('start')
            }}
          >
            開始轉換
          </Button>
        )
      }
      {
        !!filesData.length && (
          <Button
            variantColor='green'
            _focus={{ boxShadow: 'none' }}
            onClick={() => {
              ipcRenderer.send('clear-rename-data')
            }}
          >
            清空
          </Button>
        )
      }
      {
        !!isStartRename && (
          <div>修改中</div>
        )
      }
      {
        !!isRenamed && !isStartRename && (
          <div>修改完了</div>
        )
      }
      {
        filesData.map((file, index) => {
          return (
            <div key={index}>{file.data}</div>
          )
        })
      }
    </div>
  )
}

export default Main
