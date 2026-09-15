import React from 'react'
import Header from '../components/layout/Header'

const MainLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      <Header/>
      <main className='containair mx-auto px-4 py-8'>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
