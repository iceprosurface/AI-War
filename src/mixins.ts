import { Point } from "./point";
import { Entity } from "./entity";

let store: {
  [key: string]: any;
} = {};

export class AbstractComponent {
  constructor(key: string | any, setting?: any) {
    if (!setting) {
      return;
    }
    if (typeof key === "string") {
      let instance = new store[key](setting);
      if (!instance.onTickStart) {
        instance.onTickStart = this.onTickStart;
      }
      if (!instance.onTickEnd) {
        instance.onTickEnd = this.onTickEnd;
      }
      if (!instance.onTick) {
        instance.onTick = this.onTick;
      }
      return instance;
    }
    throw new Error("1");
  }

  public static hasClass(key: string) {
    return store[key];
  }

  public onTickStart() {}

  public onTickEnd() {}

  public onTick() {}

  public reflectParent(): null | Entity {
    return null;
  }
}

class Unmovable extends AbstractComponent {
  public unmovable: boolean = true;

  public move() {
    if (this.unmovable) {
      console.log("this can`t move");
    }
    return false;
  }
}

class HP extends AbstractComponent {
  hp: number = 0;

  damage(damage: number) {
    this.hp -= damage;
  }
}

interface ICraftItemMap {
  [name: string]: {
    craftTime: number;
    [key: string]: any;
  };
}

export class Building extends AbstractComponent {
  time: number = 1;
  fullTime: number = 100;
  constructed: boolean = false;
  craftItemMap: ICraftItemMap;

  maxQueueLength: number = 9;
  craftQueue: string[] = [];

  count: number = 0;

  constructor(setting: {
    time: number;
    fullTime: number;
    craftItemMap: ICraftItemMap;
  }) {
    super(setting);
    this.time = setting.time || 1;
    this.fullTime = setting.fullTime || 100;
    this.craftItemMap = setting.craftItemMap || {};
  }

  craft(name: string) {
    if (this.craftItemMap[name]) {
      let entity = this.reflectParent();
      if (entity) {
        let game = entity.reflectParent();
        if (game) {
          game.appendEntityToMap(
            {
              type: name,
              position: new Point(entity.position)
            },
            this.craftItemMap[name]
          );
        }
      }
    }
  }

  addToQueue(key: string) {
    if (!this.constructed) {
      return;
    }
    if (
      this.craftItemMap[key] &&
      this.craftQueue.length < this.maxQueueLength
    ) {
      this.craftQueue.push(key);
    }
  }

  onTick() {
    if (this.constructed && this.craftQueue.length > 0) {
      let name = this.craftQueue[0];
      if (this.count >= this.craftItemMap[name].craftTime) {
        this.craft(name);
        this.count = 0;
      } else {
        this.count++;
      }
    }
    if (this.fullTime > 0) {
      this.fullTime -= this.time;
    } else {
      this.constructed = true;
    }
  }
}

store = {
  Unmovable,
  HP,
  Building
};
