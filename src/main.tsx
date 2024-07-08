import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/config'
import { ContractsProvider } from './context/Contracts/ContractsProvider.tsx'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ContractsProvider>
          <App /> 
        </ContractsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
