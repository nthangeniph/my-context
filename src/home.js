import "./App.css";
import "antd/dist/antd.css";
import "antd/dist/antd.less";
import {  useMain } from "../src/provider/user";
import { useEffect } from "react";
import { Button } from "antd";

function Home() {

  const { loginOutUser, firstName, surname, isLogin } = useMain();

 

  useEffect(() => {
    if (!isLogin) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [isLogin]);


  console.log("Home ::",isLogin)
  return (
    <div className="home-container">
      <h1>
        Welcome to Boxfusion {firstName} {surname}
      </h1>

      <Button onClick={() => loginOutUser({isLogin: false})}>Log Out</Button>
    </div>
  );
}

export default Home;
