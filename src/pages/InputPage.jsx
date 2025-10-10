import React from 'react';
import { useSlae } from '../context/SlaeContext';
import { Box, Button, FormControl, FormLabel, Input, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import MatrixInput from '../components/MatrixInput';
import Dropzone from '../components/Dropzone';

const InputPage = () => {
  const { state, dispatch } = useSlae();
  const { n, algo, activeTab, A, b } = state;

  const changeN = (value) => {
    const v = Math.max(1, Math.min(9, Number(value) || 1));
    dispatch({ type: 'SET_N', payload: v });
  };

  const updateA = (r, c, val) => {
    const newA = A.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    dispatch({ type: 'SET_A', payload: newA });
  };

  const updateB = (r, val) => {
    const newB = b.map((x, i) => (i === r ? val : x));
    dispatch({ type: 'SET_B', payload: newB });
  };

  const onCompute = () => {
    dispatch({ type: 'COMPUTE' });
  };

  const setActiveTab = (index) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: index === 0 ? 'manual' : 'dnd' });
  };

  const setAlgo = (value) => {
    dispatch({ type: 'SET_ALGO', payload: value });
  };

  const ALGORITHMS = [
    { id: "cramer", label: "Cramer's method" },
    { id: "gauss", label: "Gauss's method" },
    { id: "seidel", label: "Seidel's method" },
    { id: "gauss-jordan", label: "Gauss-Jordan method" },
    { id: "jacobi", label: "Jacobi's method" },
  ];

  return (
    <Box>
      <Box as="section" p={4} borderWidth="1px" borderRadius="lg" mb={4}>
        <FormControl>
          <FormLabel>System Size N (1–9)</FormLabel>
          <Input type="number" min={1} max={9} value={n} onChange={(e) => changeN(e.target.value)} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Solution Algorithm</FormLabel>
          <Select value={algo} onChange={(e) => setAlgo(e.target.value)}>
            {ALGORITHMS.map((alg) => (
              <option key={alg.id} value={alg.id}>
                {alg.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button mt={4} colorScheme="teal" onClick={onCompute}>
          Calculate
        </Button>
      </Box>

      <Tabs index={activeTab === 'manual' ? 0 : 1} onChange={setActiveTab}>
        <TabList>
          <Tab>Manual Input</Tab>
          <Tab>Drag & Drop</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MatrixInput A={A} b={b} updateA={updateA} updateB={updateB} />
          </TabPanel>
          <TabPanel>
            <Dropzone />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default InputPage;