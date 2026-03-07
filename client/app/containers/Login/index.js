/*
 *
 * Login
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SignupProvider from '../../components/Common/SignupProvider';

class Login extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const registerLink = () => {
      this.props.history.push('/register');
    };

    const handleSubmit = event => {
      event.preventDefault();
      login();
    };

    return (
      <div className='login-page-wrapper'>
        <div className='login-form'>
          {isLoading && <LoadingIndicator />}
          <div className='login-logo'>
          <Link to='/' className='login-logo-link'>
            <div className='login-logo-wrapper'>
              <img src='/images/logo.svg' alt='A-Z On-Buz' className='login-logo-img' />
            </div>
          </Link>
        </div>
        <h2 className='login-title'>Welcome Back</h2>
        <p className='login-subtitle'>Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className='login-social-section'>
            <SignupProvider />
          </div>
          <div className='login-divider'>
            <span>OR</span>
          </div>
          <div className='login-form-fields'>
            <Input
              type={'text'}
              error={formErrors['email']}
              label={'Email Address'}
              name={'email'}
              placeholder={'Please Enter Your Email'}
              value={loginFormData.email}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
            <Input
              type={'password'}
              error={formErrors['password']}
              label={'Password'}
              name={'password'}
              placeholder={'Please Enter Your Password'}
              value={loginFormData.password}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
          </div>
          <hr />
          <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between'>
            <div className='d-flex justify-content-between align-items-center mb-3 mb-md-0'>
              <Button
                type='submit'
                variant='primary'
                text='Login'
                disabled={isSubmitting}
              />
              <Button
                text='Create an account'
                variant='link'
                className='ml-md-3'
                onClick={registerLink}
              />
            </div>
            <Link
              className='redirect-link forgot-password-link'
              to={'/forgot-password'}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(Login);
