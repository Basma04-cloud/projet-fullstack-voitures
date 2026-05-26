import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Bienvenue extends React.Component {
  render() {
    return (
      <div className="p-5 mb-4 bg-dark text-white rounded-3">
        <Container fluid>
          <h1 className="display-5 fw-bold">
             Bienvenue au Magasin des Voitures
          </h1>
          <blockquote className="blockquote mb-3">
            <p className="lead">
              Le meilleur de nos voitures est exposé près de chez vous.
            </p>
            <footer className="blockquote-footer text-light">
              Master MIOLA — ENSIAS
            </footer>
          </blockquote>
          <div className="d-flex gap-3 mt-4">
            <Link to="/list" className="btn btn-outline-light">
               Voir le catalogue
            </Link>
            <Link to="/ai" className="btn btn-outline-warning">
               Conseiller IA
            </Link>
          </div>
        </Container>
      </div>
    )
  }
}
export default Bienvenue
