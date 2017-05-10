import * as _ from 'lodash';
import { Path } from '../paths';
import {
  Property, PathProperty, ColorProperty,
  NumberProperty, EnumProperty, Inspectable,
} from '../properties';
import { Interpolator, INTERPOLATORS } from '.';

/**
 * An animation block is an individual layer property tween (property animation).
 */
@Property.register(
  new NumberProperty('startTime', { min: 0, isInteger: true }),
  new NumberProperty('endTime', { min: 0, isInteger: true }),
  new EnumProperty('interpolator', INTERPOLATORS),
)
export abstract class AnimationBlock<T extends AnimationBlockType> {

  constructor(obj: ConstructorArgs<T>) {
    this.id = obj.id || _.uniqueId();
    this.animationId = obj.animationId;
    this.layerId = obj.layerId;
    this.propertyName = obj.propertyName;
    this.startTime = obj.startTime || 0;
    this.endTime = obj.endTime || 100;
    if (this.startTime > this.endTime) {
      const tmp = this.endTime;
      this.endTime = this.startTime;
      this.startTime = tmp;
    }
    this.interpolator = obj.interpolator || INTERPOLATORS[0];
  }

  clone(): PathAnimationBlock | ColorAnimationBlock | NumberAnimationBlock {
    if (this instanceof PathAnimationBlock) {
      return new PathAnimationBlock(this);
    } else if (this instanceof ColorAnimationBlock) {
      return new ColorAnimationBlock(this);
    } else if (this instanceof NumberAnimationBlock) {
      return new NumberAnimationBlock(this);
    } else {
      throw new Error('Invalid class type');
    }
  }
}

interface AnimationBlockArgs<T> {
  id?: string;
  animationId: string;
  layerId: string;
  propertyName: string;
  startTime?: number;
  endTime?: number;
  interpolator?: Interpolator;
  fromValue?: T;
  toValue?: T;
}

type AnimationBlockType = string | number | Path;

export interface AnimationBlock<T extends AnimationBlockType>
  extends AnimationBlockArgs<T>, Inspectable { }

// tslint:disable-next-line
export interface ConstructorArgs<T extends AnimationBlockType>
  extends AnimationBlockArgs<T> { }

/**
 * An animation block that animates the 'pathData' property.
 */
@Property.register(
  new PathProperty('fromValue'),
  new PathProperty('toValue'),
)
export class PathAnimationBlock extends AnimationBlock<Path> { }

/**
 * An animation block that animates a color property.
 */
@Property.register(
  new ColorProperty('fromValue'),
  new ColorProperty('toValue'),
)
export class ColorAnimationBlock extends AnimationBlock<string> { }

/**
 * An animation block that animates a number property.
 */
@Property.register(
  new NumberProperty('fromValue'),
  new NumberProperty('toValue'),
)
export class NumberAnimationBlock extends AnimationBlock<number> { }
