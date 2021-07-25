import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import NewItemModal from './NewItemModal.js';
import SignupModal from './SignupModal.js';
import LoginModal from './LoginModal.js';
import Items from './Items.js';

let checkLoginUrl =window.location.origin+'/islogin';
let logoutUrl =window.location.origin+'/logout';

class Home extends Component  {
    constructor(props) {
      super(props);
  
      this.state = {
        loggedIn:false,
        errorMessage: null,
        downvoteMessage:null,
        email: null,
        itemAdded: 0
      };
  
      this.isLoggedIn = this.isLoggedIn.bind(this);
      this.logOut = this.logOut.bind(this);
      this.newItemfailure = this.newItemfailure.bind(this);
      this.loginfailure = this.loginfailure.bind(this);
      this.newItem = this.newItem.bind(this);
      this.downvoteMessage = this.downvoteMessage.bind(this);
      this.downvoteFailure = this.downvoteFailure.bind(this);
    }
  
    componentDidMount() {
      //console.log("HomeComponentDidMount");
      //console.log($('meta[name="csrf-token"]').attr('content'));
      this.isLoggedIn();
      //console.log('END didMount');
      //console.log(this.state)
    }
  
    componentDidUpdate(prevState) {
      if (prevState.loggedIn!==this.state.loggedIn) {
        console.log('HomeComponentDidUpdate');
      }
    }
  
    isLoggedIn() {
      const promise = axios.get(checkLoginUrl, {withCredentials: true,});
      promise
        .then((response) => {
          console.log('response from update', response.data);
          if (response.data.status===true) {
            this.setState({ 
              loggedIn:true,
              errorMessage:null,
              email:response.data.email
          });
          }
          else {
            this.setState({ 
              loggedIn:false,
              email: null,
            })
          }
        })
        .catch(() => {
          this.setState({ 
            errorMessage: 'login/signup failed or connection to backend failed'
          })
        });
      console.log(this.state);
    }
  
    newItemfailure() {
      this.setState({ 
        errorMessage: 'invalid New Item!'
      })
    }
  
    loginfailure() {
      this.setState({ 
        errorMessage: 'login/signup invalid!'
      })
    }
  
    logOut() {
      axios.get(logoutUrl, {withCredentials: true,});
      this.isLoggedIn();
      this.setState({ 
        errorMessage: null
      })
    }
  
    newItem() {
      this.setState({ 
        itemAdded: this.state.itemAdded+1
      });
    }

    downvoteMessage() {
        this.setState({ 
            downvoteMessage: 'item downvoted'
        });
    }

    downvoteFailure() {
        this.setState({ 
            errorMessage: 'no downvoting same message twice'
        });
    }
  
    render() {
      return (
        <div>
          <div className="row">
              <div className="col-md-6 col-md-offset-3">
                {!this.state.errorMessage ? <span></span>:<div className="alert alert-danger text-center">{this.state.errorMessage}<br></br><Button variant="secondary" onClick={ e => this.setState({errorMessage: null})}>Clear Message</Button></div>}
                {!this.state.downvoteMessage ? <span></span>:<div className="alert alert-success text-center">{this.state.downvoteMessage}<br></br><Button variant="secondary" onClick={ e => this.setState({downvoteMessage: null})}>Clear Message</Button></div>}
              </div>
            <div className="col-md-6 col-md-offset-3">
                {this.state.loggedIn ? <NewItemModal action={this.newItem} fail={this.newItemfailure}/>: <SignupModal action={this.isLoggedIn} fail={this.loginfailure}/>}
                {/* <button className="btn btn-default pull-right"><i className="fa fa-sign-out"> </i> Logout</button>
                <button className="btn btn-default pull-right" data-toggle="modal" data-target="#login"><i className="fa fa-sign-in"> </i> Login</button> */}
                {this.state.loggedIn ? <button className="btn btn-default pull-right" onClick={this.logOut}><i className="fa fa-sign-out"> </i> Logout</button> : <LoginModal action={this.isLoggedIn} fail={this.loginfailure}/>}
            </div>
          </div>
          {/* <Items itemAdded={this.state.itemAdded} email={this.state.email} action={this.downvoteMessage} fail={this.downvoteFailure}/> */}
          <Items itemAdded={this.state.itemAdded} email={this.state.email} loggedIn={this.state.loggedIn} action={this.downvoteMessage} fail={this.downvoteFailure}/>
        </div>
      );
    }
  }
  
  
  export default Home;