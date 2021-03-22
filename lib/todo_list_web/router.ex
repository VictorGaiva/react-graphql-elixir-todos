defmodule TodoListWeb.Router do
  use TodoListWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    # plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug TodoListWeb.Auth.Context
  end

  # Other scopes may use custom stacks.
  scope "/api" do
    pipe_through :api

    get "/", Absinthe.Plug.GraphiQL,
      schema: TodoListWeb.Api.Schema,
      socket: TodoListWeb.UserSocket

    post "/", Absinthe.Plug, schema: TodoListWeb.Api.Schema

    post "/login", TodoListWeb.Auth.Controller, :login
    post "/sign-up", TodoListWeb.Auth.Controller, :sign_up
    post "/username-availability", TodoListWeb.Auth.Controller, :username_available
  end

  scope "/", TodoListWeb do
    pipe_through :browser
    get "/*path", PageController, :index
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  # if Mix.env() in [:dev, :test] do
  #   import Phoenix.LiveDashboard.Router

  #   scope "/" do
  #     pipe_through :browser
  #     live_dashboard "/dashboard", metrics: TodoListWeb.Telemetry
  #   end

  #   IO.puts(Absinthe.Schema.to_sdl(TodoListWeb.Api.Schema))
  # end
end
