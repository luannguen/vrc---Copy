'use client'

import React from 'react'
import LogoutButton from '../Logout'

// NavWrapper component giữ nguyên nội dung menu gốc và thêm nút logout ở dưới cùng
const NavWrapper: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Phần menu gốc */}
      <div style={{ flex: 1 }}>{children}</div>
      
      {/* Nút đăng xuất ở dưới cùng */}
      <LogoutButton />
    </div>
  )
}

export default NavWrapper
