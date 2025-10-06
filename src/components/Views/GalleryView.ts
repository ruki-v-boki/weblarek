import { Component } from "../base/Component";
import { IGalleryData } from "../../types";


export class GalleryView extends Component<IGalleryData> {
  constructor(container: HTMLElement){
    super(container)
  }

  // -----------------------------------

  set galleryList(items: HTMLElement[]){
    this.container.replaceChildren(...items)
  }
}