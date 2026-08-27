export type DistanceUnit = 'cm' | 'in';

const CM_PER_INCH = 2.54;

export const convertDistance = (
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number | null => {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  if (from === to) {
    return value;
  }
  return from === 'cm' ? value / CM_PER_INCH : value * CM_PER_INCH;
};

export const distanceToInches = (value: number, unit: DistanceUnit): number | null => {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return unit === 'in' ? value : value / CM_PER_INCH;
};

export const calculateEstimatedDpi = (
  signedHorizontalUnits: number,
  distance: number,
  unit: DistanceUnit,
): number | null => {
  if (!Number.isFinite(signedHorizontalUnits)) {
    return null;
  }

  const distanceInches = distanceToInches(distance, unit);
  if (distanceInches === null) {
    return null;
  }

  const netHorizontalUnits = Math.abs(signedHorizontalUnits);
  if (netHorizontalUnits <= 0) {
    return null;
  }

  const estimate = netHorizontalUnits / distanceInches;
  return Number.isFinite(estimate) && estimate > 0 ? estimate : null;
};
