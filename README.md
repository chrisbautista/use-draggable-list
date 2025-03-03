# useDraggableList

`useDraggableList` is a custom React hook that enables drag-and-drop functionality for lists.

## Features

- Easy to integrate
- Lightweight
- Customizable

## Installation

```bash
npm install
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

- `items` (Array): The current list of items.
- `handleDragStart` (Function): Function to handle the drag start event.
- `handleDragOver` (Function): Function to handle the drag over event.
- `handleDrop` (Function): Function to handle the drop event.

## License

This project is licensed under the MIT License.