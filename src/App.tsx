import './App.css'
import './useDraggableList/useDraggableList.css'
import useDraggableList from './useDraggableList/useDraggableList';

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
];

function App() {
  const {
    listRef,
    listAttributes,
    items,
    listRootClassNames,
    getListEventHandlers,
    getItemButtonEventHandlers,
  } = useDraggableList<string>(fruits);

  return (
    <div className={listRootClassNames}>
      <ul ref={listRef as React.RefObject<HTMLUListElement>} {...getListEventHandlers()} {...listAttributes}>
        {items.map(item => (
          <li key={item.id} 
            className={item.itemWrapperClassNames.join()}
            {...item.itemWrapperAttributes}
          >
            <button
              className={item.itemButtonClassNames.join()}
              {...item.itemButtonAttributes}
              {...getItemButtonEventHandlers(item)}
              >
              {item.content}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
