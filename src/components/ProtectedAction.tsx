import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

interface ProtectedActionProps {
  children: React.ReactElement<any>
  onAction?: () => void
}

export default function ProtectedAction({ children, onAction }: ProtectedActionProps) {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      e.stopPropagation()
      setIsModalOpen(true)
    } else {
      if (children.props && children.props.onClick) {
        children.props.onClick(e)
      }
      if (onAction) onAction()
    }
  }

  return (
    <>
      {React.cloneElement(children, { onClick: handleClick })}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
