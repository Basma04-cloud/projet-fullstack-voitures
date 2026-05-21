import React, { Component } from 'react'
import { Card, Form, Button, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import MyToast from './MyToast'

const API = 'http://localhost:8081'

// Wrapper pour injecter les params React Router v6 dans un class component
function VoitureWrapper(props) {
  const params = useParams()
  return <VoitureClass {...props} params={params} />
}

class VoitureClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '', marque: '', modele: '', couleur: '',
      immatricule: '', annee: '', prix: '',
      show: false, message: '', toastType: 'success'
    }
    this.voitureChange  = this.voitureChange.bind(this)
    this.submitVoiture  = this.submitVoiture.bind(this)
    this.resetForm      = this.resetForm.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.params
    if (id) {
      axios.get(`${API}/voitures/${id}`)
        .then(res => this.setState({ ...res.data }))
        .catch(err => console.error(err))
    }
  }

  voitureChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  resetForm() {
    this.setState({
      id:'', marque:'', modele:'', couleur:'',
      immatricule:'', annee:'', prix:''
    })
  }

  submitVoiture(e) {
    e.preventDefault()
    const voiture = {
      marque: this.state.marque, modele: this.state.modele,
      couleur: this.state.couleur, immatricule: this.state.immatricule,
      annee: parseInt(this.state.annee), prix: parseInt(this.state.prix)
    }
    const isEdit = !!this.state.id
    const req = isEdit
      ? axios.put(`${API}/voitures/${this.state.id}`, voiture)
      : axios.post(`${API}/voitures`, voiture)

    req.then(() => {
      this.setState({
        show: true, message: 'Voiture enregistrée avec succès !',
        toastType: 'success'
      })
      setTimeout(() => this.setState({ show: false }), 3000)
      if (!isEdit) this.resetForm()
    }).catch(() => {
      this.setState({ show: true, message: 'Erreur serveur.', toastType: 'danger' })
      setTimeout(() => this.setState({ show: false }), 3000)
    })
  }

  render() {
    const { show, message, toastType } = this.state
    const isEdit = !!this.state.id
    const fields = [
      { name:'marque', label:'Marque', placeholder:'ex: Toyota' },
      { name:'modele', label:'Modèle', placeholder:'ex: Corolla' },
      { name:'couleur', label:'Couleur', placeholder:'ex: Grise' },
      { name:'immatricule', label:'Immatricule', placeholder:'A-1-0000' },
      { name:'annee', label:'Année', placeholder:'2020', type:'number' },
      { name:'prix', label:'Prix (DH)', placeholder:'80000', type:'number' }
    ]

    return (
      <>
        <div style={{ display: show ? 'block' : 'none' }}>
          <MyToast children={{ show, message, type: toastType }} />
        </div>
        <Card className="border border-dark bg-dark text-white">
          <Card.Header>
            <FontAwesomeIcon icon={isEdit ? faSave : faPlusSquare} />
            {isEdit ? ' Modifier' : ' Ajouter'} Voiture
          </Card.Header>
          <Form onSubmit={this.submitVoiture} onReset={this.resetForm}>
            <Card.Body>
              <Row>
                {fields.map((f, i) => (
                  <Form.Group as={Col} md={6} key={f.name}
                    controlId={`form_${f.name}`}
                    className="mb-3">
                    <Form.Label>{f.label}</Form.Label>
                    <Form.Control
                      required
                      name={f.name}
                      type={f.type || 'text'}
                      className="bg-dark text-white"
                      placeholder={f.placeholder}
                      value={this.state[f.name]}
                      autoComplete="off"
                      onChange={this.voitureChange}
                    />
                  </Form.Group>
                ))}
              </Row>
            </Card.Body>
            <Card.Footer style={{ textAlign: 'right' }}>
              <Button size="sm" variant="success" type="submit" className="me-2">
                <FontAwesomeIcon icon={faSave} /> Submit
              </Button>
              <Button size="sm" variant="secondary" type="reset">
                <FontAwesomeIcon icon={faUndo} /> Reset
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </>
    )
  }
}

export default VoitureWrapper
