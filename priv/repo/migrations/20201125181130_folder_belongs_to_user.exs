defmodule TodoList.Repo.Migrations.FolderBelongsToUser do
  use Ecto.Migration

  def change do
    alter table(:folders) do
      add :user_id, references(:users, on_delete: :delete_all)
    end
  end
end
