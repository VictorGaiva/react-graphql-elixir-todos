import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button, Card, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useForm, Controller, ValidateResult } from "react-hook-form";
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

export default function SignupPage({ onLogin }: { onLogin: (token: string) => void }) {
  const history = useHistory();
  const { container, content } = useStyles();

  const { control, errors, handleSubmit, setError, clearErrors } = useForm<{
    username: string;
    "new-password": string;
    "conf-password": string;
  }>({ mode: "onBlur" });

  async function SignupAttempt({ username, "new-password": password }: { username: string; "new-password": string }) {
    try {
      const { status } = await axios.post("/api/sign-up", { username, password });
      if (status === 201) {
        const { data, status } = await axios.post<string>("/api/login", { username, password });
        if (status === 200) onLogin(data);
      }
    } catch (err) {}
  }

  async function ValidateUsername(username: string): Promise<ValidateResult> {
    if (username.length < 5) return "Min length: 5";
    if (username.length > 16) return "Max length: 16";
    try {
      const result = await axios.post<boolean>("/api/username-availability", {
        username,
      });

      if (result.status === 200) {
        if (result.data) {
          return;
        } else {
          return "Username taken";
        }
      }
    } catch (err) {
      return "Error while checking username availability";
    }
  }

  function ValidatePassword(password: string): ValidateResult {
    if (password.length < 5) return "Min length: 5";
    if (password.length > 16) return "Max length: 16";
    if (control.getValues("conf-password") !== password) return "Passwords don't match.";

    return;
  }

  function ValidatePasswordConf(password: string): ValidateResult {
    if (password.length < 5) return "Min length: 5";
    if (password.length > 16) return "Max length: 16";
    // Make sure the password not matching error shows only on the first password field
    if (control.getValues("new-password") !== password) setError("new-password", { message: "Passwords don't match." });
    else clearErrors("new-password");
    return;
  }

  return (
    <div className={container}>
      <Card component="form" id="login-form" className={content} onSubmit={handleSubmit(SignupAttempt)}>
        <Controller
          name="username"
          defaultValue=""
          control={control}
          rules={{ validate: ValidateUsername }}
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
          name="new-password"
          defaultValue=""
          control={control}
          rules={{ validate: ValidatePassword }}
          render={(props) => (
            <TextField
              {...props}
              variant="outlined"
              type="password"
              error={!!errors["new-password"]}
              helperText={errors["new-password"]?.message}
              label="New password"
            />
          )}
        />
        <Controller
          name="conf-password"
          defaultValue=""
          control={control}
          rules={{ validate: ValidatePasswordConf }}
          render={(props) => (
            <TextField
              {...props}
              variant="outlined"
              error={!!errors["conf-password"]}
              helperText={errors["conf-password"]?.message}
              type="password"
              label="Password confirmation"
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={control.formStateRef.current.isDirty || !control.formStateRef.current.isValid}
        >
          Sign-up
        </Button>
        <Button variant="outlined" color="primary" onClick={() => history.push("/login")}>
          Login
        </Button>
      </Card>
    </div>
  );
}
