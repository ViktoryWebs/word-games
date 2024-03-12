import PropTypes from 'prop-types'

const Tile = ({letter}) => {
  return (
    <span className="w-12 h-12 block border border-gray-500">
      {letter}
    </span>
  )
}

Tile.propTypes = {
  letter: PropTypes.string,
}

export default Tile