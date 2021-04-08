defmodule TodoListWeb.UserSocket do
  use Phoenix.Socket

  use Absinthe.Phoenix.Socket, schema: TodoListWeb.Api.Schema

  def connect(params, socket) do
    case Map.get(params, "Authorization") do
      "Bearer " <> token ->
        {:ok,
         Absinthe.Phoenix.Socket.put_options(socket,
           context: TodoListWeb.Auth.Context.context_from_token(token)
         )}

      nil ->
        {:ok, socket}

      _ ->
        {:error}
    end
  end

  def id(_socket), do: nil
end
