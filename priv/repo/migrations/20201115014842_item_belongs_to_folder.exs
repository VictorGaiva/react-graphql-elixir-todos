defmodule TodoList.Repo.Migrations.ItemBelongsToFolder do
  use Ecto.Migration

  def change do
    alter table(:items) do
      add :folder_id, references(:folders, on_delete: :delete_all)
    end
  end
end
