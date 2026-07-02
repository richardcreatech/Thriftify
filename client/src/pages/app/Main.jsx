import React from 'react'
import { Outlet } from 'react-router-dom'
Outlet
import Footer from "../../components/Footer";
import Header from '../../components/Header';


function Main() {
  return (
    <main id='main_page'>
      <Header />
          <Outlet />
          <Footer />
    </main>
  )
}

export default Main