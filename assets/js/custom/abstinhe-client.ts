import { FetchResult, Operation } from "@apollo/client";
import { PhoenixChannel, PhoenixSocket, isBroadcastMessage, MessageFromSocket } from "./phoenix-channels";
import { Observable } from "rxjs";
import { v4 as uuid } from "uuid";
import { filter, map } from "rxjs/operators";
import { print } from 'graphql';

export class AbsintheSubscriptionClient<T extends FetchResult = FetchResult> {
  private operations: {
    [key: string]: {
      operation: Operation;
      subscriptionId: string;
    }
  }
  private socket: PhoenixSocket<{ result: T & { subscriptionId: string; } }>;
  private channel: PhoenixChannel<{ result: T & { subscriptionId: string; } }>;

  constructor(url: string) {
    this.socket = new PhoenixSocket({ url });
    this.channel = new PhoenixChannel("__absinthe__:control", this.socket);
    this.channel.join();
    this.operations = {};
  }

  subscribe(operation: Operation): Observable<FetchResult> {
    const id = uuid();

    const subscription = new Observable<MessageFromSocket<{ result: T & { subscriptionId: string; } }>>(
      subscriber => this.socket.subscribe(subscriber)
    ).pipe(
      filter(isBroadcastMessage),
      filter(({ event }) => event === "subscription:data"),
      filter(({ topic }) => topic === this.operations[id].subscriptionId),
      map(({ payload: { result } }) => result),
    )

    this.operations[id] = { operation, subscriptionId: "" }

    this.channel.run("doc", { query: print(operation.query), variables: operation.variables }).then(
      //@ts-ignore
      ({ payload }) => this.operations[id].subscriptionId = payload.response.subscriptionId
    )

    return new Observable<T>(subscriber => {
      subscription.subscribe(subscriber);

      return () => {
        this.channel.next("unsubscribe", { subscriptionId: `${this.operations[id].subscriptionId}` })
        delete this.operations[id];
      }
    });
  }


}