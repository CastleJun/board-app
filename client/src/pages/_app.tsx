import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Axios from "axios";
import { AuthProvider } from "../context/auth";
import { useRouter } from "next/router";
import { NavBar } from "../components/base-component/nav-bar";



function MyApp({ Component, pageProps }: AppProps) {
  //todo 추후 axios instance로 변경
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute && <NavBar/>}
      <div className={authRoute ? "" : "pt-16"}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
