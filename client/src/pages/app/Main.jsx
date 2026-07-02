import React from 'react'
import { Outlet } from 'react-router-dom'
Outlet
import Footer from "../../components/Footer";


function Main() {
  return (
      <main id='main_page'>
          <Outlet />
          <Footer />
    </main>
  )
}

export default Main