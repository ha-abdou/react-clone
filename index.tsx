const React = {
  createElement: (tag, props, ...children) => {
    // console.log({ tag, props, children });
    if (typeof tag === "function") {
      return tag({ ...props, children });
    }
    return { tag, props: { ...props, children } };
  },
  root: null,
  component: null,
  render: (root, component) => {
    React.root = root;
    React.component = component;
    React._render();
  },
  rerender: () => {
    React.root.innerHTML = "";
    React.render(React.root, <App />);
  },
  _render: (root = React.root, component = React.component) => {
    // console.log("render", component);
    const elm = document.createElement(component.tag);

    // bind setAttributes
    Object.keys(component.props).map((prop) => {
      if (prop === "className") {
        elm.setAttribute("class", component.props[prop]);
        return;
      } else if (prop.startsWith("on")) {
        elm[prop.toLocaleLowerCase()] = component.props[prop];
        return;
      }
      elm.setAttribute(prop, component.props[prop]);
    });
    // render childs
    component.props.children.map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        elm.innerHTML += child;
        return;
      }
      React._render(elm, child);
    });
    root.appendChild(elm);
  },
  _states: [],
  _stateI: 0,
  useSate: (initState) => {
    // console.log("call", React._states);
    let i = React._stateI;
    if (!React._states[i]) {
      React._states[i] = initState;
    }
    const curentState = React._states[i];
    const setState = (newState) => {
      React._states[i] = newState;
      React.rerender();
      // console.log("states", React._states);
      // render
    };
    // console.log("return", React._states);
    return [curentState, setState];
  },
};

const App = () => {
  const [count, setCount] = React.useSate(0);
  // console.log("app", count);

  return (
    <div>
      <h1>Count {count}</h1>
      <button
        onClick={() => {
          // console.log("ad");
          setCount(count + 1);
        }}
      >
        add one
      </button>
    </div>
  );
};

React.render(document.getElementById("root"), <App />);
