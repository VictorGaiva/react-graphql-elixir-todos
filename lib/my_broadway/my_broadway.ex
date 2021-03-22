defmodule MyBroadway do
  use Broadway

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayKafka.Producer,
           [
             hosts: [localhost: 9092],
             group_id: "test-consumer-group",
             topics: ["test"]
           ]},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 1
        ]
      ]
    )
  end

  @impl true
  def handle_message(_, message, _) do
    IO.inspect(message.data, label: "Got message")
    message
  end

  @impl true
  def handle_failed(messages, _context) do
    IO.inspect(messages, label: "Got message")
    messages
  end
end
