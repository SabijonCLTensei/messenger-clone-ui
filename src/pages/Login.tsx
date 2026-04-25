import React from 'react';
import styles from './Login.module.css'; // Import CSS module

const Login: React.FC = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.mainContentWrapper}>
        {/* Left Section - Logo and Tagline */}
        <div className={styles.leftSection}>
          {/* Placeholder for Meta Logo */}
          <img src="/path/to/meta-logo.svg" alt="Meta" className={styles.metaLogo} />
          <h1 className={styles.tagline}>Connect with your favorite people</h1>
        </div>

        {/* Right Section - Login Form */}
        <div className={styles.rightSection}>
          <div className={styles.loginFormContainer}>
            <input
              type="text"
              placeholder="Email or phone number"
              className={styles.inputField}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.inputField}
            />
            <button className={styles.loginButton}>
              Log In
            </button>
            <a href="#" className={styles.forgotPasswordLink}>
              Forgot password?
            </a>
            <hr className={styles.divider} />
            <div className={styles.createAccountButtonContainer}>
              <button className={styles.createAccountButton}>
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className={styles.footerLinks}>
        <a href="#" className={styles.footerLink}>About</a>
        <a href="#" className={styles.footerLink}>Help</a>
        <a href="#" className={styles.footerLink}>Privacy</a>
        <a href="#" className={styles.footerLink}>Terms</a>
      </div>
    </div>
  );
};

export default Login;
