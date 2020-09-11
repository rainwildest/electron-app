import React from 'react'
import './App.css'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import Main from './components/main'

function App () {
  return (
    <ThemeProvider>
      <CSSReset />
      <Main />
    </ThemeProvider>
  )
}

export default App
