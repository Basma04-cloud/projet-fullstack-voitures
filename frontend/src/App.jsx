import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import NavigationBar from './Components/NavigationBar'
import Bienvenue from './Components/Bienvenue'
import Footer from './Components/Footer'
import Voiture from './Components/Voiture'
import VoitureListe from './Components/VoitureListe'
import AIConseiller from './Components/AIConseiller'
import './App.css'

function App() {
  const marginTop = { marginTop: '20px', marginBottom: '70px' }
  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} style={marginTop}>
            <Routes>
              <Route path="/"         element={<Bienvenue />} />
              <Route path="/add"      element={<Voiture />} />
              <Route path="/edit/:id" element={<Voiture />} />
              <Route path="/list"     element={<VoitureListe />} />
              <Route path="/ai"       element={<AIConseiller />} />
            </Routes>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Router>
  )
}
export default App
