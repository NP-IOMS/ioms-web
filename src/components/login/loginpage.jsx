import React, { Component } from 'react';
import loginImg from '../../images/home.png';
import '../../Styles/Login.scss';
import LoginController from '../../server/controllers/LoginController';

const _ = require('lodash');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: [],
      user: {}
    };
  }

  handleChange = elem => {
    this.setState({
      [elem.target.id]: elem.target.value
    });
    this.clearValidationError(elem.target.id);
  };

  handleOnSubmit = elem => {
    elem.preventDefault();
    if (this.validateSignIn()) {
      // console.log('Valid user');
    } else {
      // console.log('InValid user');
    }
  };

  async validateSignIn() {
    let valid = true;
    if (this.state.username === '') {
      this.showValidationError('username', 'username can not be empty!');
      valid = false;
    }
    if (this.state.password === '') {
      this.showValidationError('password', 'password can not be empty!');
      valid = false;
    }

    if (valid) {
      const resp = await this.authenticateUser(
        this.state.username,
        this.state.password
      );

      if (_.isEmpty(resp)) {
        this.showValidationError('login', 'Invalid credentials..!!');
        valid = false;
      } else {
        this.setState({
          username: this.state.username,
          password: this.state.password,
          errors: [],
          user: {
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
    this.props.history.push('/ioms/home/', this.state);
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
    let passwordErrMsg = null;
    let loginErrMsg = null;

    for (let err of this.state.errors) {
      if (err.elem === 'username') {
        usernameErrMsg = err.msg;
      }
      if (err.elem === 'password') {
        passwordErrMsg = err.msg;
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
                      <label htmlFor='password'>Password</label>
                      <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='password'
                        onChange={this.handleChange}
                      />
                      <small className='danger-error'>
                        {passwordErrMsg ? passwordErrMsg : ''}
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
