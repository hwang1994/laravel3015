import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

let postItemUrl =window.location.origin+'/newitem';

class NewItemModal extends Component {
  constructor(props) {
  super(props);

  this.state = {
    title: '',
    price: '',
    description: '',
    file: null,
    uploadResponse: '',
    showModal: false
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
  console.log(this.state);
  let formData = new FormData();
  formData.append('title', this.state.title)
  formData.append('price', this.state.price)
  formData.append('description', this.state.description)
  formData.append('file', this.state.file)
  axios({
    method: 'post',
    url: postItemUrl,
    data: formData,
    withCredentials: true,
    config: { headers: {'Content-Type': 'multipart/form-data', crossDomain: true } }
  })
  .then((response) => {
    console.log(response.data)
    this.setState({
      uploadResponse: response.data
    });
    if (this.state.uploadResponse=='Item Uploaded') {
      this.props.action();
      this.close();
      this.setState({
        title: '',
        price: '',
        description: '',
        file: null
      });
    }
    else {
      this.props.fail();
      this.close();
    }
  })
  .catch(function (response) {
    //alert('Error: can"t connect to database');
    this.props.fail();
    this.close();
  });
}

render() {
  return(
    <div>
      <button className="btn btn-default" onClick={this.open}><i className="fa fa-photo"></i> New Item</button>
      { this.state.showModal ? 
        <Modal style={{opacity:1}} show={this.state.showModal} onHide={this.close} >

          <Modal.Header closeButton>
            <Modal.Title>New Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form method="post" onSubmit={this.handleSubmit}>
            <Form.Group>
                <Form.Label>Title (only numbers, letters, apotrophes and dashes allowed)</Form.Label>
                <Form.Control size="sm" type="text" name="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control size="sm" type="text" name="price" value={this.state.price} onChange={e => this.setState({ price: e.target.value })}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control size="sm" type="text" name="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })}/>
            </Form.Group>
            <Form.Group>
                <Form.File label="Picture (Under 4MB)" onChange={e => this.setState({ file: e.target.files[0] })} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
          </Modal.Body>       
        </Modal> 
      : 
      null 
    }
    </div>
  );
 }
}

export default NewItemModal;