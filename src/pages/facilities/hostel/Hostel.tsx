import React from 'react'
import campus from '@/assets/images/aasc_building.webp';
import BannerAndBreadCrumb from '@/components/BannerAndBreadCrumb';

const Hostel = () => {
  return (
    <div>
        <BannerAndBreadCrumb img={campus} title='Hostel'/>
    </div>
  )
}

export default Hostel