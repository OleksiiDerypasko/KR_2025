import React from 'react';
import { useSlae } from '../context/SlaeContext';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { formatNumber } from '../utils/matrixUtils';
import MatrixDisplay from '../components/MatrixDisplay';

const ResultPage = () => {
  const { state, dispatch } = useSlae();
  const { result } = state;

  const handleDownload = (format) => {
    if (!result) return;
    let data, mimeType, filename;

    if (format === 'json') {
      data = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
      filename = 'slar_solution.json';
    } else { // txt
      const { x, algorithm, steps } = result;
      const ALGORITHMS = [
        { id: "cramer", label: "Cramer's method" },
        { id: "gauss", label: "Gauss's method" },
        { id: "seidel", label: "Seidel's method" },
        { id: "gauss-jordan", label: "Gauss-Jordan method" },
        { id: "jacobi", label: "Jacobi's method" },
      ];
      const algoName = ALGORITHMS.find(a => a.id === algorithm)?.label || algorithm;
      let textContent = `Algorithm: ${algoName}\n\n`;

      textContent += "--- Steps ---\n";
      steps.forEach(step => {
        textContent += `${step.title}\n`;
        if (step.result) {
          textContent += `${step.result}\n`;
        }
        textContent += '\n';
      });

      textContent += "--- Solution ---\n";
      x.forEach((val, i) => {
        textContent += `x${i + 1} = ${formatNumber(val)}\n`;
      });

      data = textContent;
      mimeType = 'text/plain';
      filename = 'slar_solution.txt';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box as="section" p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="lg" mb={4}>Result</Heading>
      {result ? (
        <>
          <Text>
            Algorithm:{' '}
            <Text as="b">
              {result.algorithm}
            </Text>
          </Text>

          <Box className="steps-container" mt={4}>
            {result.steps && result.steps.map((step, index) => (
              <Box key={index} className="step" mb={4}>
                <Heading as="h4" size="md">{step.title}</Heading>
                {step.matrix && (
                  <MatrixDisplay matrix={step.matrix} b={step.b} />
                )}
                {step.result && <Text>{step.result}</Text>}
              </Box>
            ))}
          </Box>

          <Box mt={4}>
            {result.x && result.x.map((xi, i) => (
              <Text key={i}>
                x<sub>{i + 1}</sub> = <Text as="b">{formatNumber(xi)}</Text>
              </Text>
            ))}
          </Box>
        </>
      ) : (
        <Text>No result.</Text>
      )}
      <Box mt={4} display="flex" gap={2}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'input' })}>
          Back to input
        </Button>
        <Button onClick={() => handleDownload('txt')}>
          Download .txt
        </Button>
        <Button onClick={() => handleDownload('json')}>
          Download .json
        </Button>
      </Box>
    </Box>
  );
};

export default ResultPage;