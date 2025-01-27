import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <HashLoader color="#123abc" loading={true} size={50} />
    </div>
  )
}

export default Loading