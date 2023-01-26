import Todo from '@/components/todo/todo';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>todo project</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Todo />
    </>
  );
}
