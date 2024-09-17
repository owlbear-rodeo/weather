import { buildEffect, Effect, isEffect, Item } from "@owlbear-rodeo/sdk";
import { Actor } from "../Actor";
import { Reconciler } from "../Reconciler";
import { WeatherConfig } from "../../../types/WeatherConfig";
import { getMetadata } from "../../../util/getMetadata";
import { getPluginId } from "../../../util/getPluginId";

import snow from "../../shaders/snow.frag";

export class WeatherActor extends Actor {
  // ID of the current effect item
  private effect: string;
  constructor(reconciler: Reconciler, parent: Item) {
    super(reconciler);
    const item = this.parentToEffect(parent);
    this.effect = item.id;
    this.reconciler.patcher.addItems(item);
  }

  delete(): void {
    this.reconciler.patcher.deleteItems(this.effect);
  }

  update(parent: Item) {
    const config = getMetadata<WeatherConfig>(
      parent.metadata,
      getPluginId("weather"),
      { type: "SNOW" }
    );
    this.reconciler.patcher.updateItems([
      this.effect,
      (item) => {
        if (isEffect(item)) {
          this.applyWeatherConfig(item, config);
        }
      },
    ]);
  }

  private parentToEffect(parent: Item) {
    const config = getMetadata<WeatherConfig>(
      parent.metadata,
      getPluginId("weather"),
      { type: "SNOW" }
    );
    const effect = buildEffect()
      .attachedTo(parent.id)
      .position(parent.position)
      .rotation(parent.rotation)
      .effectType("ATTACHMENT")
      .locked(true)
      .disableHit(true)
      .layer("MAP")
      .build();

    this.applyWeatherConfig(effect, config);

    return effect;
  }

  private getSkslFromConfig(_: WeatherConfig) {
    return snow;
  }

  private applyWeatherConfig(effect: Effect, config: WeatherConfig) {
    effect.uniforms = [
      { name: "tiling", value: config.tiling ?? 1 },
      { name: "direction", value: config.direction ?? { x: 1, y: 1 } },
      { name: "speed", value: config.speed ?? 1 },
      { name: "density", value: config.density ?? 1 },
    ];

    const sksl = this.getSkslFromConfig(config);
    if (effect.sksl !== sksl) {
      effect.sksl = sksl;
    }

    return effect;
  }
}