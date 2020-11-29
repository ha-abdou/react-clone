// is small code but not clean
const React = {
  root: null,
  component: null,
  mounted: false,
  _states: [],
  _stateI: 0,
  _effects: [],
  _effectsI: 0,
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") return tag({ ...props, children });
    return { tag, props: { ...props, children } };
  },
  render: (root, component) => {
    React.root = root;
    React.component = component;
    React._render();
    if (!React.mounted) {
      React._effects.map(({ effect }, i) => {
        const clearEffect = effect();
        if (typeof clearEffect === "function")
          React._effects[i].clearEffect = clearEffect;
      });
      React.mounted = true;
    }
  },
  rerender: () => {
    React._stateI = React._effectsI = 0;
    React.root.innerHTML = "";
    React.render(React.root, <App />);
  },
  _render: (root = React.root, component = React.component) => {
    const elm = document.createElement(component.tag);
    Object.keys(component.props).map((prop) => {
      if (prop === "className")
        return elm.setAttribute("class", component.props[prop]);
      else if (prop.startsWith("on"))
        return (elm[prop.toLocaleLowerCase()] = component.props[prop]);
      elm.setAttribute(prop, component.props[prop]);
    });
    component.props.children.map((child) => {
      if (typeof child === "string" || typeof child === "number")
        return (elm.innerHTML += child);
      React._render(elm, child);
    });
    root.appendChild(elm);
  },
  useSate: (initState) => {
    let i = React._stateI;
    React._stateI++;
    if (!React._states[i]) {
      React._states[i] = initState;
    }
    const setState = (newState) => {
      React._states[i] = newState;
      React.rerender();
    };
    return [React._states[i], setState];
  },
  useEffect: (effect, deps) => {
    let i = React._effectsI++;
    if (!React._effects[i])
      return (React._effects[i] = { effect, deps, clearEffect: null });
    if (!React._effects[i].clearEffect || Object.is([], React._effects[i].deps))
      return;
    if (Array.isArray(React._effects[i].deps)) {
      let depsChange = false;
      const oldDeps = React._effects[i].deps;
      deps.find((dep, i) => {
        if (!Object.is(dep, oldDeps[i])) {
          depsChange = true;
          return true;
        }
      });
      if (!depsChange) return;
    }
    React._effects[i].clearEffect();
    React._effects[i].clearEffect = null;
    React._effects[i].deps = deps;
    const clearEffect = effect();
    if (typeof clearEffect === "function") {
      React._effects[i].clearEffect = clearEffect;
    }
  },
};

const App = () => {
  const [count, setCount] = React.useSate(0);
  const [count1, setCount1] = React.useSate(0);
  React.useEffect(() => {
    console.log("in ->", count1);
    return () => console.log("out ->", count1);
  }, [count1]);
  React.useEffect(() => {
    console.log("count in ->", count);
    return () => console.log("count out ->", count);
  }, [count]);
  return (
    <div>
      <h1>Count {count}</h1>
      <h1>Count1 {count1}</h1>
      <button onClick={() => setCount(count + 1)}>counter</button>
      <button onClick={() => setCount1(count1 + 1)}>counter1</button>
    </div>
  );
};

React.render(document.getElementById("root"), <App />);
