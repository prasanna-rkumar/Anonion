import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import LoadingOverlay from '../components/LoadingOverlay'
import {
  useAuthUser,
  withAuthUser
} from 'next-firebase-auth'
function Home() {
  var AuthUser = useAuthUser()
  let isAuthed = (AuthUser && AuthUser.email)
  var actionButtonHref = isAuthed ? "/anonions?new_entry=true" : "/login"

  return (
    <div className={styles.container}>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <Head>
        <title>Anonion - Anonymous Opinions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingOverlay isLoading={!AuthUser.clientInitialized} />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome {isAuthed ? "back" : ""} to&nbsp;
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 to-teal-500 font-bold">
            Anonion
          </span>
        </h1>
        <h3 className="text-2xl mt-6 text-gray-500 text-center">Get <span className="font-semibold text-gray-700">unbiased</span> opinions from your circle <span className="font-semibold text-gray-700">anonymously</span>. </h3>
        <div className="mt-4">
          <Link href={actionButtonHref}>
            <button className="transition duration-200 bounce-in bg-gradient-to-r from-green-400 to-blue-500 hover:animate-bounce text-white p-3 rounded-lg font-medium cursor-pointer transform hover:-translate-y-1 hover:scale-110">
              Create New Anonion
            </button>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export default withAuthUser()(Home)
