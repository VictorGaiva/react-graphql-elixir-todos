import React from "react";
import axios, { AxiosError } from "axios";
import { Button, Card, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
  content: {
    padding: "4em",
    display: "grid",
    gap: "1em",
  },
});

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const history = useHistory();
  const { container, content } = useStyles();
  const { control, errors, handleSubmit, setError } = useForm<{
    username: string;
    "current-password": string;
  }>();

  function LoginAttempt({
    username,
    ["current-password"]: password,
  }: {
    username: string;
    "current-password": string;
  }) {
    axios
      .post<string>("/api/login", { username, password })
      .then(({ data }) => data && onLogin(data))
      .catch(({ isAxiosError, response }: AxiosError) => {
        if (isAxiosError) {
          switch (response.status) {
            case 404:
              setError("username", { message: "User not found." });
              break;
            case 401:
              setError("current-password", { message: "Invalid password." });
              break;
            default:
              setError("username", { message: "unknown error." });
          }
        }
      });
  }

  return (
    <div className={container}>
      <Card component="form" id="login-form" className={content} onSubmit={handleSubmit(LoginAttempt)}>
        <Controller
          name="username"
          defaultValue=""
          control={control}
          rules={{ minLength: 5, maxLength: 16, required: true }}
          render={(props) => (
            <TextField
              {...props}
              variant="outlined"
              error={!!errors["username"]}
              helperText={errors["username"]?.message}
              label="Username"
            />
          )}
        />
        <Controller
          name="current-password"
          defaultValue=""
          control={control}
          rules={{ maxLength: 16, required: true }}
          render={(props) => (
            <TextField
              {...props}
              variant="outlined"
              type="password"
              error={!!errors["current-password"]}
              helperText={errors["current-password"]?.message}
              label="Password"
            />
          )}
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
        <Button variant="outlined" color="primary" onClick={() => history.push("/sign-up")}>
          Sign-up
        </Button>
      </Card>
    </div>
  );
}
