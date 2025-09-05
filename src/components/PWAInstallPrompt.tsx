import React, { useState, useEffect } from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  CloseButton,
  Box,
  useToast,
} from '@chakra-ui/react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
      toast({
        title: 'App Installed',
        description: 'Algorithmic Insights has been installed successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
      toast({
        title: 'Back Online',
        description: 'Connection restored. All features are available.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineAlert(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismissOffline = () => {
    setShowOfflineAlert(false)
  }

  return (
    <Box position="fixed" top={4} right={4} zIndex={9999} maxW="sm">
      {/* Install Prompt */}
      {showInstallPrompt && (
        <Alert status="info" mb={2} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="sm">Install App</AlertTitle>
            <AlertDescription fontSize="xs" mb={2}>
              Install Algorithmic Insights for a better experience!
            </AlertDescription>
            <Button size="xs" colorScheme="blue" onClick={handleInstallClick} mr={2}>
              Install
            </Button>
            <Button size="xs" variant="ghost" onClick={handleDismissInstall}>
              Later
            </Button>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={handleDismissInstall}
          />
        </Alert>
      )}

      {/* Offline Alert */}
      {showOfflineAlert && (
        <Alert status="warning" borderRadius="md" boxShadow="lg">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="sm">Offline Mode</AlertTitle>
            <AlertDescription fontSize="xs">
              You're offline. Some features may be limited.
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={handleDismissOffline}
          />
        </Alert>
      )}
    </Box>
  )
}

export default PWAInstallPrompt
