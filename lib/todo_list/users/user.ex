defmodule TodoList.Users.User do
  use TodoList.Base.Schema
  import Ecto.Changeset

  schema "users" do
    field :password, :string
    field :username, :string
    has_many :folders, TodoList.Folders.Folder

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :password])
    |> validate_required([:username, :password])
  end
end
