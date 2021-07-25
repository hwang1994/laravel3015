import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

let baseUrl =window.location.origin;
let photoStorage ='/storage/pictures/';

class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email,
      unpinnedItems: [],
      errorMessage: null,
      itemAdded : this.props.itemAdded,
      recentlyViewedItems: [],
      pinnedItems: [],
      searchText: '',
      search: '',
      loggedIn: this.props.loggedIn
    };

    this.getAllItems=this.getAllItems.bind(this);
    this.getAllUnpinnedItems=this.getAllUnpinnedItems.bind(this);
    this.deleteItem=this.deleteItem.bind(this);
    this.getAllRecentlyViewedItems=this.getAllRecentlyViewedItems.bind(this);
    this.pinItem=this.pinItem.bind(this);
    this.unpinItem=this.unpinItem.bind(this);
    this.getAllPinnedItems=this.getAllPinnedItems.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.downvoteItem = this.downvoteItem.bind(this);
  }

  componentDidMount() {
    //console.log('-----------------------------------------------------')
    //console.log('MOUNTED');

    window.onpopstate = e => {
      if (window.location.search.includes("term=")) {
        this.setState({ 
          searchText: window.location.search.substr(6),
        })
      }
      else {
        this.setState({ 
          searchText: '',
        })
      }
      this.getAllItems();
    }

    if (window.location.search.includes("term=")) {
      this.setState({ 
        searchText: window.location.search.substr(6),
      }, () => {
        this.getAllItems();
      });
    }
    else {
      this.getAllItems();
    }

    //console.log('END didMount');
  }

  componentDidUpdate(prevState) {
    if (this.props.email!==this.state.email || prevState.loggedIn!==this.props.loggedIn) {
      this.setState({ 
        email: this.props.email,
        loggedIn: this.props.loggedIn
      })
      this.getAllPinnedItems();
      this.getAllUnpinnedItems();
    }
    if (prevState.itemAdded!==this.props.itemAdded) {
      this.setState({ 
        itemAdded : this.props.itemAdded
      })
      this.getAllUnpinnedItems();
    }
    console.log(this.state)
  }

  getAllItems() {
    this.getAllRecentlyViewedItems();
    this.getAllPinnedItems();
    this.getAllUnpinnedItems();
  }

  getAllUnpinnedItems() {
    const promise = axios.get(baseUrl+'/unpinned?term='+this.state.searchText, {withCredentials: true,});
    promise
      .then((response) => {
        console.log('items response', response.data);
        if (response.data!==undefined) {
          this.setState({ 
            unpinnedItems: response.data,
            errorMessage:null,
            email: this.props.email,
        });
        }
        else {
          this.setState({ 
            errorMessage: 'no items found'
          })
        }
      })
      .catch(() => {
        this.setState({ 
          errorMessage: 'no items found'
        })
    });
  }

  getAllRecentlyViewedItems() {
    const promise = axios.get(baseUrl+'/recentlyviewed', {withCredentials: true,});
    promise
      .then((response) => {
        console.log('recently viewed response', response.data);
        if (response.data!==undefined) {
          this.setState({ 
            recentlyViewedItems: response.data,
            errorMessage:null,
            email: this.props.email
        });
        }
        else {
          this.setState({ 
            errorMessage: 'no items found'
          })
        }
      })
      .catch(() => {
        this.setState({ 
          errorMessage: 'no items found'
        })
    });
  }

  getAllPinnedItems() {
    const promise = axios.get(baseUrl+'/pinned?term='+this.state.searchText, {withCredentials: true,});
    promise
      .then((response) => {
        console.log('pinned response', response.data);
        if (response.data!==undefined) {
          this.setState({ 
            pinnedItems: response.data,
            errorMessage:null,
            email: this.props.email
        });
        }
        else {
          this.setState({ 
            errorMessage: 'no items found'
          })
        }
      })
      .catch(() => {
        this.setState({ 
          errorMessage: 'no items found'
        })
    });
  }

  deleteItem(id) {
    //console.log('delete clicked');
    const promise = axios.get(baseUrl+'/delete?delete='+id, {withCredentials: true,});
    promise
      .then((response) => {
        console.log('delete response', response.data);
      })
      .catch(() => {
    });
    this.getAllItems();
  }

  pinItem(id) {
    //console.log('pin clicked');
    axios.get(baseUrl+'/pin?pin='+id, {withCredentials: true,});
    this.getAllPinnedItems();
    this.getAllUnpinnedItems();
  }

  unpinItem(id) {
    //console.log('unpin clicked');
    const promise = axios.get(baseUrl+'/unpin?unpin='+id, {withCredentials: true,});
    promise
    .then((response) => {
      console.log('unpin response' + response.data);
    });
    this.getAllPinnedItems();
    this.getAllUnpinnedItems();
  }

  handleChange(e) {
    this.setState({ searchText: e.target.value});
  }

  handleSubmit(e) {
    //console.log('submitted')
    this.componentDidMount();
  }

  downvoteItem(id) {
    //console.log('downvote clicked');
    const promise = axios.get(baseUrl+'/downvote?downvote='+id, {withCredentials: true,});
    promise
      .then((response) => {
        console.log('downvoted response', response.data);
        if (response.data=='Downvoted!') {
          this.props.action();
        }
        else if (response.data=='Downvoted! Now Deleted to due too many downvotes') {
          alert(response.data);
          this.componentDidMount();
        }
        else if (response.data=='No downvoting more than once on same product!') {
          this.props.fail();
        }
      })
      .catch(() => {
        this.props.fail();
    });
  }

  render() {
    const url = window.location.href;
    if (this.state.errorMessage!==null) {
      return (
        <div className="row">
        <h1 className="login-panel text-muted">{this.state.errorMessage}</h1>
        </div>
      );
    }
    else {
      return (
        <div>
            <div className="row"><div className="col-md-3"><h2 className="login-panel text-muted">Recently Viewed</h2><hr/></div></div>
            <Row xs={1} md={4} className="g-4">
             {this.state.recentlyViewedItems.map(item => {
                  return (
                    <Col>
                      <Card style={{ width: '24rem', marginRight: '4rem' }} key={item.id}>
                        <Card.Header>{this.state.email===item.email ? <span className="pull-right text-muted"> <Button variant="danger" onClick={ e =>this.deleteItem(item.id)}><i className="fa fa-trash"></i></Button></span>:<span></span>}</Card.Header>
                          <Link to={`/product?id=${item.id}`} >
                            <Card.Img variant="top" src={baseUrl+photoStorage+item.picture}/>
                          </Link>
                          <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.description}</Card.Text>
                            { this.state.email ? <Button variant="primary" onClick={ e =>this.downvoteItem(item.id)}><i className="fa fa-thumbs-down"></i></Button>:<span></span>}
                          </Card.Body>
                        <Card.Footer className="text-muted"><span><a href={`mailto:${item.email}`} data-toggle="tooltip" title="Email seller"><i className="fa fa-envelope"></i>{item.name}</a></span> <span className="pull-right">${(Math.round(item.price * 100) / 100).toFixed(2)}</span></Card.Footer>
                      </Card>
                    </Col>
                  )
              })}
              </Row>
            <div className="row"><div className="col-md-3"><h2 className="login-panel text-muted">Items For Sale</h2><hr/></div></div>              
            <div className="row" style={{display : 'inline'}}>
                <div className="col-md-4">
                    <form className="form-inline">
                    <div className="form-group" >
                        <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <Link to={`/?term=${this.state.searchText}`} onClick={this.handleSubmit}><input type="submit" className="btn btn-default" value="Search"/></Link>
                    <CopyToClipboard text={url}><button className="btn btn-default" data-toggle="tooltip" title="Shareable Link!"><i className="fa fa-share"></i></button></CopyToClipboard> 
                    </form>
                    <br/>
                </div>
            </div>
            {this.state.loggedIn ? 
              <Row xs={1} md={4} className="g-4">            
              {this.state.pinnedItems.map(item => {
                  return (
                    <Col>
                      <Card border="warning" style={{ width: '24rem' }} key={item.id}>
                        <Card.Header><Button variant="warning" onClick={ e =>this.unpinItem(item.id)}><i className="fa fa-dot-circle-o"></i></Button>{this.state.email===item.email ? <span className="pull-right text-muted"> <Button variant="danger" onClick={ e =>this.deleteItem(item.item_id)}><i className="fa fa-trash"></i></Button></span>:<span></span>}</Card.Header>
                        <Link to={`/product?id=${item.id}`} >
                          <Card.Img variant="top" src={baseUrl+photoStorage+item.picture}  />
                        </Link>
                        <Card.Body>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>{item.description}</Card.Text>
                          { this.state.email ? <Button variant="primary" onClick={ e =>this.downvoteItem(item.item_id)}><i className="fa fa-thumbs-down"></i></Button>:<span></span>}
                        </Card.Body>
                        <Card.Footer className="text-muted"><span><a href={`mailto:${item.email}`} data-toggle="tooltip" title="Email seller"><i className="fa fa-envelope"></i>{item.name}</a></span> <span className="pull-right">${(Math.round(item.price * 100) / 100).toFixed(2)}</span></Card.Footer>
                      </Card>
                    </Col>
                  )
              })}
              </Row> 
             : <span></span>
            }
              <br/>
              <Row xs={1} md={4} className="g-4">
              {this.state.unpinnedItems.map(item => {
                  return (
                    <Col>
                      <Card style={{ width: '24rem'}} key={item.id} >
                        <Card.Header>{ this.state.email ? <Button variant="warning" onClick={ e =>this.pinItem(item.id)}><i className="fa fa-thumb-tack"></i></Button>:<span></span>}{ this.state.email===item.email ? <span className="pull-right text-muted"> <Button variant="danger" onClick={ e =>this.deleteItem(item.id)}><i className="fa fa-trash"></i></Button></span>:<span></span>}</Card.Header>
                        <Link to={`/product?id=${item.id}`}>
                          <Card.Img variant="top" src={baseUrl+photoStorage+item.picture} />
                        </Link>
                        <Card.Body>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>{item.description}</Card.Text>
                          { this.state.email ? <Button variant="primary" onClick={ e =>this.downvoteItem(item.id)}><i className="fa fa-thumbs-down"></i></Button>:<span></span>}
                        </Card.Body>
                        <Card.Footer className="text-muted"><span><a href={`mailto:${item.email}`} data-toggle="tooltip" title="Email seller"><i className="fa fa-envelope"></i>{item.name}</a></span> <span className="pull-right">${(Math.round(item.price * 100) / 100).toFixed(2)}</span></Card.Footer>
                      </Card>
                    </Col>
                  )
              })}
            </Row>
        </div>
      );
    }

  }
}

export default Items;