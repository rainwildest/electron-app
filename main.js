const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/build/index.html')}`
  )
  // mainWindow.loadURL(`file://${path.join(__dirname, './build/index.html')}`)

  // closed clear mainWindow
  mainWindow.on('closed', () => (mainWindow = null))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // 清掉 menu
  Menu.setApplicationMenu(null)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 有些 API 只能在這個事件發生後才能用。
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 記錄被選擇文件夾中的文件列表
let filesStorage = []
// 文件夾路徑中文件所在的父文件夾
let lastDirName = ''
// 記錄被選擇的文件夾路徑
let dirPath = ''

// 清空 filesStorage、lastDirName、dirPath
const clearFilesStorage = () => {
  filesStorage = []
  lastDirName = ''
  dirPath = ''
}

// 開始轉換
ipcMain.on('start', (e, arg) => {
  // 開始轉換
  const fs = require('fs')
  e.sender.send('rename-start')
  let filename = ''

  for (let i = 0; i < filesStorage.length; i++) {
    filename = filesStorage[i]
    let rename = false

    if (filename.indexOf('-') > 0) {
      const name = (filename.split('-'))[0]
      rename = name !== lastDirName
    } else {
      rename = true
    }

    if (rename) {
      try {
        fs.renameSync(`${dirPath}/${filename}`, `${dirPath}/${lastDirName}-${filename}`)
      } catch (error) {
        console.log(error)
        break
      }
    } else {

    }
  }

  // 結束轉換
  e.sender.send('rename-end')
  clearFilesStorage()
})

// 清空內容
ipcMain.on('clear-rename-data', (e, arg) => {
  clearFilesStorage()
  e.sender.send('rename-data', { total: 0 })
})

ipcMain.on('open-select-dir', (e, arg) => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'openDirectory']
  }).then(result => {
    // console.log(result.canceled)
    // 獲取返回的路徑
    const paths = result.filePaths
    if (paths.length) {
      const fs = require('fs')
      dirPath = paths[0]

      lastDirName = dirPath.substr(dirPath.lastIndexOf('\\') + 1)
      // 讀取目錄下的文件
      const files = fs.readdirSync(dirPath)
      filesStorage = [...files]

      // 發送資料到前端
      e.sender.send('rename-data', { total: files.length })
    }
    // 讀取目錄下的文件
  }).catch(err => {
    console.log(err)
    // 後面應該會有一個報錯的提示
  })
})
