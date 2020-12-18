defmodule TodoListWeb.Auth.Controller do
  use TodoListWeb, :controller
  alias TodoList.Users.User

  def login(conn, %{"username" => username, "password" => password}) do
    case TodoList.Users.get_user_by_username(username) do
      user = %User{} ->
        case user.password do
          ^password ->
            case TodoListWeb.Auth.Guardian.encode_and_sign(user, %{}, ttl: {1, :day}) do
              {:ok, token, _} ->
                text(conn, token)

              {:error, _} ->
                text(conn, "Error generating user token.")
            end

          _ ->
            conn
            |> put_status(401)
            |> text("Invalid credentials.")
        end

      nil ->
        conn
        |> put_status(404)
        |> text("User not found.")
    end
  end

  def login(conn, _) do
    conn
    |> put_status(400)
    |> text("Missing login params.")
  end

  def sign_up(conn, %{"username" => username, "password" => password}) do
    case TodoList.Users.get_user_by_username(username) do
      %User{} ->
        conn
        |> put_status(409)
        |> text("false")

      nil ->
        case TodoList.Users.create_user(%{username: username, password: password}) do
          {:ok, _} ->
            conn
            |> put_status(201)
            |> text("true")

          {:error, _} ->
            conn
            |> put_status(500)
            |> text("false")
        end
    end
  end

  def sign_up(conn, _) do
    conn
    |> put_status(400)
    |> text("Missing login params.")
  end

  def username_available(conn, %{"username" => username}) do
    case TodoList.Users.get_user_by_username(username) do
      %User{} ->
        conn
        |> text("false")

      nil ->
        conn
        |> text("true")
    end
  end
end
