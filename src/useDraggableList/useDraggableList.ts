import { useState, useCallback, useRef } from "react";

interface IUseDraggableList<T> {
  items: Item<T>[];

  listRef: React.RefObject<HTMLElement | null>;
  draggedItem: Item<T> | null;
  listRootClassNames: string;
  isDragging: boolean;
  listAttributes: {
    [key: string]: string | number;
  };
  getListEventHandlers: () => {
    onKeyDown: React.KeyboardEventHandler<
      HTMLElement | HTMLUListElement | HTMLOListElement
    >;
  };
  getItemButtonEventHandlers: (item: Item<T>) => {
    onDragStart: () => void;
    onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void;
  };
}

function useDraggableList<T>(initialItems: T[]): IUseDraggableList<T> {
  const listRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<Item<T>[]>(initializeItems(initialItems));
  const [draggedItem, setDraggedItem] = useState<Item<T> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const listRootClassNames = new Set();
  listRootClassNames.add("draggable-list");

  const swapItems = useCallback(
    (source: Item<T>, target: Item<T>) => {
      const updatedItems = [...items];
      const sourceIndex = updatedItems.findIndex(
        (item) => item.id === source.id
      );
      const targetIndex = updatedItems.findIndex(
        (item) => item.id === target.id
      );

      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        setItems(updatedItems); 
        return;
      }

      [updatedItems[sourceIndex], updatedItems[targetIndex]] = [
        updatedItems[targetIndex],
        updatedItems[sourceIndex],
      ];

      setItems(updatedItems); 
    },
    [items]
  );

  const handleDragStart = useCallback((item: Item<T>) => {
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLButtonElement>, item: Item<T>) => {
      event.preventDefault();
      if (!draggedItem || draggedItem === item) return;

      swapItems(draggedItem, item);
      setDraggedItem(null);
      setIsDragging(false);
    },
    [draggedItem, swapItems]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const getDraggedItemIndex = useCallback(() => {
    if (!draggedItem) return -1;

    return items.findIndex((item) => item.id === draggedItem.id);
  }, [draggedItem, items]);

  const setKeyboardDraggedItem = useCallback(() => {
    const activeElement = document.activeElement as HTMLButtonElement;
    // check if activeElement is inside the listRef
    if (!listRef.current?.contains(activeElement)) return;
    // get index of the activeElement
    const index = items.findIndex(
      (item) => item.content === activeElement.dataset.id
    );
    if (index < 0) return;
    setDraggedItem(items[index]);
    setIsDragging(true);
  }, [items]);

  const moveFocus = useCallback(
    (direction: number) => {
      const activeElement = document.activeElement as HTMLButtonElement;
      if (!activeElement) return;
      const index = items.findIndex(
        (item) => item.content === activeElement.dataset.id
      );

      if (index < 0) return;

      let nextIndex = index + direction;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= items.length) nextIndex = items.length - 1;

      const nextElement = listRef.current?.querySelector(
        `[data-id="${items[nextIndex].content}"]`
      ) as HTMLButtonElement;
      if (!nextElement) return;
      nextElement.focus();
    },
    [items]
  );

  const setArrowAction = useCallback((direction: number) => {
    const draggedIndex = getDraggedItemIndex();

    if (!isDragging) {
      moveFocus(direction);
    } else {
      swapItems(draggedItem!, items[draggedIndex + direction]);
    }
  }, [draggedItem, getDraggedItemIndex, isDragging, items, moveFocus, swapItems]);

  const handleKeyboard = useCallback(
    (
      event: React.KeyboardEvent<
        HTMLElement | HTMLUListElement | HTMLOListElement
      >
    ) => {

      switch (event.key) {
        case "ArrowUp":
          setArrowAction(-1);
          break;
        case "ArrowDown":
          setArrowAction(1);
          break;
        case "Escape":
          if (!isDragging) return;
          setDraggedItem(null);
          setIsDragging(false);
          break;
        case "Tab":
          if(isDragging) {
            setDraggedItem(null);
            setIsDragging(false);
          }
          break;
        case "Enter":
        case " ":
          if (!isDragging) {
            setKeyboardDraggedItem();
          } else {
            setDraggedItem(null);
            setIsDragging(false);
          }
          break;
        default:
          break;
      }
    },
    [isDragging, setArrowAction, setKeyboardDraggedItem]
  );

  function getListEventHandlers() {
    return {
      onKeyDown: handleKeyboard,
    };
  }

  function getItemButtonEventHandlers(item: Item<T>) {
    return {
      onDragStart: () => handleDragStart(item),
      onDrop: (event: React.DragEvent<HTMLButtonElement>) =>
        handleDrop(event, item),
      onDragOver: (event: React.DragEvent<HTMLButtonElement>) =>
        handleDragOver(event),
    };
  }

  if (isDragging) {
    listRootClassNames.add("is-dragging");
  } else {
    listRootClassNames.delete("is-dragging");
  }

  return {
    listRef,
    listAttributes: {
      tabIndex: -1,
    },
    isDragging,

    draggedItem,
    items,
    listRootClassNames: Array.from(listRootClassNames).join(" "),

    getListEventHandlers,
    getItemButtonEventHandlers,
  };
}

export default useDraggableList;

export type Item<T> = {
  id: string;
  content: T;
  itemWrapperClassNames: string[];
  itemWrapperAttributes: {
    [key: string]: string;
  };
  itemButtonClassNames: string[];
  itemButtonAttributes: {
    [key: string]: string | T;
  };
};

function initializeItems<T>(items: T[]): Item<T>[] {
  const buildId = (item: T) => `item-${item}`;
  return items.map((item: T) => ({
    id: buildId(item),
    content: item,
    itemWrapperClassNames: ["draggable-item"],
    itemWrapperAttributes: {},
    itemButtonClassNames: ["draggable-item-button"],
    itemButtonAttributes: {
      "aria-label": `Drag ${item}`,
      draggable: "true",
      "data-id": item,
    },
  }));
}
