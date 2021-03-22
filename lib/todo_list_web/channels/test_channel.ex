defmodule TodoListWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby1", _message, socket) do
    {:ok, socket}
  end

  def join("room:lobby2", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("ping", _message, socket) do
    {:reply, {:pong, %{test: ""}}, socket}
  end
end
