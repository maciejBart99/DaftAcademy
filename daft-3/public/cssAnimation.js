const frame = document.getElementById('frame')

const appendAnimation = (node, name, callbackFn, mode = 'normal') => {
  node.style.animationName = 'none'
  node.style.animationDirection = mode
  node.offsetWidth
  node.style.animationName = name
  const onAnimationEnd = () => {
    node.removeEventListener("webkitAnimationEnd", onAnimationEnd)
    node.removeEventListener("animationend", onAnimationEnd)
    node.removeEventListener("oanimationend", onAnimationEnd)

    callbackFn && callbackFn()
  }

  node.addEventListener("webkitAnimationEnd", onAnimationEnd);
  node.addEventListener("animationend", onAnimationEnd);
  node.addEventListener("oanimationend", onAnimationEnd);
}

export const handleCSSAnimationForwards = () => {
  appendAnimation(frame, 'frame-exit',
      () => appendAnimation(frame, 'frame-enter'))
}

export const handleCSSAnimationBackwards= () => {
  appendAnimation(frame, 'frame-enter',
      () => appendAnimation(frame, 'frame-exit', null, 'reverse'), 'reverse')
}