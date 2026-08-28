export interface StandardMouseVisualData {
  readonly heldButtons: readonly [boolean, boolean, boolean, boolean, boolean];
  readonly wheelDirection: 'up' | 'down' | 'horizontal' | null;
  readonly movementDetected: boolean;
}
