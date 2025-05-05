import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Rahul Carrer | Whatsapp</title>
        <meta name="theme-color" content="#001D28" />
        <link rel="icon" href="/images/whatsapp-logo.png" sizes="any" />
      </head>
      <body>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {children}
        </div>
      </body>
    </html>
  );
}
