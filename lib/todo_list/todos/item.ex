defmodule TodoList.Todos.Item do
  use TodoList.Base.Schema
  import Ecto.Changeset

  schema "items" do
    field :completed_at, :utc_datetime
    field :content, :string
    belongs_to :folder, TodoList.Folders.Folder

    timestamps()
  end

  @doc false
  def changeset(item, attrs) do
    item
    |> cast(attrs, [:content, :completed_at])
    |> validate_required([:content])
  end
end
