import React from 'react'
import { Navbar, Container, Col, Row } from 'react-bootstrap'

class Footer extends React.Component {
  render() {
    let y = new Date().getFullYear()
    return (
      <Navbar fixed="bottom" bg="dark" variant="dark" className="py-2">
        <Container>
          <Row className="w-100">
            <Col lg={12} className="text-center text-muted">
              <div>{y}-{y+1}, All Rights Reserved — Master MIOLA · ENSIAS</div>
            </Col>
          </Row>
        </Container>
      </Navbar>
    )
  }
}
export default Footer
