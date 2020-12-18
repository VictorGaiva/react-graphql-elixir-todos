defmodule TodoListWeb.Auth.Guardian do
  use Guardian, otp_app: :todo_list

  def subject_for_token(resource, _claims) do
    sub = to_string(resource.id)
    {:ok, sub}
  end

  # def subject_for_token(_, _) do
  #   {:error, :reason_for_error}
  # end

  def resource_from_claims(claims) do
    id = claims["sub"]
    resource = TodoList.Users.get_user!(id)
    {:ok, resource}
  end

  # def resource_from_claims(_claims) do
  #   {:error, :reason_for_error}
  # end
end
