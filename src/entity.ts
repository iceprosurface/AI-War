import { GameMain } from "./index";
import { AbstractComponent } from "./mixins";
import { Point, IPoint } from "./point";

export class Entity {
  public id: number = 0;
  public type: string;
  public position: IPoint = new Point(0, 0);
  private components: AbstractComponent[] = [];
  private componentsMap: { [key: string]: number } = {};
  public willDestroy: boolean = false;
  constructor(
    id: number,
    addon: {
      position: IPoint;
      type: string;
    },
    Settings: {
      [key: string]: any;
    }
  ) {
    this.type = addon.type;
    this.id = id;
    this.position = new Point(addon.position);
    for (let key in Settings) {
      let setting = Settings[key];
      if (!AbstractComponent.hasClass(key)) {
        continue;
      }
      let component = new AbstractComponent(key, setting);
      component.reflectParent = () => {
        return this;
      };
      this.componentsMap[key] = this.components.push(component) - 1;
    }
  }
  component(name: string) {
    return this.components[this.componentsMap[name]];
  }
  onTickStart() {
    this.components.forEach((component: AbstractComponent) => {
      component.onTickStart();
    });
  }

  onTickEnd() {
    this.components.forEach((component: AbstractComponent) => {
      component.onTickEnd();
    });
  }

  onTick() {
    this.components.forEach((component: AbstractComponent) => {
      component.onTick();
    });
  }

  public reflectParent(): null | GameMain {
    return null;
  }
}
