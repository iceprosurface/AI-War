import { Building } from "./mixins";
import { Entity } from "./entity";

export class GameMain {
  entityList: Entity[] = [];
  AIs: ((entity: Entity, game: GameMain) => void)[] = [
    function(entity: Entity) {
      if (entity.type === "barrack") {
        let component = entity.component("Building") as Building;
        component.addToQueue("car");
      }
    }
  ];

  constructor() {
    this.appendEntityToMap(
      {
        position: { x: 1, y: 1 },
        type: "barrack"
      },
      {
        Building: {
          fullTime: 20,
          craftItemMap: {
            car: {
              craftTime: 50
            }
          }
        }
      }
    );
  }

  idIn: number = 0;

  appendEntityToMap(addon: any, setting: any) {
    this.idIn++;
    let instance = new Entity(this.idIn, addon, setting);
    instance.reflectParent = () => this;
    this.entityList.push(instance);
  }

  /**
   * tick 开始操作
   */
  EntityUpdateBeforeTick() {
    this.entityList.forEach(function(entity) {
      entity.onTickStart();
    });
  }

  /**
   * tick 结束操作
   */
  EntityUpdateAfterTick() {
    this.entityList.forEach(function(entity) {
      entity.onTickEnd();
    });
  }

  /**
   * 分步执行 Entity 的操作
   */
  EntityTick() {
    this.entityList.forEach(function(entity: Entity) {
      entity.onTick();
    });
  }

  /**
   * 回收操作
   */
  CgEntity() {
    this.entityList
      .filter(function(entity) {
        return entity.willDestroy;
      })
      .forEach(entity => {
        this.entityList.splice(this.entityList.indexOf(entity), 1);
      });
  }

  /**
   * AI执行指定操作
   */
  AIAction() {
    this.AIs.forEach((ai: (entity: Entity, game: GameMain) => void) => {
      this.entityList.forEach(entity => {
        ai(entity, this);
      });
    });
  }

  tick() {
    this.EntityUpdateBeforeTick();
    this.EntityTick();
    this.EntityUpdateAfterTick();
    this.CgEntity();

    this.AIAction();
  }
}

var game = new GameMain();
setInterval(function() {
  // game.tick();
}, 100);
