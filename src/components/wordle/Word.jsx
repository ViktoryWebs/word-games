import PropTypes from 'prop-types'

import Tile from './Tile';

const Word = ({solution}) => {

  return (
    <div className="flex gap-1">
      {
        solution.map((letter, index) => {
          return <Tile key={index} letter={letter} />
        })
      }
    </div>
  )
}

Word.propTypes = {
  solution: PropTypes.array,
}

export default Word