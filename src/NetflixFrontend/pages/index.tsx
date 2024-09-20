import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import styles from '../styles/Login.module.scss';
import LoginBg from '../public/assets/loginBg.jpg';
import { ROUTES } from '../config/route';
import { getSessionId } from '../utils/session';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await getSessionId(req, res); // Set the session cookie on the server side
  return { props: {} };
};

export default function Home(): React.ReactElement {
  const router: NextRouter = useRouter();

  const onSignIn = () => {
    router.push(ROUTES.BROWSE);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name='description' content='Netflix clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Image src={LoginBg} alt='background image' placeholder='blur' layout='fill' className={styles.main__bgImage} />
        <div className={styles.main__card}>
          <h1>
            Nextflix
          </h1>
          <p>A simple Netflix clone</p>
          <div className={styles.button} onClick={onSignIn}>Sign in</div>
        </div>
      </main>
    </div>
  );
}
