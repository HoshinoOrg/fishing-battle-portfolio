import Header from "@/components/Header";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="フィッシングバトル" />
      <main className="flex-grow m-5">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
