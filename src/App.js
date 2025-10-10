import React from "react";
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react';
import { SlaeProvider, useSlae } from './context/SlaeContext';
import theme from './theme/theme';
import Header from './components/Header';
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SlaeProvider>
        <AppContent />
      </SlaeProvider>
    </ChakraProvider>
  );
}

function AppContent() {
  const { state } = useSlae();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main>
        {state.screen === "input" ? (
          <InputPage />
        ) : (
          <ResultPage />
        )}
      </main>
      {/* Footer will be refactored and added here */}
    </>
  );
}

export default App;