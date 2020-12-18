defmodule TodoList.Folders.Folder do
  use TodoList.Base.Schema
  import Ecto.Changeset

  schema "folders" do
    field :name, :string
    has_many :items, TodoList.Todos.Item
    belongs_to :user, TodoList.Users.User

    timestamps()
  end

  @doc false
  def changeset(folder, attrs) do
    folder
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
