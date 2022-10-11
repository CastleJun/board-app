import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Axios from "axios";
import axios from "axios";
import { AuthProvider } from "../context/auth";
import { useRouter } from "next/router";
import { NavBar } from "../components/base-component/nav-bar";
import { SWRConfig } from "swr";
import Head from 'next/head';


function MyApp({ Component, pageProps }: AppProps) {
  //todo 추후 axios instance로 변경
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error: any) {
      console.warn(error);
      throw error.response.data;
    }
  };
  return (
    <>
      <Head>
        <script defer src="https://use.fontawesome.com/releases/v6.1.1/js/all.js" integrity="sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp" crossOrigin="anonymous" />
      </Head>
      <SWRConfig value={{
        fetcher
      }}>
        <AuthProvider>
          {!authRoute && <NavBar/>}
          <div className={authRoute ? "" : "pt-16"}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
