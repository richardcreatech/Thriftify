import React from 'react'
import MainAside from '../../components/MainAside'
import "../../styles/main.css"
import { Outlet } from 'react-router-dom'
import ProfileCard from '../../components/ProfileCard'

function Home() {
  return (
      <main id='my_main_page'>
          <MainAside />
          <section id='main_content'>
              <Outlet />
          </section>
    </main>
  )
}

export default Home