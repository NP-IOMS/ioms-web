import React, { Component } from 'react';
import loginImg from '../../images/home.png';
import '../../styles/Login.scss';
import LoginController from '../../server/controllers/LoginController';
import Auth from '../../Auth';

const _ = require('lodash');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      pass: '',
      errors: [],
      user: {}
    };
  }
  componentDidMount() {
    if (Auth.isAuthenticated()) {
      Auth.logout(() => {
        return '';
      });
    }
  }

  handleChange = elem => {
    this.setState({
      [elem.target.id]: elem.target.value
    });
    this.clearValidationError(elem.target.id);
  };

  handleOnSubmit = elem => {
    elem.preventDefault();
    this.validateSignIn();
  };

  async validateSignIn() {
    let valid = true;
    if (this.state.username === '') {
      this.showValidationError('username', 'username can not be empty!');
      valid = false;
    }
    if (this.state.pass === '') {
      this.showValidationError('pass', 'password can not be empty!');
      valid = false;
    }

    if (valid) {
      const resp = await this.authenticateUser(
        this.state.username,
        this.state.pass
      );

      if (_.isEmpty(resp)) {
        this.showValidationError('login', 'Invalid credentials..!!');
        valid = false;
      } else if (resp === 'error') {
        this.showValidationError(
          'login',
          'Some internal issue occured, please try later..!!'
        );
        valid = false;
      } else {
        this.setState({
          username: this.state.username,
          errors: [],
          user: {
            userId: resp[0].id,
            userAccountName: resp[0].userAccountName,
            userRoleId: resp[0].userRole.id,
            userRoleName: resp[0].userRole.userRoleName
          }
        });
        this.routeChange();
      }
    }
    return valid;
  }

  routeChange = () => {
    if (this.state.user.userRoleName === 'ADMIN') {
      Auth.setUserInfo(this.state.user);
      Auth.login(() => {
        this.props.history.push('/ioms/home/');
      });
    } else {
      alert('You are not an authorized user!!');
    }
  };

  async authenticateUser(userName, userPass) {
    const finalResult = await LoginController.validateSignIn(
      userName,
      userPass
    );
    return finalResult;
  }

  showValidationError = (elem, msg) => {
    this.setState(prevState => ({
      errors: [
        ...prevState.errors,
        {
          elem,
          msg
        }
      ]
    }));
  };

  clearValidationError = elem => {
    this.setState(prevState => {
      let newErrors = [];
      for (let err of prevState.errors) {
        if (elem !== err.elem) {
          newErrors.push(err);
        }
      }
      return { errors: newErrors };
    });
  };

  render() {
    let usernameErrMsg = null;
    let passErrMsg = null;
    let loginErrMsg = null;

    for (let err of this.state.errors) {
      if (err.elem === 'username') {
        usernameErrMsg = err.msg;
      }
      if (err.elem === 'pass') {
        passErrMsg = err.msg;
      }
      if (err.elem === 'login') {
        loginErrMsg = err.msg;
      }
    }
    return (
      <div className='loginContainer'>
        <div className='login'>
          <div className='container'>
            <div className='base-container'>
              <form onSubmit={this.handleOnSubmit} className='white'>
                <div className='content'>
                  <div className='image'>
                    <img src={loginImg} alt='login' />
                  </div>
                  <div className='form'>
                    <small className='danger-error'>
                      {loginErrMsg ? loginErrMsg : ''}
                    </small>
                    <div className='form-group'>
                      <label htmlFor='username'>Username</label>
                      <input
                        type='text'
                        id='username'
                        name='username'
                        placeholder='username'
                        onChange={this.handleChange}
                      />
                      <small className='danger-error'>
                        {usernameErrMsg ? usernameErrMsg : ''}
                      </small>
                    </div>
                    <div className='form-group'>
                      <label htmlFor='pass'>Password</label>
                      <input
                        type='password'
                        id='pass'
                        name='pass'
                        placeholder='password'
                        onChange={this.handleChange}
                      />
                      <small className='danger-error'>
                        {passErrMsg ? passErrMsg : ''}
                      </small>
                    </div>
                  </div>
                </div>
                <div className='footer'>
                  <div className='loginBtnDiv'>
                    <button type='submit' className='loginBtn'>
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
