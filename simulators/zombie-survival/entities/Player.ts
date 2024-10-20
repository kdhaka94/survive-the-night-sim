import { Position } from "../Position";
import { ZombieSurvival } from "../ZombieSurvival";
import { closestEntity } from "../lib/closestEntity";
import { Entity, EntityType } from "./Entity";

export class Player extends Entity {
  public static Destructible = true;
  public static Health = 1;
  public static ShootDistance = Infinity;

  private game: ZombieSurvival;

  public constructor(game: ZombieSurvival, position: Position) {
    super(EntityType.Player, Player.Destructible, Player.Health, position);
    this.game = game;
  }

  public shoot() {
    const zombie = closestEntity(this, this.game.getZombies());
    zombie.hit();
  }
}
