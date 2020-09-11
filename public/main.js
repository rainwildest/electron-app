const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/build/index.html')}`
  )

  // closed clear mainWindow
  mainWindow.on('closed', () => (mainWindow = null))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
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

const filesStorage = []
ipcMain.on('toggle-image', (e, arg) => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'openDirectory']
  }).then(result => {
    // console.log(result.canceled)
    // 獲取返回的路徑
    const paths = result.filePaths
    if (paths.length) {
      const fs = require('fs')
      const path = paths[0]

      const lastDirName = path.substr(path.lastIndexOf('\\') + 1)
      // 讀取目錄下的文件
      const files = fs.readdirSync(path)
      files.forEach(value => {
        filesStorage.push({
          data: value,
          state: 'wait'
        })
      })

      // for (let i = 0; i < files.length; i++) {
      //   try {
      //     fs.renameSync(`${path}/${files[i]}`, `${path}/${lastDirName}-${files[i]}`)
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
      e.sender.send('render-data', filesStorage)
    }
    // 讀取目錄下的文件
  }).catch(err => {
    console.log(err)
  })
})
