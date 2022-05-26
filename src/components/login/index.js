import "antd/dist/antd.css";
import "antd/dist/antd.less";
import { Form, Input, Button } from "antd";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState } from "react";
import {useLoginActions} from "../../provider/user"

import "./login.css";

function Login() {
  const [userInfo, setUserInfo] = useState({});
  const {loginUser}=useLoginActions();

  const { surname, firstName } = userInfo;

  const onLogin = () => {
    loginUser({surname, firstName,isLogin:true })
  }
  

  return (
    <div className="login-form-container">
      <Form className="login-form">
        <h1 style={{ marginLeft: "25%" }}>User Login Form</h1>
        <Form.Item label="First Name">
          <Input
            onChange={({ target: { value } }) =>
              setUserInfo({ ...userInfo, firstName: value })
            }
            style={{ width: "330px" }}
            placeholder="enter your first name"
          />
        </Form.Item>
        <Form.Item label="Surname">
          <Input
            onChange={({ target: { value } }) =>
              setUserInfo({ ...userInfo, surname: value })
            }
            style={{ width: "330px", marginLeft: "10px" }}
            placeholder="enter your surname"
          />
        </Form.Item>
        <Link to="/home">
          <Button
            style={{ marginLeft: "40%", backgroundColor: "aqua" }}
            disabled={!(firstName && surname)}
            onClick={onLogin}
          >
            Login
          </Button>
        </Link>
      </Form>
    </div>
  );
}

export default Login;
