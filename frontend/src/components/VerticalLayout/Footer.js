import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row className="" >
            <Col md={6} className="text-md-start text-sm-center">{new Date().getFullYear()} © THINKTANK</Col>
            <Col md={6} className="text-md-end text-sm-end">
              <div className="">
              product of techlake
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
