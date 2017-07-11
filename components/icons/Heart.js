/**
 * Heart
 * Created by Iconic (Okan Benn)
 * From the Noun Project
 * https://thenounproject.com/term/heart/130259
 */

export default function Heart(props) {
  const ownProps = Object.assign({}, props)
  ownProps.className = (props.className || '') + ' icon heart'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1205 1440" fillRule="evenodd" clipRule="evenodd" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" { ...ownProps } >
      <path d="M602 216C677 72 753 0 903 0c166 0 301 129 301 288 0 288-301 576-602 864C301 864 0 576 0 288 0 129 135 0 301 0c151 0 226 72 301 216z"/>
    </svg>
  )
}
