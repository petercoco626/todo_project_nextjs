import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';

type ActionType = { type: 'toggle' } | { type: 'initialize'; isDarkMode: boolean };
type DarkModeDispatch = Dispatch<ActionType>;

const DarkModeContext = createContext<boolean>(false);
const DarkModeContextDispatch = createContext<DarkModeDispatch | null>(null);

function darkmodeReducer(darkmode: boolean, action: ActionType) {
  switch (action.type) {
    case 'toggle':
      return !darkmode;
    case 'initialize':
      return action.isDarkMode;
  }
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, dispatch] = useReducer(darkmodeReducer, false);

  useEffect(() => {
    /** 현재 localStorage에 dark인지 그리고 웹 자체가 다크모드로 설정되있는지 체크 */
    const isDarkMode =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      dispatch({ type: 'initialize', isDarkMode });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      dispatch({ type: 'initialize', isDarkMode });
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={darkMode}>
      <DarkModeContextDispatch.Provider value={dispatch}>
        {children}
      </DarkModeContextDispatch.Provider>
    </DarkModeContext.Provider>
  );
}

export function useDarkModeState() {
  const darkMode = useContext(DarkModeContext);
  return darkMode;
}

export function useDarkModeDispatch() {
  const dispatch = useContext(DarkModeContextDispatch);
  if (!dispatch) throw new Error('there is no dispatch for darkmode');
  return dispatch;
}
