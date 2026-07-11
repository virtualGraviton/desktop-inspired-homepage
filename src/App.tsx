import { AnimatePresence } from 'framer-motion'
import { useLoginAnimation } from './hooks/useLoginAnimation'
import LoginScreen from './components/login/LoginScreen'
import DesktopScreen from './components/desktop/DesktopScreen'

export default function App() {
  const { appState, phase, handleLogin } = useLoginAnimation()

  return (
    <AnimatePresence mode="wait">
      {appState === 'login' && (
        <LoginScreen key="login" phase={phase} onEnter={handleLogin} />
      )}
      {appState === 'desktop' && (
        <DesktopScreen key="desktop" />
      )}
    </AnimatePresence>
  )
}
