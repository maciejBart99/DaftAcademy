import { handleCanvasAnimation } from "../canvasAnimation.js"
import { handleThreeAnimationForward, handleThreeAnimationBackwards } from "../threeAnimation.js"
import { SLIDES_COUNT } from "../utils.js"
import {handleCSSAnimationForwards, handleCSSAnimationBackwards} from "../cssAnimation.js";

const title = document.getElementById('title')

let slideIndex = 0

export const nextSlide = () => {
  if(slideIndex >= SLIDES_COUNT){
    slideIndex = 0
  } else {
    slideIndex++
  }

  title.innerHTML = ''
  const text = document.createTextNode(`slide${slideIndex+1}`)
  title.appendChild(text)

  handleCSSAnimationForwards()
  handleCanvasAnimation(slideIndex)
  handleThreeAnimationForward()
}

export const previousSlide = () => {
  if(slideIndex > 0){
    slideIndex--
  } else {
    slideIndex = SLIDES_COUNT
  }

  title.innerHTML = ''
  const text = document.createTextNode(`slide${slideIndex+1}`)
  title.appendChild(text)

  handleCSSAnimationBackwards()
  handleCanvasAnimation(slideIndex)
  handleThreeAnimationBackwards()
}