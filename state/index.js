let state = null;
let listeners = [];

const createState = (initialState) => {
  state = new Proxy(initialState, {
    set(target, key, newState) {
      if (target[key] === newState) {
        return false;
      }

      target[key] = newState;

      listeners.forEach((component) => component.render());

      return true;
    },
  });

  return state;
};

const subscribe = (newListener) => {
  if (!listeners.includes(newListener)) {
    listeners = [...listeners, newListener];
  }

  return;
};

export { state, createState, subscribe };
