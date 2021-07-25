import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

let signupUrl =window.location.origin+'/signup';

class SignupModal extends Component {
  constructor(props, context) {
  super(props, context);

  this.state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verifyPassword: '',
    showModal: false,
    signupResponse: '',
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
  formData.append('firstname', this.state.firstName)
  formData.append('lastname', this.state.lastName)
  formData.append('email', this.state.email)
  formData.append('password', this.state.password)
  formData.append('password_confirmation', this.state.verifyPassword)
  axios({
    method: 'post',
    url: signupUrl,
    data: formData,
    withCredentials: true,
    config: { headers: {'Content-Type': 'multipart/form-data', "X-CSRFToken": $('meta[name="csrf-token"]').attr('content') } }
  })
  .then((response) => {
    console.log(response.data)
    this.setState({
      signupResponse: response.data
    });
    if (this.state.signupResponse=='Signed Up!') {
      console.log('true')
      this.props.action();
      this.close();
    }
    else if (this.state.signupResponse=='Email is already signed up!') {
      alert(this.state.signupResponse)
      this.close();
    }
  })
  .catch((response) => {
      //handle error
      this.props.fail();
      this.close();
  });
}

render() {
  return(
    <>
    <button onClick={this.open}><i className="fa fa-user"> </i> Sign Up</button>
    { this.state.showModal ? 
        <Modal style={{opacity:1}} show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form method="post" onSubmit={this.handleSubmit}>
                    <Form.Group>
                    <Form.Label>First Name (letters, hypens/dashes, apostrophes only)</Form.Label>
                    <Form.Control size="sm" type="text" name="firstname" value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Last Name (letters, hypens/dashes, apostrophes only)</Form.Label>
                    <Form.Control size="sm" type="text" name="lastname" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="sm" type="text" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Password (at least 8 characters long, contain a number, an uppercase and a lowercase letter and a special character)</Form.Label>
                    <Form.Control size="sm" type="password" name="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Verify Password</Form.Label>
                    <Form.Control size="sm" type="password" name="password_confirmation" value={this.state.verifyPassword} onChange={e => this.setState({ verifyPassword: e.target.value })}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" >Submit</Button>
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

export default SignupModal;