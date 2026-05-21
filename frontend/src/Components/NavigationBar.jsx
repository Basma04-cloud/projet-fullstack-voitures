import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class NavigationBar extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/">🚗 Voiture Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-collapse" />
        <Navbar.Collapse id="nav-collapse">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/add">➕ Ajouter Voiture</Nav.Link>
            <Nav.Link as={Link} to="/list">📋 Liste Voitures</Nav.Link>
            <Nav.Link as={Link} to="/ai">🤖 Conseiller IA</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
export default NavigationBar
