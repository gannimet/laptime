export function deg2Rad(angleDeg: number) {
  return (angleDeg * Math.PI) / 180;
}

export function rad2Deg(angleRad: number) {
  return (360 * angleRad) / (2 * Math.PI); 
}