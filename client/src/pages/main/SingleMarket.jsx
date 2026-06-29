import React from 'react'
import { useParams } from "react-router-dom";


function SingleMarket() {
  const { id } = useParams();

  return (
      <div>{id}</div>
  )
}

export default SingleMarket