import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

let loginUrl =window.location.origin+'/login';

class LoginModal extends Component {
  constructor(props) {
  super(props);

  this.state = {
    email: '',
    password: '',
    showModal: false,
    loginResponse: ''
  };

  this.open = this.open.bind(this);
  this.close = this.close.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}

open() {
  this.setState({showModal: true});
}

close() {
  this.setState({showModal: false});
}

handleSubmit( event ) {
  event.preventDefault();
  let formData = new FormData();
  formData.append('email', this.state.email)
  formData.append('password', this.state.password)
  axios({
    method: 'post',
    url: loginUrl,
    data: formData,
    withCredentials: true,
    config: { headers: {'Content-Type': 'multipart/form-data', "X-CSRFToken": $('meta[name="csrf-token"]').attr('content') } }
  })
  .then((response) => {
    console.log(response.data)
    this.setState({
      loginResponse: response.data
    });
    if (this.state.loginResponse=='Logged In!') {
      this.props.action();
      this.close();
    }
    else {
      this.props.fail();
      this.close();
    }
  })
  .catch((response) => {
      //handle error
      alert('Error: can"t connect to backend/database');
      //this.props.fail();
      this.close();
  });
}

render() {
  return(
    <>
    <button className="btn btn-default pull-right" onClick={this.open}><i className="fa fa-sign-in"> </i> Login</button>
    { this.state.showModal ? 
        <Modal style={{opacity:1}} show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form method="post" onSubmit={this.handleSubmit}>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control size="sm" type="text" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control size="sm" type="password" name="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            </Form>
            </Modal.Body>       
        </Modal> 
        : 
        null 
    }
    </>
  );
 }
}

export default LoginModal;