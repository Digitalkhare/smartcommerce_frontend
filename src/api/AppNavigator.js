// AppNavigator.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "./navigation";

const AppNavigator = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
};

export default AppNavigator;
