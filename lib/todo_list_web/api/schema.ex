defmodule TodoListWeb.Api.Schema do
  use Absinthe.Schema

  alias TodoList.Todos
  alias TodoList.Folders

  object :todo_item do
    field :id, non_null(:id)
    field :content, non_null(:string)

    field :is_completed, non_null(:boolean) do
      resolve(fn %{completed_at: completed_at}, _, _ ->
        {:ok, !is_nil(completed_at)}
      end)
    end
  end

  object :folder do
    field :id, non_null(:id)
    field :name, non_null(:string)

    field :items, list_of(non_null(:todo_item)) do
      resolve(fn folder, _, _ ->
        {:ok, Todos.list_items_from_folder(folder)}
      end)
    end
  end

  object :user do
    field :id, non_null(:id)
    field :username, non_null(:string)

    field :folders, list_of(non_null(:folder)) do
      resolve(fn user, _, _ ->
        {:ok, Folders.list_folders_from_user(user)}
      end)
    end
  end

  mutation do
    # Items
    field :create_todo_item, non_null(:todo_item) do
      arg(:content, non_null(:string))
      arg(:folder_id, non_null(:id))

      resolve(fn %{content: content, folder_id: folder_id}, _ ->
        Folders.get_folder!(folder_id)
        |> Todos.create_item(%{content: content, folder_id: folder_id})
      end)
    end

    field :update_todo_item, :todo_item do
      arg(:id, non_null(:id))
      arg(:content, non_null(:string))

      resolve(fn %{id: id, content: content}, _ ->
        Todos.get_item!(id)
        |> Todos.update_item(%{content: content})
      end)
    end

    field :toggle_todo_item, :todo_item do
      arg(:id, non_null(:id))

      resolve(fn %{id: item_id}, _ ->
        Todos.toggle_by_id(item_id)
      end)
    end

    field :delete_todo_item, :boolean do
      arg(:id, non_null(:id))

      resolve(fn %{id: id}, _ ->
        case Todos.get_item!(id) |> Todos.delete_item() do
          {:ok, _} -> {:ok, true}
          {:error, _} -> {:ok, false}
        end
      end)
    end

    # Folders
    field :create_folder, non_null(:folder) do
      arg(:name, non_null(:string))

      resolve(fn %{name: name}, %{context: %{current_user: current_user}} ->
        with {:ok, folder} <- Folders.create_folder(current_user, %{name: name}) do
          {:ok, folder}
        end
      end)

      resolve(fn _, _ ->
        {:error, "Missing credentials."}
      end)
    end

    field :update_folder, non_null(:folder) do
      arg(:id, non_null(:id))
      arg(:name, non_null(:string))

      resolve(fn %{id: id, name: name}, _ ->
        Folders.get_folder!(id)
        |> Folders.update_folder(%{name: name})
      end)
    end

    field :delete_folder, non_null(:boolean) do
      arg(:id, non_null(:id))

      resolve(fn %{id: folder_id}, _ ->
        Folders.get_folder!(folder_id)
        |> Folders.delete_folder()

        {:ok, true}
      end)
    end
  end

  query do
    field :self, non_null(:user) do
      resolve(fn _, %{context: %{current_user: current_user}} ->
        {:ok, current_user}
      end)

      resolve(fn _, _ ->
        {:error, "Missing credentials"}
      end)
    end
  end
end
