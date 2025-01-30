import { useContext, useEffect, createContext, useReducer } from "react";

const initialState = {
  token: localStorage.getItem("token") || null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        token: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        token: action.payload.token,
      };

    case 'LOGOUT':
      return {
        token: null,
      };

    default:
      return state;
  }
};


export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem('token', state.token);
  },[state.token]);
  
  return (
    <AuthContext.Provider value={{token: state.token, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
