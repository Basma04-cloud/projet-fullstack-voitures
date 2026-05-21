import React from 'react'
import { Toast } from 'react-bootstrap'

class MyToast extends React.Component {
  render() {
    const { show, message, type } = this.props.children
    return (
      <Toast show={show} style={{
        position: 'fixed', top: '70px', right: '20px',
        zIndex: 9999, minWidth: '260px'
      }}>
        <Toast.Header
          className={type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}
          closeButton={false}>
          <strong className="me-auto">
            {type === 'success' ? '✓ Succès' : '✗ Supprimé'}
          </strong>
        </Toast.Header>
        <Toast.Body className="bg-dark text-white">{message}</Toast.Body>
      </Toast>
    )
  }
}
export default MyToast
