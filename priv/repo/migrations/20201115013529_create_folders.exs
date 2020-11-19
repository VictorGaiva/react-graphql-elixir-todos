defmodule TodoList.Repo.Migrations.CreateFolders do
  use Ecto.Migration

  def change do
    create table(:folders) do
      add :name, :string

      timestamps()
    end

  end
end
