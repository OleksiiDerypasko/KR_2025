import React, { createContext, useReducer, useContext } from 'react';
import { solveGauss } from "../algorithms/gauss";
import { solveCramer } from "../algorithms/cramer";
import { solveGaussJordan } from "../algorithms/gaussJordan";
import { solveSeidel } from "../algorithms/seidel";
import { solveJacobi } from "../algorithms/jacobi";
import { makeSquare, makeVector, toNumericMatrix, toNumericVector } from '../utils/matrixUtils';

const SlaeContext = createContext();

const initialState = {
  n: 3,
  A: makeSquare(3),
  b: makeVector(3),
  algo: 'gauss',
  result: null,
  screen: 'input',
  language: 'uk',
  activeTab: 'manual',
};

const ALGORITHMS = [
  { id: "cramer", label: "Метод Крамера", solver: solveCramer },
  { id: "gauss", label: "Метод Гауса", solver: solveGauss },
  { id: "seidel", label: "Метод Зейделя", solver: solveSeidel },
  { id: "gauss-jordan", label: "Метод Гауса-Жордана", solver: solveGaussJordan },
  { id: "jacobi", label: "Метод Якобі", solver: solveJacobi },
];

function slaeReducer(state, action) {
  switch (action.type) {
    case 'SET_N':
      return {
        ...state,
        n: action.payload,
        A: makeSquare(action.payload, state.A),
        b: makeVector(action.payload, state.b),
      };
    case 'SET_A':
      return { ...state, A: action.payload };
    case 'SET_B':
      return { ...state, b: action.payload };
    case 'SET_ALGO':
      return { ...state, algo: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'COMPUTE':
      try {
        const { A, b, n, algo } = state;
        const Anum = toNumericMatrix(A);
        const bnum = toNumericVector(b);

        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (!Number.isFinite(Anum[i][j])) throw new Error(`Invalid value a${i + 1}${j + 1}`);
          }
          if (!Number.isFinite(bnum[i])) throw new Error(`Invalid value b${i + 1}`);
        }

        const selectedAlgorithm = ALGORITHMS.find(a => a.id === algo);
        if (!selectedAlgorithm) {
            throw new Error("Selected algorithm not found.");
        }

        const { solution, steps, error: algoError } = selectedAlgorithm.solver(Anum, bnum);

        if (algoError) {
            throw new Error(algoError);
        }

        return { ...state, result: { x: solution, algorithm: algo, n, steps }, screen: 'result' };
      } catch (e) {
        // In a real app, you'd want to handle this more gracefully
        // (e.g., dispatching an error action, showing a toast)
        console.error(e);
        return state;
      }
    default:
      return state;
  }
}

export function SlaeProvider({ children }) {
  const [state, dispatch] = useReducer(slaeReducer, initialState);

  return (
    <SlaeContext.Provider value={{ state, dispatch }}>
      {children}
    </SlaeContext.Provider>
  );
}

export function useSlae() {
  const context = useContext(SlaeContext);
  if (context === undefined) {
    throw new Error('useSlae must be used within a SlaeProvider');
  }
  return context;
}