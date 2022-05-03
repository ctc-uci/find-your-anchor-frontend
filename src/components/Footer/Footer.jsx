import React from 'react';
import { Text } from '@chakra-ui/react';
import WebsiteIcon from '../../assets/footer-website-icon.svg';
import EmailIcon from '../../assets/footer-email-icon.svg';
import FacebookIcon from '../../assets/footer-facebook-icon.svg';
import TwitterIcon from '../../assets/footer-twitter-icon.svg';
import InstagramIcon from '../../assets/footer-instagram-icon.svg';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <Text className={styles['social-icon-text']}>
        <strong>Let&apos;s connect!</strong>
      </Text>
      <a href="https://findyouranchor.us/" target="_blank" rel="noreferrer">
        <img src={WebsiteIcon} alt="" className={styles['social-icon']} />
      </a>
      <a href="mailto:hello@findyouranchor.us">
        <img src={EmailIcon} alt="" className={styles['social-icon']} />
      </a>
      <a href="https://www.facebook.com/FindYourAnchor/" target="_blank" rel="noreferrer">
        <img src={FacebookIcon} alt="" className={styles['social-icon']} />
      </a>
      <a href="https://twitter.com/fyabox" target="_blank" rel="noreferrer">
        <img src={TwitterIcon} alt="" className={styles['social-icon']} />
      </a>
      <a href="https://www.instagram.com/findyouranchorbox/" target="_blank" rel="noreferrer">
        <img src={InstagramIcon} alt="" className={styles['social-icon']} />
      </a>
    </div>
  );
};

export default Footer;
