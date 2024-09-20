import styles from '../../styles/Footer.module.scss';
import { Github, Linkedin, Twitter } from '../../utils/icons';
import { IconType } from 'react-icons';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <p>
        Made by{' '}
        <a href='https://github.com/ayushiee/nextflix' target='_blank' rel='noreferrer'>
          <b>Ayushi Gupta</b>
        </a>
      </p>
    </div>
  );
}
