import '../styles/globals.css'
import "tailwindcss/tailwind.css";
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import initAuth from '../utils/initAuth'
import LoadingOverlay from '../components/LoadingOverlay';
import { LoadingOverlayProvider } from '../context/GlobalLoadingContext'

initAuth()

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => (url !== router.pathname) && setLoading(true);
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return <>
    <LoadingOverlay isLoading={loading} />
    <LoadingOverlayProvider>
      <Component {...pageProps} />
    </LoadingOverlayProvider>
  </>
}

export default MyApp
