import { useBooks } from '../contexts/BookContext'
import PoemGallery from './PoemGallery'

const Poems: React.FC = () => {
  const { poems, addPoem, updatePoem, deletePoem } = useBooks()

  return (
    <div>
      <PoemGallery
        poems={poems}
        onAddPoem={addPoem}
        onEditPoem={updatePoem}
        onDeletePoem={deletePoem}
      />
    </div>
  )
}

export default Poems
