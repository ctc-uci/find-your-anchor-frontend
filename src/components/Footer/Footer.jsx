import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import FacebookIcon from '../../assets/footerIcons/facebook-icon.svg';
import EmailIcon from '../../assets/footerIcons/email-icon.svg';
import InstagramIcon from '../../assets/footerIcons/instagram-icon.svg';
import TwitterIcon from '../../assets/footerIcons/twitter-icon.svg';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <Text className={styles['social-icon-text']}>
        <Link to="/login">Admin</Link>
      </Text>
      <a
        className={styles['social-icon-link']}
        href="https://www.facebook.com/FindYourAnchor/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={FacebookIcon} alt="" className={styles['social-icon']} />
      </a>
      <a className={styles['social-icon-link']} href="mailto:hello@findyouranchor.us">
        <img src={EmailIcon} alt="" className={styles['social-icon']} />
      </a>
      <a
        className={styles['social-icon-link']}
        href="https://www.instagram.com/findyouranchorbox/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={InstagramIcon} alt="" className={styles['social-icon']} />
      </a>
      <a
        className={styles['social-icon-link']}
        href="https://twitter.com/fyabox"
        target="_blank"
        rel="noreferrer"
      >
        <img src={TwitterIcon} alt="" className={styles['social-icon']} />
      </a>
    </div>
  );
};

export default Footer;
