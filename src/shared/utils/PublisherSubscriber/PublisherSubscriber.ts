type TListener<TData = unknown> = (data?: TData) => void;

export class PublisherSubscriber<TData = unknown> {
  private listeners: TListener<TData>[] = [];

  notify = (data?: TData) => {
    this.listeners.forEach(listener => {
      listener(data);
    });
  };

  subscribe = (fn: TListener<TData>) => {
    this.listeners.push(fn);

    return () => {
      this.unsubscribe(fn);
    };
  };

  unsubscribe = (fn: TListener<TData>) => {
    this.listeners = this.listeners.filter(item => item !== fn);
  };
}
