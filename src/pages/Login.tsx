import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../firebase/utils';

import Spinner from '../components/Spinner';

import logo from '../assets/logo-white.png';
import openEye from '../assets/svg/eye-on.svg';
import closeEye from '../assets/svg/eye-off.svg';

interface IState {
  email: string;
  password: string;
  isShow: boolean;
  error: string | null;
  isLoading: boolean;
}

export default class Login extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isShow: false,
      error: null,
      isLoading: false,
    };
  }

  onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = this.state;
    const inputValidation = this.validateInput(email, password);
    if (inputValidation === 'valid') {
      try {
        this.setState({ isLoading: true });
        await login(email, password);
        this.setState({ isLoading: false });
      } catch (err) {
        this.setState({ isLoading: false, error: err.message }, () =>
          setTimeout(() => this.setState({ error: null }), 4500)
        );
      }
    } else {
      this.setState({ error: inputValidation }, () =>
        setTimeout(() => this.setState({ error: null }), 4500)
      );
    }
  };

  onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    const { value } = e.currentTarget;
    this.setState((state) => ({ ...state, [name]: value }));
  };

  validateInput = (email: string, password: string) => {
    if (
      // eslint-disable-next-line
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.toLowerCase()
      )
    ) {
      return 'Unvalid email address. Please verify your email and try again.';
    }
    if (password.length < 8) {
      return 'Unvalid password. Please verify your password and try again.';
    }
    return 'valid';
  };

  toggleShowPassword = () =>
    this.setState(({ isShow }) => ({ isShow: !isShow }));

  render() {
    const { email, password, isShow, error, isLoading } = this.state;
    return (
      <div className="login-container">
        <Link to="/">
          <div className="header">
            <div className="logo">
              <img src={logo} alt="dz sos animal logo" />
            </div>
          </div>
        </Link>
        {isLoading && (
          <Spinner
            width={25}
            height={25}
            laoding={isLoading}
            borderColor="#fafbfc"
            borderTopColor="transparent"
          />
        )}

        <form onSubmit={this.onFormSubmit}>
          {error && <p className="error">{error}</p>}
          <div className="input">
            <label htmlFor="email">Your email: </label>
            <input
              id="email"
              type="email"
              onChange={this.onInputChange}
              value={email}
              name="email"
              required
            />
          </div>
          <div className="input">
            <label htmlFor="password">Your password: </label>
            <input
              id="password"
              type={isShow ? 'text' : 'password'}
              onChange={this.onInputChange}
              value={password}
              name="password"
              required
            />
            <button
              type="button"
              onClick={this.toggleShowPassword}
              className="eye-btn"
            >
              <img
                src={isShow ? openEye : closeEye}
                alt="eye show/hide password"
              />
            </button>
          </div>
          <div className="buttons">
            <button type="submit">Login</button>
            <Link to="/" className="home-link">
              Home Page
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
