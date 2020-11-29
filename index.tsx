const React = {
  createElement: (tag, props, ...children) => {
    console.log({ tag, props, children });
    if (typeof tag === "function") {
      return tag({ ...props, children });
    }
    return { tag, props: { ...props, children } };
  },
  render: (root, component) => {
    console.log("render", component);
    const elm = document.createElement(component.tag);

    component.props.children.map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        elm.innerHTML += child;
        return;
      }
      React.render(elm, child);
    });
    root.appendChild(elm);
  },
};

const App = () => {
  return (
    <div>
      <h1>Super title {2}</h1>
      <p>test</p>
    </div>
  );
};

React.render(document.getElementById("root"), <App />);
