# useDraggableList

`useDraggableList` is a custom React hook that enables drag-and-drop functionality for lists.

## Features

- Easy to integrate
- Lightweight
- Customizable

## To run example project

1. Install dependencies.
```bash
npm install
```
or 

```bash
yarn install
```
2. Run 

```bash
yarn run dev
```

## Usage

```jsx
import React from 'react';
import useDraggableList from './useDraggableList/useDraggableList';;

const MyComponent = () => {
    const { items, handleDragStart, handleDragOver, handleDrop } = useDraggableList(initialItems);

    return (
        <ul>
            {items.map((item, index) => (
                <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                >
                    {item.content}
                </li>
            ))}
        </ul>
    );
};
```

## API

### `useDraggableList(initialItems)`

- `initialItems` (Array): The initial list of items.

#### Returns

- `listRef` (Object): A ref object to be attached to the list container.
- `listAttributes` (Object): Attributes to be spread onto the list container.
- `items` (Array): The current list of items, updated after drag-and-drop operations.
- `listRootClassNames` (String): Class names to be applied to the list container.
- `getListEventHandlers` (Function): A function that returns event handlers for the list container.
- `getItemButtonEventHandlers` (Function): A function that returns event handlers for the draggable items.


## License

This project is licensed under the MIT License.