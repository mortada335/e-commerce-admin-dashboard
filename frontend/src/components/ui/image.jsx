import {useImage} from 'react-image'

function Image({url,...props}) {
  const {src} = useImage({
    srcList: url,
  })

  return <img src={src} {...props} />
}

export default Image