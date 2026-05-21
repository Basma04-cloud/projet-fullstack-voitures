import React, { Component } from 'react'
import { Card, Form, Button, Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faSearch, faTag, faComments } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const API = 'http://localhost:8081'

export default class AIConseiller extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Recommandation
      budget: '', usage: '', recommandation: '',
      // Estimation
      voitureId: '', estimation: '',
      // Chat
      question: '', reponse: '',
      // Loading
      loading: false
    }
  }

  callAI = async (endpoint, payload, resultKey, stateKey) => {
    this.setState({ loading: true, [stateKey]: '' })
    try {
      const res = payload
        ? await axios.post(`${API}/ai/${endpoint}`, payload)
        : await axios.get(`${API}/ai/${endpoint}`)
      this.setState({ [stateKey]: res.data[resultKey] })
    } catch {
      this.setState({ [stateKey]: '⚠ Erreur : vérifiez qu\'Ollama est démarré (ollama serve).' })
    } finally {
      this.setState({ loading: false })
    }
  }

  recommander = (e) => {
    e.preventDefault()
    this.callAI('recommander',
      { budget: parseInt(this.state.budget), usage: this.state.usage },
      'recommandation', 'recommandation')
  }

  estimer = (e) => {
    e.preventDefault()
    this.setState({ loading: true, estimation: '' })
    axios.get(`${API}/ai/estimer/${this.state.voitureId}`)
      .then(res => this.setState({ estimation: res.data.estimation, loading: false }))
      .catch(() => this.setState({
        estimation: '⚠ Erreur : vérifiez Ollama et l\'id voiture.', loading: false
      }))
  }

  chat = (e) => {
    e.preventDefault()
    this.callAI('chat', { question: this.state.question }, 'reponse', 'reponse')
  }

  AIBlock({ text, loading }) {
    if (loading) return <div className="ai-response"><Spinner size="sm" /> Génération en cours...</div>
    if (!text) return null
    return <div className="ai-response">{text}</div>
  }

  render() {
    const { budget, usage, recommandation, voitureId, estimation,
            question, reponse, loading } = this.state

    return (
      <Card className="border border-warning bg-dark text-white">
        <Card.Header className="text-warning fw-bold">
          <FontAwesomeIcon icon={faRobot} /> Conseiller IA — Magasin Voitures MIOLA
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-3">
            Notre IA métier (Ollama / LLaMA3) analyse le catalogue en temps réel
            pour vous aider à vendre et conseiller vos clients.
          </p>

          <Tabs defaultActiveKey="recommander" className="mb-3" variant="pills">

            {/* ─── Onglet 1 : Recommandation ─── */}
            <Tab eventKey="recommander"
              title={<><FontAwesomeIcon icon={faSearch}/> Recommandation</>}>
              <Form onSubmit={this.recommander} className="mt-3">
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label>Budget maximum (DH)</Form.Label>
                    <Form.Control required type="number"
                      className="bg-dark text-white"
                      placeholder="ex: 100000"
                      value={budget}
                      onChange={e => this.setState({ budget: e.target.value })} />
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label>Usage prévu</Form.Label>
                    <Form.Control required type="text"
                      className="bg-dark text-white"
                      placeholder="ex: ville, famille, autoroute..."
                      value={usage}
                      onChange={e => this.setState({ usage: e.target.value })} />
                  </Form.Group>
                </Row>
                <Button type="submit" variant="warning" disabled={loading}>
                  {loading ? <Spinner size="sm"/> : '🔍'} Recommander
                </Button>
              </Form>
              {recommandation &&
                <div className="ai-response mt-3">{recommandation}</div>}
            </Tab>

            {/* ─── Onglet 2 : Estimation ─── */}
            <Tab eventKey="estimer"
              title={<><FontAwesomeIcon icon={faTag}/> Estimation prix</>}>
              <Form onSubmit={this.estimer} className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>ID de la voiture à évaluer</Form.Label>
                  <Form.Control required type="number"
                    className="bg-dark text-white"
                    placeholder="ex: 1"
                    value={voitureId}
                    onChange={e => this.setState({ voitureId: e.target.value })} />
                  <Form.Text className="text-muted">
                    Consultez la liste des voitures pour trouver l'ID.
                  </Form.Text>
                </Form.Group>
                <Button type="submit" variant="warning" disabled={loading}>
                  {loading ? <Spinner size="sm"/> : '💰'} Estimer
                </Button>
              </Form>
              {estimation &&
                <div className="ai-response mt-3">{estimation}</div>}
            </Tab>

            {/* ─── Onglet 3 : Chatbot ─── */}
            <Tab eventKey="chat"
              title={<><FontAwesomeIcon icon={faComments}/> Chatbot</>}>
              <Form onSubmit={this.chat} className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Posez votre question</Form.Label>
                  <Form.Control as="textarea" rows={3}
                    className="bg-dark text-white"
                    placeholder="ex: Quelle voiture recommandez-vous pour une famille de 5 personnes ?"
                    value={question}
                    onChange={e => this.setState({ question: e.target.value })} />
                </Form.Group>
                <Button type="submit" variant="warning" disabled={loading}>
                  {loading ? <Spinner size="sm"/> : '💬'} Envoyer
                </Button>
              </Form>
              {reponse &&
                <div className="ai-response mt-3">{reponse}</div>}
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    )
  }
}
