import React, { useEffect, useState } from 'react'
import { Button, ThemeProvider, CSSReset } from '@chakra-ui/core'

const { ipcRenderer } = window.require('electron')

const Main = () => {
  const [isRenamed, setIsReanmed] = useState(false)
  const [filesData, setFilesData] = useState([])
  useEffect(() => {
    // const k = require('electron').remote.app
    ipcRenderer.on('render-data', (e, data) => {
      setFilesData(data)
    })
  })

  const test = () => {
    // 發送這個指令給electron
    ipcRenderer.send('toggle-image')
  }

  return (
    <div>
      <Button
        variantColor='green'
        _focus={{ boxShadow: 'none' }}
        onClick={test}
      >
        打開
      </Button>
      {
        filesData.map((file, index) => {
          return (
            <div key={index}>{file.data}</div>
          )
        })
      }
      {
        isRenamed && (
          <div>修改完了</div>
        )
      }
    </div>
  )
}

export default Main
