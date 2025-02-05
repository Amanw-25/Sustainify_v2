import { useContext, useEffect, createContext, useReducer } from "react";

const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        token: null,
        role: null
      };

    case 'LOGIN_SUCCESS':
      return {
        token: action.payload.token,
        role: action.payload.role
      };

    case 'LOGOUT':
      return {
        token: null,
        role: null
      };

    default:
      return state;
  }
};


export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem('token', state.token);
    localStorage.setItem('role', state.role);
  },[state.token]);
  
  return (
    <AuthContext.Provider value={{token: state.token, role : state.role ,dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
