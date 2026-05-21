import React, { Component } from 'react'
import { Card, Table, Button, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faEdit, faTrash, faRobot } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MyToast from './MyToast'

const API = 'http://localhost:8081'

export default class VoitureListe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voitures: [], show: false, message: '',
      toastType: 'success', aiDescription: '', aiLoading: false
    }
  }

  componentDidMount() {
    axios.get(`${API}/voitures`)
      .then(res => {
        const data = res.data._embedded
          ? res.data._embedded.voitureList
          : (Array.isArray(res.data) ? res.data : [])
        this.setState({ voitures: data })
      })
      .catch(err => console.error('Erreur chargement :', err))
  }

  deleteVoiture = (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return
    axios.delete(`${API}/voitures/${id}`)
      .then(() => {
        this.setState({
          show: true, message: 'Voiture supprimée avec succès.',
          toastType: 'danger',
          voitures: this.state.voitures.filter(v => v.id !== id)
        })
        setTimeout(() => this.setState({ show: false }), 3000)
      })
  }

  getAIDescription = (id) => {
    this.setState({ aiLoading: true, aiDescription: '' })
    axios.get(`${API}/ai/description/${id}`)
      .then(res => this.setState({
        aiDescription: res.data.description, aiLoading: false
      }))
      .catch(() => this.setState({
        aiDescription: 'Erreur IA — vérifiez qu\'Ollama est démarré.',
        aiLoading: false
      }))
  }

  render() {
    const { voitures, show, message, toastType, aiDescription, aiLoading } = this.state
    return (
      <>
        <div style={{ display: show ? 'block' : 'none' }}>
          <MyToast children={{ show, message, type: toastType }} />
        </div>

        <Card className="border border-dark bg-dark text-white mb-3">
          <Card.Header>
            <FontAwesomeIcon icon={faList} /> Liste des Voitures
            <span className="float-end badge bg-secondary">
              {voitures.length} voiture(s)
            </span>
          </Card.Header>
          <Card.Body>
            <Table bordered hover striped variant="dark" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Couleur</th>
                  <th>Immatricule</th>
                  <th>Année</th>
                  <th>Prix (DH)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {voitures.length === 0
                  ? <tr><td colSpan="8" className="text-center">
                      Aucune voiture disponible
                    </td></tr>
                  : voitures.map((v, i) => (
                    <tr key={v.id}>
                      <td>{i + 1}</td>
                      <td>{v.marque}</td>
                      <td>{v.modele}</td>
                      <td>{v.couleur}</td>
                      <td>{v.immatricule}</td>
                      <td>{v.annee}</td>
                      <td>{v.prix.toLocaleString()} DH</td>
                      <td>
                        <ButtonGroup size="sm">
                          <Link to={`/edit/${v.id}`}
                            className="btn btn-outline-primary btn-sm">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <Button variant="outline-warning"
                            onClick={() => this.getAIDescription(v.id)}
                            title="Fiche IA">
                            <FontAwesomeIcon icon={faRobot} />
                          </Button>
                          <Button variant="outline-danger"
                            onClick={() => this.deleteVoiture(v.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Zone fiche IA */}
        {(aiLoading || aiDescription) && (
          <Card className="border border-warning bg-dark text-white">
            <Card.Header className="text-warning">
              🤖 Fiche produit générée par IA
            </Card.Header>
            <Card.Body>
              {aiLoading
                ? <p className="ai-loading">⏳ Génération en cours...</p>
                : <div className="ai-response">{aiDescription}</div>
              }
            </Card.Body>
          </Card>
        )}
      </>
    )
  }
}
