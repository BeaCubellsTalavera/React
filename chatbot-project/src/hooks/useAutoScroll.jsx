import { useRef, useEffect } from 'react';

export function useAutoScroll(dependencies) {
  const elementRef = useRef(null); // saves a reference to an html element from the component (we pass null as initial value)
  useEffect(() => {
    const containerElem = elementRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight; // scrolls to the bottom of the container
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies); // to run some code after the component is rendered or updated
  // with empty array as second argument, it runs only after the first render
  // with chatMessages as second argument, it runs after the first render and
  // every time chatMessages changes (this is called a dependency array)

  return elementRef; // we return the reference to be used in the component
}